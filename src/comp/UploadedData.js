import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import moment from 'moment';
import Popup from 'reactjs-popup';

import TotoList from './TotoList';
import UploadedMonthExpensesSummary from './UploadedMonthExpensesSummary';
import ExpensesAPI from '../services/ExpensesAPI';
import TotoEventBus from '../services/TotoEventBus';
import * as config from '../Config';

import './UploadedData.css';

const cookies = new Cookies();

/**
 * Shows the uploaded data.
 * Requires
 * - data                 : an object { months: [] }
 *                          each month is a { id, yearMonth, uploadedOn, total, count}
 */
export default class UploadedData extends Component {

  constructor(props) {
    super(props);

    this.state = {
      user: cookies.get('user'),
      openDetailPopup: false
    }

    this.confirmMonth = this.confirmMonth.bind(this);
    this.extractor = this.extractor.bind(this);
    this.showPayments = this.showPayments.bind(this);
    this.openDetailPopup = this.openDetailPopup.bind(this);
    this.closeDetailPopup = this.closeDetailPopup.bind(this);

  } 

  /**
   * Confirms the specified month
   */
  confirmMonth(month) {

    month.selected = true;

    let months = [month];

    new ExpensesAPI().confirmUploads(months, this.state.user.email).then((data) => {

      // Send an event that an upload has been started
      TotoEventBus.publishEvent({name: config.EVENTS.expensesUploadConfirmed, context: {monthId: month.id}});

    })

  }

  /**
   * Shows the payments of the specified month
   * This does two things:
   * - shows the expenses as in the file
   * - shows the expenses in the Payments App
   */
  showPayments(month) {

    this.setState({

      selectedMonthId: month.id

    }, this.openDetailPopup);

  }

  /**
   * Data extractor
   */
  extractor(item) {

    // Defining highlights
    let highlights = [];
    if (item.uploading) highlights.push({image: require('../img/uploading.svg')});
    else if (item.uploading === false) highlights.push({image: require('../img/binoculars.svg'), onPress: this.showPayments});
    else highlights.push({image: require('../img/upload-cloud.svg'), onPress: this.confirmMonth});

    // Avatar
    let avatarImg;
    if (item.uploading === false) avatarImg = require('../img/tick.svg');

    return {
      avatar: {type: 'image', value: avatarImg},
      title: moment(item.yearMonth + '01', 'YYYYMMDD').format('MMMM YYYY'),
      highlights: highlights,
      amount: item.total.toFixed(2)
    }

  }

  /**
   * When an expense is clicked
   */
  openDetailPopup() {
    this.setState({openDetailPopup: true});
  }

  /**
   * Close the expense detail
   */
  closeDetailPopup() {
    this.setState({openDetailPopup: false});
  }

  render() {

    return (
      <div className="uploaded-data">
        <div className="title">This is what I found in the file</div>
        <div className="subtitle">Press the upload button on the months you want to confirm and the expenses will be posted to the Payments App</div>
        <TotoList
          data={this.props.data.months}
          dataExtractor={this.extractor}
        />

        <Popup
          on='click'
          offsetX={48}
          open={this.state.openDetailPopup}
          onClose={this.closeDetailPopup}
          overlayStyle={{backgroundColor: 'rgba(0,0,0,0.5)'}}
          contentStyle={{padding: 0, backgroundColor: '#007c91', borderRadius: '3px', border: 'none', boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)'}}
          arrow={false}
          >

          <UploadedMonthExpensesSummary monthId={this.state.selectedMonthId} />

        </Popup>

      </div>
    )

  }
}
