import React, { Component } from 'react';
import './TotoScreen.css';
import './DashboardScreen.css';
import Cookies from 'universal-cookie';

import TotoDropzone from '../comp/TotoDropzone';
import ExpensesUploadedData from '../comp/ExpensesUploadedData';
import RecentUploads from '../comp/RecentUploads';
import BankSelector from '../comp/BankSelector';
import ExpensesAPI from '../services/ExpensesAPI';

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
    this.onSelectedItemFromUploadedData = this.onSelectedItemFromUploadedData.bind(this);
    this.sendFile = this.sendFile.bind(this);
  }

  /**
   * Sends a file to the target URL
   */
  sendFile(file, bankCode) {

    return new Promise((success, failure) => {

      new ExpensesAPI().postExpensesFile(file, bankCode, this.state.user.email).then((data) => {

        setTimeout(() => {this.setState({uploading: false, uploadedData: data});}, 1000);

      });

    });

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
      })

    });
  }

  /**
   * Called when the ExpensesUploadedData dialog gets confirmed
   * which means that expenses have been selected
   */
  onConfirmUploadedData() {

    // Time to upload the expenses!
    // TODO

  }

  /**
   * The cancel button has been called on the ExpensesUploadedData dialog
   */
  onCancelUploadedData() {

    this.setState({uploadedData: null, bankChoiceVisible: false});

  }

  /**
   * Reacts to the selection of an item in the list of uploaded items
   */
  onSelectedItemFromUploadedData(item, selected) {

    // Update the state
    this.setState(state => {
      const uploads = state.uploadedData.months.map((it, i) => {
        if (it.id === item.id) it.selected = selected;
        return it;
      });
      return {uploadedData: {months: uploads}}
    });

  }

  render() {

    // Bank choice buttons
    let bankSelector;
    if (this.state.bankChoiceVisible) bankSelector = (
      <div className="bank-selector-container">
        <BankSelector onSelect={this.onSelectBank} disabled={this.state.uploading} label="Which bank issued the file?" />
      </div>
    )

    return (
      <div className="TotoScreen dashboard-screen">
        <div className="upload-section">
          <div style={{margin: '12px 0', display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
            <TotoDropzone onConfirmedUpload={this.onConfirmUpload} uploading={this.state.uploading} onReset={this.onFileUploadReset}/>
          </div>
          <div style={{margin: '12px 0', display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
            {bankSelector}
          </div>
          <div style={{margin: '12px 0', display: 'flex', alignItems: 'stretch', flexDirection: 'column'}}>
            <ExpensesUploadedData visible={this.state.uploadedData != null} uploadedData={this.state.uploadedData} onSelectItem={this.onSelectedItemFromUploadedData} onConfirm={this.onConfirmUploadedData} onCancel={this.onCancelUploadedData} />
          </div>
        </div>
        <div className="recent-uploads-section">
          <RecentUploads />
        </div>
      </div>
    )
  }

}
