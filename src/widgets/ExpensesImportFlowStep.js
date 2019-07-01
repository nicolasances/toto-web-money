import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import moment from 'moment';
import Popup from 'reactjs-popup';

import TotoEventBus from '../services/TotoEventBus';
import * as config from '../Config';

import './ExpensesImportFlowStep.css';

const cookies = new Cookies();

export default class ExpensesImportFlowStep extends Component {

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

    let classes = "expenses-import-flow-step";
    if (this.props.current) classes += " current";
    if (this.props.done) classes += " done";

    return (
      <div className={classes}>

        <div className="step">{this.props.step}</div>
        <div className="label">{this.props.title}</div>

      </div>
    )
  }
}
