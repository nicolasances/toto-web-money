import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import moment from 'moment';

import TotoBarChart from '../comp/TotoBarChart';
import ExpensesAPI from '../services/ExpensesAPI';
import TotoEventBus from '../services/TotoEventBus';
import * as config from '../Config';
import categoriesMap from '../services/CategoriesMap';

const cookies = new Cookies();

export default class GraphTopCategoriesPerMonth extends Component {

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
    this.xAxisTransform = this.xAxisTransform.bind(this);
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
    let monthsBack = this.props.months ? this.props.months : 24;
    let yearMonthGte = moment().subtract(monthsBack, 'months').format('YYYYMM');

    new ExpensesAPI().getTopSpendingCategoriesPerMonth(this.state.user.email, yearMonthGte, targetCurrency).then((data) => {

      if (data == null || data.months == null) {this.setState({loaded: true}); return;}

      this.setState({months: null}, () => {
        this.setState({loaded: true, months: data.months}, this.prepareData);
      })

    });

  }

  /**
   * Prepares the data for the graph to display
   */
  prepareData() {

    let preparedData = [];

    if (!this.state.months) return;

    for (var i = 0; i < this.state.months.length; i++) {

      let month = this.state.months[i];

      preparedData.push({
        x: i,
        y: month.amount
      })
    }

    this.setState({preparedData: null}, () => {
      this.setState({preparedData: preparedData});
    })

  }

  /**
   * Create the x axis labels
   * Just show some of the months, since we expect to have many of those
   */
  xAxisTransform(value) {

    if (this.state.months == null) return;
    if (this.state.months[value] == null) return;

    let month = this.state.months[value];

    return moment(month.yearMonth + '01', 'YYYYMMDD').format('MMM YY');

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

    if (this.state.months == null) return;
    if (this.state.months.length <= index) return;
    if (this.state.months[index] == null) return;

    let month = this.state.months[index];

    let cat = categoriesMap.get(month.category);

    return cat.image;

  }

  render() {
    return (
      <div className='graph-top-categories-per-month' style={{display: 'flex', flex: 1}}>
        <TotoBarChart
          data={this.state.preparedData}
          xAxisTransform={this.xAxisTransform}
          valueLabelTransform={this.valueLabel}
          valueImage={this.valueImage}
          margins={{horizontal: 24, vertical: 12}}
          />
      </div>
    )
  }
}
