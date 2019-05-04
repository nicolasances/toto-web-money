import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import moment from 'moment';

import ExpensesAPI from '../services/ExpensesAPI';
import TotoEventBus from '../services/TotoEventBus';
import * as config from '../Config';

import './MonthBubble.css';

const cookies = new Cookies();

export default class MonthBubble extends Component {

  constructor(props) {
    super(props);

    this.state = {
      yearMonth: moment().format('YYYYMM'),
      month: moment().format('MMMM'),
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
  }

  componentWillUnmount() {

    // Subscriptions
    TotoEventBus.unsubscribeToEvent(config.EVENTS.expenseCreated, this.onExpenseCreated);
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

    let targetCurrency = this.state.settings ? this.state.settings.currency : null;

    new ExpensesAPI().getMonthTotalSpending(this.state.user.email, this.state.yearMonth, targetCurrency).then((data) => {

      // Animate
      this.setState({spending: data.total});

    });
  }

  render() {

    // Define the currency
    let currency = '€';
    if (this.state.settings && this.state.settings.currency) {
      if (this.state.settings.currency == 'DKK') currency = 'kr.';
    }

    return (
      <div className='month-bubble'>
        <div className='bubble'>
          <div className='currency'>{currency}</div>
          <div className='amount'>{Math.round(this.state.spending, 0).toLocaleString('it')}</div>
          <div className='month'>{this.state.month}</div>
        </div>
      </div>
    )
  }
}
