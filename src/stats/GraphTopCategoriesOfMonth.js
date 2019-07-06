import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import moment from 'moment';

import TotoBarChart from '../comp/TotoBarChart';
import ExpensesAPI from '../services/ExpensesAPI';
import TotoEventBus from '../services/TotoEventBus';
import * as config from '../Config';
import categoriesMap from '../services/CategoriesMap';

import './GraphTopCategoriesOfMonth.css';

const cookies = new Cookies();

export default class GraphTopCategoriesOfMonth extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      user: cookies.get('user'),
    }

    // Binding
    this.load = this.load.bind(this);
    this.prepareData = this.prepareData.bind(this);
    this.valueLabel = this.valueLabel.bind(this);
    this.valueImage = this.valueImage.bind(this);
    this.loadExpenses = this.loadExpenses.bind(this);
    this.onExpenseCreated = this.onExpenseCreated.bind(this);

  }

  /**
   * When the component mount
   */
  componentDidMount() {

    // Load
    this.load();

    // Subscriptions
    TotoEventBus.subscribeToEvent(config.EVENTS.expenseCreated, this.onExpenseCreated);
    TotoEventBus.subscribeToEvent(config.EVENTS.expenseUpdated, this.onExpenseCreated);
    TotoEventBus.subscribeToEvent(config.EVENTS.expenseDeleted, this.onExpenseCreated);

  }

  componentWillUnmount() {

    // Subscriptions
    TotoEventBus.unsubscribeToEvent(config.EVENTS.expenseCreated, this.onExpenseCreated);
    TotoEventBus.unsubscribeToEvent(config.EVENTS.expenseUpdated, this.onExpenseCreated);
    TotoEventBus.unsubscribeToEvent(config.EVENTS.expenseDeleted, this.onExpenseCreated);
  }

  /**
   * When an expense is created, reload
   */
  onExpenseCreated(event) {

    this.loadExpenses();

  }

  /**
   * Load everything
   */
  load() {

    new ExpensesAPI().getSettings(this.state.user.email).then((data) => {
      // Set state
      this.setState({settings: data}, this.loadExpenses);
    })

  }

  /**
   * Loads the last x days of spending (just the totals)
   */
  loadExpenses() {

    // Define how many days in the past
    let targetCurrency = this.state.settings ? this.state.settings.currency : null;
    let yearMonth = moment().format('YYYYMM');
    let maxCategories = 12;

    new ExpensesAPI().getTopSpendingCategoriesOfMonth(this.state.user.email, yearMonth, maxCategories, targetCurrency).then((data) => {

      if (data == null || data.categories == null) {this.setState({loaded: true}); return;}

      this.setState({categories: null}, () => {
        this.setState({loaded: true, categories: data.categories}, this.prepareData);
      })

    });

  }

  /**
   * Prepares the data for the graph to display
   */
  prepareData() {

    let preparedData = [];

    if (!this.state.categories) return;

    for (var i = 0; i < this.state.categories.length; i++) {

      let cat = this.state.categories[i];

      preparedData.push({
        x: i,
        y: cat.amount
      })
    }

    this.setState({preparedData: null}, () => {
      this.setState({preparedData: preparedData});
    })

  }

  /**
   * Defines the label for the value
   */
  valueLabel(value) {

    if (value == null) return '';

    let targetCurrency = this.state.settings ? this.state.settings.currency : 'EUR';
    let currency = targetCurrency;
    if (targetCurrency === 'EUR') currency = '€';
    else if (targetCurrency === 'DKK') currency = 'kr.';

    return currency + ' ' + Math.round(value,0).toLocaleString('it');
  }

  /**
   * Retrieves the image of the category for the provided expense
   */
  valueImage(item, index) {

    if (this.state.categories == null) return;
    if (this.state.categories.length <= index) return;
    if (this.state.categories[index] == null) return;

    let cat = this.state.categories[index];

    return categoriesMap.get(cat.category).image;

  }

  render() {
    return (
      <div className='graph-top-categories-of-month' style={{display: 'flex', flex: 1}}>
        <TotoBarChart
          data={this.state.preparedData}
          valueLabelTransform={this.valueLabel}
          valueImage={this.valueImage}
          margins={{horizontal: 24, vertical: 12}}
          />
        <div className='title'>Spending categories of the month</div>
      </div>
    )
  }
}
