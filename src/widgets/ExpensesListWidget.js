import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import moment from 'moment';
import Popup from 'reactjs-popup';

import MonthNavigator from '../comp/MonthNavigator';
import ExpenseDetail from '../comp/ExpenseDetail';
import ExpensesAPI from '../services/ExpensesAPI';
import TotoList from '../comp/TotoList';
import categoriesMap from '../services/CategoriesMap';
import TotoEventBus from '../services/TotoEventBus';
import * as config from '../Config';

import './ExpensesListWidget.css';

const cookies = new Cookies();

export default class ExpensesListWidget extends Component {

  constructor(props) {
    super(props);

    this.state = {
      user: cookies.get('user'),
      yearMonth: moment().format('YYYYMM')
    }

    // Bindings
    this.dataExtractor = this.dataExtractor.bind(this);
    this.onMonthChange = this.onMonthChange.bind(this);
    this.onExpenseCreated = this.onExpenseCreated.bind(this);
    this.onReconcilePress = this.onReconcilePress.bind(this);
    this.openDetailPopup = this.openDetailPopup.bind(this);
    this.closeDetailPopup = this.closeDetailPopup.bind(this);
    this.selectExpense = this.selectExpense.bind(this);
    this.reload = this.reload.bind(this);

  }

  /**
   * When mounted
   */
  componentDidMount() {

    this.reload();

    // Subscriptions
    TotoEventBus.subscribeToEvent(config.EVENTS.expenseCreated, this.onExpenseCreated);
    TotoEventBus.subscribeToEvent(config.EVENTS.expenseUpdated, this.onExpenseCreated);
  }

  /**
   * When unmounting
   */
  componentWillUnmount() {

    // Subscriptions
    TotoEventBus.unsubscribeToEvent(config.EVENTS.expenseCreated, this.onExpenseCreated);
    TotoEventBus.unsubscribeToEvent(config.EVENTS.expenseUpdated, this.onExpenseCreated);
  }

  /**
   * Reload
   */
  reload() {

    new ExpensesAPI().getExpenses(this.state.user.email, this.state.yearMonth).then((data) => {
      this.setState({expenses: data ? data.expenses : null});
    })

  }

  /**
   * When the month changes, reload
   */
  onMonthChange(yearMonth) {

    this.setState({yearMonth: yearMonth}, this.reload)

  }

  /**
   * When an expense is created, reload
   */
  onExpenseCreated(event) {

    this.reload();

  }

  /**
   * When an item's reconcile button is pressed
   */
  onReconcilePress(item) {

    // 1. Reconcile
    new ExpensesAPI().consolidateExpense(item.id).then((data) => {

      // 2. Reload
      this.reload();

    })

  }

  selectExpense(item) {
    // Select the expense
    this.setState({selectedExpense: item});
    // Open the detail popup
    this.openDetailPopup();
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

  /**
   * Extractor
   */
  dataExtractor(item) {

    let currency = item.currency;
    if (item.currency === 'EUR') currency = '€';
    else if (item.currency === 'DKK') currency = 'kr.'

    // Highlights
    let highlights = [];
    // Highlight - Consolildation icon
    if (!item.consolidated) highlights.push({
      image: require('../img/reconcile.svg'),
      onPress: this.onReconcilePress
    })
    // Highlight - Imported from bank statement
    if (item.additionalData && item.additionalData.source === 'bank-statement') highlights.push({
      image: require('../img/bank.svg')
    })

    return {
      avatar: {
        type: 'image',
        value: categoriesMap.get(item.category).image,
        size: 'l'
      },
      date: {date: item.date},
      title: item.description,
      amount: currency + ' ' + item.amount.toLocaleString('it'),
      highlights: highlights
    }

  }

  render() {
    return (
      <div className='expenses-list-widget'>
        <div className='header'>
          <div className='title'>Your expenses, month of</div>
          <MonthNavigator onMonthChange={this.onMonthChange} />
        </div>
        <div className='body'>
          <TotoList
            data={this.state.expenses}
            dataExtractor={this.dataExtractor}
            onPress={this.selectExpense}
            />
        </div>

        <Popup
          on='click'
          offsetX={48}
          open={this.state.openDetailPopup}
          onClose={this.closeDetailPopup}
          overlayStyle={{backgroundColor: 'rgba(0,0,0,0.5)'}}
          contentStyle={{padding: 0, backgroundColor: '#007c91', borderRadius: '3px', border: 'none', boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)'}}
          arrow={false}
          >

            <ExpenseDetail expense={this.state.selectedExpense} />

        </Popup>

      </div>
    )
  }
}
