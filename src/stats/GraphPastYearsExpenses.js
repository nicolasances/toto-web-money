import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import moment from 'moment';

import TotoBarChart from '../comp/TotoBarChart';
import ExpensesAPI from '../services/ExpensesAPI';

const cookies = new Cookies();

export default class GraphPastYearsExpenses extends Component {

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
    this.loadExpenses = this.loadExpenses.bind(this);
    this.xAxisTransform = this.xAxisTransform.bind(this);

  }

  /**
   * When the component mount
   */
  componentDidMount() {

    // Load
    this.load();

  }

  componentWillUnmount() {
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

    new ExpensesAPI().getExpensesPerYear(this.state.user.email, targetCurrency).then((data) => {

      if (data == null || data.years == null) {this.setState({loaded: true}); return;}

      this.setState({years: null}, () => {
        this.setState({loaded: true, years: data.years}, this.prepareData);
      })

    });

  }

  /**
   * Create the x axis labels
   * Just show some of the months, since we expect to have many of those
   */
  xAxisTransform(value) {

    if (this.state.years == null) return;
    if (this.state.years[value] == null) return;

    let year = this.state.years[value];

    return year.year;

  }

  /**
   * Prepares the data for the graph to display
   */
  prepareData() {

    let preparedData = [];

    if (!this.state.years) return;

    for (var i = 0; i < this.state.years.length; i++) {

      let year = this.state.years[i];

      preparedData.push({
        x: i,
        y: year.amount
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
    if (targetCurrency == 'EUR') currency = '€';
    else if (targetCurrency == 'DKK') currency = 'kr.';

    return currency + ' ' + Math.round(value,0).toLocaleString('it');
  }

  render() {
    return (
      <div className='graph-past-years-expenses'>
        <TotoBarChart
          data={this.state.preparedData}
          xAxisTransform={this.xAxisTransform}
          valueLabelTransform={this.valueLabel}
          maxHeight={100}
          margins={{horizontal: 24, vertical: 12}}
          />
      </div>
    )
  }
}
