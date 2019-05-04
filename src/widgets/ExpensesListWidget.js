import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import moment from 'moment';

import MonthNavigator from '../comp/MonthNavigator';
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
    this.onMonthChange = this.onMonthChange.bind(this);
    this.onExpenseCreated = this.onExpenseCreated.bind(this);
    this.reload = this.reload.bind(this);

  }

  /**
   * When mounted
   */
  componentDidMount() {

    this.reload();

    // Subscriptions
    TotoEventBus.subscribeToEvent(config.EVENTS.expenseCreated, this.onExpenseCreated);
  }

  /**
   * When unmounting
   */
  componentWillUnmount() {

    // Subscriptions
    TotoEventBus.unsubscribeToEvent(config.EVENTS.expenseCreated, this.onExpenseCreated);
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
   * Extractor
   */
  dataExtractor(item) {

    let currency = item.currency;
    if (item.currency == 'EUR') currency = '€';
    else if (item.currency == 'DKK') currency = 'kr.'

    return {
      avatar: {
        type: 'image',
        value: categoriesMap.get(item.category).image,
        size: 'l'
      },
      title: item.description,
      amount: currency + ' ' + item.amount.toLocaleString('it')
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
            />
        </div>
      </div>
    )
  }
}
