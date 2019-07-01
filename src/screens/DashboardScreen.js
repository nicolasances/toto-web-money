import React, { Component } from 'react';
import './TotoScreen.css';
import './DashboardScreen.css';
import Cookies from 'universal-cookie';

import TotoDropzone from '../comp/TotoDropzone';
import TotoIconButton from '../comp/TotoIconButton';
import ExpensesUploadedData from '../comp/ExpensesUploadedData';
import UploadedMonthDetail from '../comp/UploadedMonthDetail';
import UploadedData from '../comp/UploadedData';
import RecentUploads from '../comp/RecentUploads';
import BankSelector from '../comp/BankSelector';
import ExpensesAPI from '../services/ExpensesAPI';
import TotoEventBus from '../services/TotoEventBus';
import ExpensesImportFlow from '../widgets/ExpensesImportFlow';
import * as config from '../Config';

const cookies = new Cookies();

export default class DashboardScreen extends Component { 

  constructor(props) {
    super(props);

    this.state = {
      files: [],
      bankChoiceVisible: false,
      uploading: false,
      user: cookies.get('user'),
      step: 1
    }

    this.onConfirmUpload = this.onConfirmUpload.bind(this);
    this.onSelectBank = this.onSelectBank.bind(this);
    this.onFileUploadReset = this.onFileUploadReset.bind(this);
    this.onCancelUploadedData = this.onCancelUploadedData.bind(this);
    this.onUploadingMonth = this.onUploadingMonth.bind(this);
    this.sendFile = this.sendFile.bind(this);
    this.clearState = this.clearState.bind(this);
    this.onUploadSelected = this.onUploadSelected.bind(this);
    this.resetSelectedMonth = this.resetSelectedMonth.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.checkMonthUploadStatus = this.checkMonthUploadStatus.bind(this);
    this.setMonthUploading = this.setMonthUploading.bind(this);
  }

  /**
   * The component has been mounted
   */
  componentDidMount() {

    TotoEventBus.subscribeToEvent(config.EVENTS.expensesUploadConfirmed, this.onUploadingMonth);

  }

  /**
   * The component has been mounted
   */
  componentWillUnmount() {

    TotoEventBus.unsubscribeToEvent(config.EVENTS.expensesUploadConfirmed, this.onUploadingMonth);

  }

  /**
   * Sends a file to the target URL
   */
  sendFile(file, bankCode) {

    return new Promise((success, failure) => {

      new ExpensesAPI().postExpensesFile(file, bankCode, this.state.user.email).then((data) => {

        setTimeout(() => {

          // Update the state, setting the uploaded data
          this.setState({uploading: false, uploadedData: data}, this.nextStep);

          // Fire an event (file uploaded)
          TotoEventBus.publishEvent({name: config.EVENTS.expensesFileUploaded});

          // Clear uploaded data after a bit
          // setTimeout(this.clearState, 30000);

        }, 1000);

      });

    });

  }

  /**
   * Clears the state
   */
  clearState() {

    // Remove the uploaded data
    this.setState({uploadedData: null, step: 1});

    // Reset the upload button
    this.onFileUploadReset();

    // Send a clear files event
    TotoEventBus.publishEvent({name: config.EVENTS.totoDropzoneClearFilesRequested});

  }

  /**
   * Reset the selected month
   */
  resetSelectedMonth() {
    this.setState({selectedMonth: null});
  }

  /**
   * When a month is being uploaded
   */
  onUploadingMonth(event) {

    // Set the month as "UPLOADING"
    this.setMonthUploading(event.context.monthId, true);

    // Start polling for the end of it
    setTimeout(() => {this.checkMonthUploadStatus(event.context.monthId)}, 100)

  }

