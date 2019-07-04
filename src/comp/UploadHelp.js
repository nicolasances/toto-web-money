import React, { Component } from 'react';

import './UploadHelp.css';

export default class UploadHelp extends Component {

  render() {
    return (
      <div className="upload-help">
        <div className="title">How to...</div>
        <div className="subtitle">import your bank statements from Danske Bank</div>
        <div className="step">
          <div className="num">1</div>
          <div className="text-container">
            <div className="text">Go to your account and go to the list of expenses.</div>
          </div>
        </div>
        <div className="step">
          <div className="num">2</div>
          <div className="text-container">
            <div className="text">Select the appropriate period with the slider (e.g. 1st of June, 31st of June)</div>
            <div className="text small">You don't have to select only one month, you can select multiple months</div>
          </div>
        </div>
        <div className="step">
          <div className="num">3</div>
          <div className="text-container">
            <div className="text">When the list shows the months that you want to import in Toto, go to the bottom and press <i>Gem som fil</i></div>
            <div className="text">In the new screen, select <b>CSV</b> (not XML) and press <i>Gem</i></div>
          </div>
        </div>
        <div className="step">
          <div className="num">4</div>
          <div className="text-container">
            <div className="text">Save the file somewhere on your pc so that you can then upload it with the big button in the center of this page.</div>
          </div>
        </div>
        <div className="step">
          <div className="num">5</div>
          <div className="text-container">
            <div className="text">Pres the big "Upload" button, load the file and then select which bank this file waas taken from.</div>
          </div>
        </div>
        <div className="step">
          <div className="num">6</div>
          <div className="text-container">
            <div className="text">You will then be presented with the list of months that have been found in the file and the total of the payments (only the payments, not the incomes) that have been found in the file. Click on the yellow icon on the right of the months you want to import.</div>
            <div className="text small">Once the month is imported in the Payment app, you can review the expenses and compare them with what was found in the file clicking the little "goggles" button on the right of the imported month.</div>
          </div>
        </div>
      </div>
    )
  }
}
