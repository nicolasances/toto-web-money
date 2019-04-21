import React, { Component } from 'react';

import GraphPastDaysExpenses from '../stats/GraphPastDaysExpenses';
import GraphPastMonthsExpenses from '../stats/GraphPastMonthsExpenses';
import MonthBubble from '../stats/MonthBubble';

import './ExpensesScreen.css';

export default class ExpensesScreen extends Component {

  render() {
    return (
      <div className="expenses-screen-container">
        <div className="line1">
          <div className="left"><GraphPastDaysExpenses /></div>
          <div className="center"><MonthBubble /></div>
          <div className="right"><GraphPastMonthsExpenses /></div>
        </div>
      </div>
    )
  }
}
