import React, { Component } from 'react';

import GraphPastDaysExpenses from '../stats/GraphPastDaysExpenses';

import './ExpensesScreen.css';

export default class ExpensesScreen extends Component {

  render() {
    return (
      <div className="expenses-screen-container">
        <div className="line1">
          <div className="left"><GraphPastDaysExpenses /></div>
          <div className="center"></div>
          <div className="right"></div>
        </div>
      </div>
    )
  }
}