  /**
   * Checks the upload status of the expenses of the month
   */
  checkMonthUploadStatus(monthId) {

    new ExpensesAPI().getUploadStatus(monthId).then((data) => {

      let done = true;

      // Check if any expense is still pending
      for (var i = 0 ; i < data.status.length; i++) {
        if (data.status[i].status !== 'OK') done = false;
      }

      // If still pending, keep polling
      if (!done) setTimeout(() => {this.checkMonthUploadStatus(monthId)}, 500);
      // Otherwise, update the month
      else this.setMonthUploading(monthId, false);

    })

  }

  /**
   * Updates the month as uploading or not, based on the params
   */
  setMonthUploading(monthId, uploading) {

    for (var i = 0 ; i < this.state.uploadedData.months.length ; i++) {

      let month = this.state.uploadedData.months[i];

      if (month.id === monthId) {

        // Set the month uploading status
        month.uploading = uploading;

        let months = this.state.uploadedData.months;
        months.splice(i, 1, month);

        // Update the state
        this.setState({uploadedData: {
          months: [...months]
        }});

      }
    }

  }

  /**
   * When the upload is confirmed, show the "bank" buttons
   */
  onConfirmUpload(files) {

    this.setState({files: files, bankChoiceVisible: true}, this.nextStep);

  }

  /**
   * When the upload is reset
   */
  onFileUploadReset() {
    this.setState({bankChoiceVisible: false, files: null});
  }

  /**
   * When the bank is selected, start the upload
   */
  onSelectBank(bankCode) {

    // Set the "uploading" prop
    this.setState({uploading: true}, () => {

      // Upload the files
      this.state.files.forEach(file => {
        this.sendFile(file, bankCode);
      });

    });
  }

  /**
   * The cancel button has been called on the ExpensesUploadedData dialog
   */
  onCancelUploadedData() {

    this.setState({uploadedData: null, bankChoiceVisible: false});

  }

  /**
   * When an upload is selected
   */
  onUploadSelected(selectedMonth) {

    // Reset the upload button state, removing the instructions, etc..
    this.clearState();

    // Load the data
    new ExpensesAPI().getUploadedMonth(selectedMonth.id).then((monthDetails) => {

      // Show the popup with the month data
      this.setState({selectedMonth: monthDetails});

    })

  }

  /**
   * Goes to the next step of the process
   */
  nextStep() {

    this.setState((state) => ({step: state.step + 1}));

  }

  render() {

    // Bank choice buttons
    let bankSelector;
    if (this.state.bankChoiceVisible) bankSelector = (
      <div className="bank-selector-container">
        <BankSelector onSelect={this.onSelectBank} disabled={this.state.uploading} label="Which bank issued the file?" />
      </div>
    )

    // Selected uploaded month (selected from the recent uploads)
    let selectedUploadedMonth;
    if (this.state.selectedMonth) selectedUploadedMonth = (
      <UploadedMonthDetail month={this.state.selectedMonth} onClose={this.resetSelectedMonth} />
    )

    // Classes
    let instructionsContainerClass = 'instructions-container';
    if (this.state.uploadedData) instructionsContainerClass += ' visible';

    // Steps of the workflow
    let step;
    if (this.state.step == 1 || this.state.step == 2) step = (
      <div className="step1">
        <TotoDropzone onConfirmedUpload={this.onConfirmUpload} uploading={this.state.uploading} onReset={this.onFileUploadReset}/>
        {bankSelector}
      </div>
    )
    else if (this.state.step == 3) step = (
      <div className="step2">
        <UploadedData data={this.state.uploadedData} />
      </div>
    )

    return (
      <div className="TotoScreen dashboard-screen">

        <div className="header">
          <div className="left"> <TotoIconButton image={require('../img/question.svg')} marginHorizontal={48} label="Help" /> </div>
          <div className="center"> <ExpensesImportFlow step={this.state.step} /> </div>
          <div className="right"> <TotoIconButton image={require('../img/reload.svg')} onPress={this.clearState} size="l" marginHorizontal={48} label="Restart" /> </div>
        </div>

        {step}

      </div>
    )
  }

}
