import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import moment from 'moment';

import ExpensesAPI from '../services/ExpensesAPI';
import TotoEventBus from '../services/TotoEventBus';
import * as config from '../Config';

import './YearBubble.css';

const cookies = new Cookies();

export default class YearBubble extends Component {

  constructor(props) {
    super(props);

    this.state = {
      year: moment().format('YYYY'),
      user: cookies.get('user'),
      spending: 0
    }

    // Bindings
    this.load = this.load.bind(this);
    this.onExpenseCreated = this.onExpenseCreated.bind(this);
  }

  /**
   * When the component mount
   */
  componentDidMount() {

    this.load();

    // Subscriptions
    TotoEventBus.subscribeToEvent(config.EVENTS.expenseCreated, this.onExpenseCreated);
    TotoEventBus.subscribeToEvent(config.EVENTS.expenseUpdated, this.onExpenseCreated);
  }

  componentWillUnmount() {

    // Subscriptions
    TotoEventBus.unsubscribeToEvent(config.EVENTS.expenseCreated, this.onExpenseCreated);
    TotoEventBus.unsubscribeToEvent(config.EVENTS.expenseUpdated, this.onExpenseCreated);
  }

  /**
   * When an expense is created, reload
   */
  onExpenseCreated(event) {

    this.loadSpending();

  }

  /**
   * Load everything
   */
  load() {

    new ExpensesAPI().getSettings(this.state.user.email).then((data) => {
      this.setState({settings: data}, this.loadSpending);
    })

  }

  /**
   * Loads the current month spending
   */
  loadSpending() {

    // Define how many days in the past
    let targetCurrency = this.state.settings ? this.state.settings.currency : null;

    new ExpensesAPI().getExpensesPerYear(this.state.user.email, targetCurrency).then((data) => {

      if (data == null || data.years == null) {this.setState({loaded: true}); return;}

      for (var i = 0; i < data.years.length; i++) {
        if (data.years[i].year == this.state.year) {
          this.setState({amount: data.years[i].amount});
        }
      }

    });

  }

  render() {

    // Define the currency
    let currency = '€';
    if (this.state.settings && this.state.settings.currency) {
      if (this.state.settings.currency === 'DKK') currency = 'kr.';
    }

    return (
      <div className='year-bubble'>
        <div className='bubble'>
          <div className='currency'>{currency}</div>
          <div className='amount'>{Math.round(this.state.amount, 0).toLocaleString('it')}</div>
          <div className='month'>{this.state.year}</div>
        </div>
      </div>
    )
  }
}
