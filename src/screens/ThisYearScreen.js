import React, { Component } from 'react';
import moment from 'moment';

import GraphPastDaysExpenses from '../stats/GraphPastDaysExpenses';
import GraphPastMonthsExpenses from '../stats/GraphPastMonthsExpenses';
import GraphPastYearsExpenses from '../stats/GraphPastYearsExpenses';
import GraphTopCategoriesPerMonth from '../stats/GraphTopCategoriesPerMonth';
import GraphTopCategoriesOfMonth from '../stats/GraphTopCategoriesOfMonth';
import YearBubble from '../stats/YearBubble';
import ExpensesListWidget from '../widgets/ExpensesListWidget';
import QuickExpense from '../widgets/QuickExpense';

import './ThisYearScreen.css';

export default class ThisYearScreen extends Component {

  render() {
    return (
      <div className="this-year-screen-container">
        <div className="line1">
          <div className="left">
            <div className="title"> In {moment().format('YYYY')} you've spent so far </div>
            <YearBubble />
          </div>
          <div className="right">
            <div className="widget">
              <div className="title"> Last year expenses </div>
              <GraphPastMonthsExpenses months={12} />
            </div>
          </div>
        </div>
        <div className="line2">
          <div className="title"> Highest monthly spending categories </div>
          <div className="description"> Those are the categories where you've spent the most for each month </div>
          <GraphTopCategoriesPerMonth months={12} />
        </div>
      </div>
    )
  }
}
