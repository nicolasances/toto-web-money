import React, { Component } from 'react';

import GraphPastDaysExpenses from '../stats/GraphPastDaysExpenses';
import GraphPastMonthsExpenses from '../stats/GraphPastMonthsExpenses';
import GraphPastYearsExpenses from '../stats/GraphPastYearsExpenses';
import GraphTopCategoriesPerMonth from '../stats/GraphTopCategoriesPerMonth';
import GraphTopCategoriesOfMonth from '../stats/GraphTopCategoriesOfMonth';
import MonthBubble from '../stats/MonthBubble';
import ExpensesListWidget from '../widgets/ExpensesListWidget';
import QuickExpense from '../widgets/QuickExpense';

import './ExpensesScreen.css';

export default class ExpensesScreen extends Component {

  render() {
    return (
      <div className="expenses-screen-container">
        <div className="line1">
          <div className="left"> <GraphPastDaysExpenses /> </div>
          <div className="center"> <MonthBubble /> </div>
          <div className="right"> <GraphPastMonthsExpenses /> </div>
        </div>
        <div className="line2">
          <div className="left">
            <div className="line1">
              <div className="left">
                <div className="line1"> <GraphPastYearsExpenses /> </div>
                <div className="line2"> <QuickExpense /> </div>
              </div>
              <div className="right"> <GraphTopCategoriesOfMonth /> </div>
            </div>
            <div className="line2"> <GraphTopCategoriesPerMonth /> </div>
          </div>
          <div className="right"> <ExpensesListWidget /> </div>
        </div>
      </div>
    )
  }
}
