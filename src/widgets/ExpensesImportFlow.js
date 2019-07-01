import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import moment from 'moment';
import Popup from 'reactjs-popup';

import TotoEventBus from '../services/TotoEventBus';
import ExpensesImportFlowStep from './ExpensesImportFlowStep';
import * as config from '../Config';

import './ExpensesImportFlow.css';

const cookies = new Cookies();

export default class ExpensesImportFlow extends Component {

  constructor(props) {
    super(props);

    this.state = {
      user: cookies.get('user')
    }

    // Bindings

  }

  /**
   * When mounted
   */
  componentDidMount() {
    // Subscriptions
    // TotoEventBus.subscribeToEvent(config.EVENTS.expenseCreated, this.onExpenseCreated);
  }

  /**
   * When unmounting
   */
  componentWillUnmount() {
    // Subscriptions
    // TotoEventBus.unsubscribeToEvent(config.EVENTS.expenseCreated, this.onExpenseCreated);
  }

  render() {

    let separator1Class = "separator", separator2Class = "separator";
    if (this.props.step > 1) separator1Class += ' done';
    if (this.props.step > 2) separator2Class += ' done';

    return (
      <div className='expenses-import-flow'>
        <div className="pad"></div>
        <ExpensesImportFlowStep step="1" title="Upload a file" done={this.props.step > 1}  current={this.props.step == 1} />
        <div className={separator1Class}></div>
        <ExpensesImportFlowStep step="2" title="Select the Issuer" done={this.props.step > 2} current={this.props.step == 2}  />
        <div className={separator2Class}></div>
        <ExpensesImportFlowStep step="3" title="Confirm the data" done={this.props.step > 3} current={this.props.step == 3} />
        <div className="pad"></div>
      </div>
    )
  }
}
