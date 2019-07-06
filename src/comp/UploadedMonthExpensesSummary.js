import React, { Component } from 'react';
import Cookies from 'universal-cookie';

import TotoList from './TotoList';
import ExpensesAPI from '../services/ExpensesAPI';
import categoriesMap from '../services/CategoriesMap';

import './UploadedMonthExpensesSummary.css';

const cookies = new Cookies();

export default class UploadedMonthExpensesSummary extends Component {

  constructor(props) {
    super(props);

    this.state = {
      user: cookies.get('user')
    }

    this.loadData = this.loadData.bind(this);
  }

  /**
   * Load the data
   */
  componentDidMount() {

    this.loadData();

  }

  /**
   * Loads the data
   */
  loadData() {

    // Load the uploaded data (expenses taken from the file)
    new ExpensesAPI().getUploadStatus(this.props.monthId).then((data) => {
      this.setState({uploadedMonths: data.status});
    })

    // Load the payment expenses
    new ExpensesAPI().getExpensesWithTag(this.state.user.email, "monthId:" + this.props.monthId).then((data) => {
      this.setState({expenses: data.expenses});
    })

  }

  /**
   * Extractor for the list
   */
  extractUploadedMonthsData(item) {

    let currency = '';
    if (item.expense.currency === 'EUR') currency = '€';
    else if (item.expense.currency === 'DKK') currency = 'kr.';

    let categoryImg = categoriesMap.get(item.expense.category).image;

    return {
      title: item.expense.description,
      amount: currency + ' ' + item.expense.amount.toLocaleString('it'),
      avatar: {type: 'image', value: categoryImg, size: 'l'},
      date: {date: item.expense.date}
    }

  }

  /**
   * Extractor for the list of payments
   */
  extractExpenseData(item) {

    let currency = '';
    if (item.currency === 'EUR') currency = '€';
    else if (item.currency === 'DKK') currency = 'kr.';

    let categoryImg = categoriesMap.get(item.category).image;

    return {
      title: item.description,
      amount: currency + ' ' + item.amount.toLocaleString('it'),
      avatar: {type: 'image', value: categoryImg, size: 'l'},
      date: {date: item.date}
    }

  }

  render() {

    // Left list : uploaded expense
    let leftList = (
      <div className="left-list">
        <div className="title">Expenses from your Bank Statement</div>
        <div className="subtitle">#{this.state.uploadedMonths ? this.state.uploadedMonths.length : 0} statements</div>
        <TotoList
          data={this.state.uploadedMonths}
          dataExtractor={this.extractUploadedMonthsData}
        />
      </div>
    )

    // Right list : payments app expenses
    let rightList = (
      <div className="right-list">
        <div className="title">Expenses found in your Payments App</div>
        <div className="subtitle">#{this.state.expenses ? this.state.expenses.length : 0} payments</div>
        <TotoList
          data={this.state.expenses}
          dataExtractor={this.extractExpenseData}
        />
      </div>
    )

    return (
      <div className="uploaded-month-expenses-summary">
        {leftList}
        {rightList}
      </div>
    )
  }
}
