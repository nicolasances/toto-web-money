import React, { Component } from 'react';
import moment from 'moment';
import Cookies from 'universal-cookie';

import TotoIconButton from './TotoIconButton';
import TotoList from '../comp/TotoList';
import categoriesMap from '../services/CategoriesMap';
import ExpensesAPI from '../services/ExpensesAPI';
import TotoEventBus from '../services/TotoEventBus';
import * as config from '../Config';

import './UploadedMonthDetail.css';

const cookies = new Cookies();

export default class UploadedMonthDetail extends Component {

  constructor(props) {
    super(props);

    this.state = {
      user: cookies.get('user'),
      visible: false,
      uploading: false
    }

    // Animation
    setTimeout(() => {this.setState({visible: true})}, 50);

    // Binding
    this.onConfirm = this.onConfirm.bind(this);
    this.onExpensesUploadConfirmed = this.onExpensesUploadConfirmed.bind(this);

  }

  /**
   * Registrations
   */
  componentDidMount() {
    TotoEventBus.subscribeToEvent(config.EVENTS.expensesUploadConfirmed, this.onExpensesUploadConfirmed);
  }

  /**
   * De-Registrations
   */
  componentWillUnmount() {
    TotoEventBus.unsubscribeToEvent(config.EVENTS.expensesUploadConfirmed, this.onExpensesUploadConfirmed);
  }

  /**
   * Extractor for the expenses
   */
  dataExtractor(item) {

    let currency = item.currency;
    if (!item.currency || item.currency === 'EUR') currency = '€';
    else if (item.currency === 'DKK') currency = 'kr.'

    // Highlights
    let highlights = [];
    // Highlight - Imported from bank statement
    highlights.push({
      image: require('../img/bank.svg')
    });

    return {
      avatar: {
        type: 'image',
        value: categoriesMap.get('VARIE').image,
        size: 'l'
      },
      date: {date: item.date},
      title: item.description,
      amount: currency + ' ' + item.amount.toLocaleString('it'),
      highlights: highlights
    }

  }

  /**
   * Extractor for the uploading data
   */
  uploadedExpenseExtractor(item) {

    let currency = item.expense.currency;
    if (!item.expense.currency || item.expense.currency === 'EUR') currency = '€';
    else if (item.expense.currency === 'DKK') currency = 'kr.'

    let tick = require('../img/tick.svg');

    return {
      avatar: {
        type: 'image',
        value: item.status === 'OK' ? tick : null,
        size: 'l'
      },
      date: {date: item.expense.date},
      title: item.expense.description,
      amount: currency + ' ' + item.expense.amount.toLocaleString('it'),
    }

  }

  /**
   * Confirms the upload of the month
   */
  onConfirm() {

    this.props.month.selected = true;

    let months = [this.props.month];

    new ExpensesAPI().confirmUploads(months, this.state.user.email).then((data) => {

      // Send an event that an upload has been started
      TotoEventBus.publishEvent({name: config.EVENTS.expensesUploadConfirmed, context: {monthId: this.props.month.id}});

      // Show progress
      this.setState({uploading: true});

    })

  }

  /**
   * When the upload starts
   */
  onExpensesUploadConfirmed(event) {

    // Polling function
    var checkStatus = () => {

      new ExpensesAPI().getUploadStatus(event.context.monthId).then((data) => {

        // Check if all expenses are done
        let done = true;
        for (var i = 0; i < data.status.length; i++) {
          if (data.status[i].status !== 'OK') {done = false; break;}
        }

        // Update the state
        this.setState({uploadedExpenses: null}, () => {this.setState({uploadedExpenses: data.status})});

        // Keep polling
        if (!done) setTimeout(checkStatus, 100);

      })

    }

    // Start the polling
    setTimeout(checkStatus, 100);

  }

  render() {

    // Class
    let mainClass = 'uploaded-month-detail';
    if (this.state.visible) mainClass += ' visible';

    // Confirm button
    let confirm;
    if (this.props.month.status == null) confirm = (<TotoIconButton image={require('../img/tick.svg')} size='l' marginHorizontal={6} onPress={this.onConfirm} />)

    // Buttons container
    let buttonsContainer;
    if (!this.state.uploading) buttonsContainer = (
      <div className="buttons-container">
        {confirm}
        <TotoIconButton image={require('../img/trash.svg')} size='l' marginHorizontal={6} />
        <TotoIconButton image={require('../img/close.svg')} size='l' marginHorizontal={6} onPress={this.props.onClose} />
      </div>
    )

    // Expenses container
    let expenses;
    if (!this.state.uploading) expenses = (
      <TotoList
        data={this.props.month.expenses}
        dataExtractor={this.dataExtractor}
        />
    )

    // Uploading box
    let uploadingBox;
    if (this.state.uploading) uploadingBox = (
      <div className='uploading-container'>
        <div className='uploading-text'>Loading the expenses into the Payments app</div>
        <TotoList
          data={this.state.uploadedExpenses}
          dataExtractor={this.uploadedExpenseExtractor}
          />
      </div>
    )

    return (
      <div className={mainClass}>
        <div className="header">
          <div className="title-container">
            <div className="title">{moment(this.props.month.yearMonth + '01', 'YYYYMMDD').format('MMMM \'YY')}</div>
            <div className="subtitle">{this.props.month.count} payments</div>
          </div>
          {buttonsContainer}
        </div>
        <div className="expenses-container">
          {expenses}
          {uploadingBox}
        </div>
      </div>
    )
  }
}
