import React, { Component } from 'react';
import moment from 'moment';

import TotoIconButton from './TotoIconButton';

import './MonthNavigator.css';

/**
 * Month navigator
 * Properties:
 * - onMonthChange          : (mandatory) callback(yearMonth) called at every month change
 */
export default class MonthNavigator extends Component {

  constructor(props) {
    super(props);

    this.state = {
      month: moment().format('YYYYMM')
    }

    // Bindings
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);

  }

  /**
   * Next month
   */
  next() {

    let month = moment(this.state.month + '01', 'YYYYMMDD').add(1, 'months').format('YYYYMM');

    this.setState({
      month: month
    })

    if (this.props.onMonthChange) this.props.onMonthChange(month);
  }

  /**
   * Previous month
   */
  prev() {

    let month = moment(this.state.month + '01', 'YYYYMMDD').subtract(1, 'months').format('YYYYMM');

    this.setState({
      month: month
    })

    if (this.props.onMonthChange) this.props.onMonthChange(month);
  }

  render() {
    return (
      <div className="month-navigator">
        <div className="left">
          <TotoIconButton
            image={require('../img/left-arrow.svg')}
            onPress={this.prev}
            />
        </div>
        <div className="center">
          <div className="month">{moment(this.state.month + '01', 'YYYYMMDD').format('MMMM')}</div>
          <div className="year">{moment(this.state.month + '01', 'YYYYMMDD').format('YYYY')}</div>
        </div>
        <div className="right">
          <TotoIconButton
            image={require('../img/right-arrow.svg')}
            onPress={this.next}
            />
        </div>
      </div>
    )
  }
}
