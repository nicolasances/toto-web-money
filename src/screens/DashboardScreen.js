import React, { Component } from 'react';
import './TotoScreen.css';
import './DashboardScreen.css';
import Cookies from 'universal-cookie';

import TotoDropzone from '../comp/TotoDropzone';
import ExpensesUploadedData from '../comp/ExpensesUploadedData';
import UploadedMonthDetail from '../comp/UploadedMonthDetail';
import RecentUploads from '../comp/RecentUploads';
import BankSelector from '../comp/BankSelector';
import ExpensesAPI from '../services/ExpensesAPI';
import TotoEventBus from '../services/TotoEventBus';
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
    }

    this.onConfirmUpload = this.onConfirmUpload.bind(this);
    this.onSelectBank = this.onSelectBank.bind(this);
    this.onFileUploadReset = this.onFileUploadReset.bind(this);
    this.onConfirmUploadedData = this.onConfirmUploadedData.bind(this);
    this.onCancelUploadedData = this.onCancelUploadedData.bind(this);
    this.sendFile = this.sendFile.bind(this);
    this.clearState = this.clearState.bind(this);
    this.onUploadSelected = this.onUploadSelected.bind(this);
    this.resetSelectedMonth = this.resetSelectedMonth.bind(this);
  }

  /**
   * Sends a file to the target URL
   */
  sendFile(file, bankCode) {

    return new Promise((success, failure) => {

      new ExpensesAPI().postExpensesFile(file, bankCode, this.state.user.email).then((data) => {

        setTimeout(() => {

          // Update the state, setting the uploaded data
          this.setState({uploading: false, uploadedData: data});

          // Fire an event (file uploaded)
          TotoEventBus.publishEvent({name: config.EVENTS.expensesFileUploaded});

          // Clear uploaded data after a bit
          setTimeout(this.clearState, 30000);

        }, 1000);

      });

    });

  }

  /**
   * Clears the state
   */
  clearState() {

    // Remove the uploaded data
    this.setState({uploadedData: null});

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
   * When the upload is confirmed, show the "bank" buttons
   */
  onConfirmUpload(files) {
    this.setState({bankChoiceVisible: true, files: files});
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
   * Called when the ExpensesUploadedData dialog gets confirmed
   * which means that expenses have been selected
   */
  onConfirmUploadedData() {

    // Time to upload the expenses!
    // TODO
    console.log(this.state.uploadedData);

    new ExpensesAPI().confirmUploads(this.state.uploadedData.months, this.state.user.email).then((data) => {
      console.log(data);
    })

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

      console.log(monthDetails);

    })

  }

  render() {

    // Bank choice buttons
    let bankSelector;
    if (this.state.bankChoiceVisible) bankSelector = (
      <div className="bank-selector-container">
        <BankSelector onSelect={this.onSelectBank} disabled={this.state.uploading} label="Which bank issued the file?" />
      </div>
    )

    // Upload successfull + instructions message
    let instructions;
    if (this.state.uploadedData) instructions = (
      <div className="instructions">
        <div className="title">File uploaded successfully!</div>
        <div className="message">
          <p>In the panel on the right, you'll now find the data that has been uploaded.</p>
          <p>Those are the expenses contained in the file, <b>grouped in months.</b></p>
          <p>Select a month to open the review panel. From the review panel you'll be able to confirm the expenses and import them into Toto.</p>
        </div>
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

    return (
      <div className="TotoScreen dashboard-screen">
        <div className="upload-section">
          <div style={{margin: '12px 0', display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
            <TotoDropzone onConfirmedUpload={this.onConfirmUpload} uploading={this.state.uploading} onReset={this.onFileUploadReset}/>
          </div>
          <div style={{margin: '12px 0', display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
            {bankSelector}
          </div>
          <div className={instructionsContainerClass}>
            {instructions}
          </div>

          {selectedUploadedMonth}
        </div>
        <div className="recent-uploads-section">
          <RecentUploads onItemPress={this.onUploadSelected} />
        </div>
      </div>
    )
  }

}
