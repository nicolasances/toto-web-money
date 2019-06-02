import React, { Component } from 'react';
import moment from 'moment';

import TotoIconButton from './TotoIconButton';
import TotoList from '../comp/TotoList';
import categoriesMap from '../services/CategoriesMap';

import './UploadedMonthDetail.css';

export default class UploadedMonthDetail extends Component {

  constructor(props) {
    super(props);

    this.state = {
      visible: false
    }

    // Animation
    setTimeout(() => {this.setState({visible: true})}, 50);

  }

  /**
   * Extractor for the expenses
   */
  dataExtractor(item) {

    let currency = item.currency;
    if (!item.currency || item.currency === 'EUR') currency = '€';
    else if (item.currency === 'DKK') currency = 'kr.'

    // Highlights
    let highlights = [];
    // Highlight - Imported from bank statement
    highlights.push({
      image: require('../img/bank.svg')
    });

    return {
      avatar: {
        type: 'image',
        value: categoriesMap.get('VARIE').image,
        size: 'l'
      },
      date: {date: item.date},
      title: item.description,
      amount: currency + ' ' + item.amount.toLocaleString('it'),
      highlights: highlights
    }

  }

  render() {

    // Class
    let mainClass = 'uploaded-month-detail';
    if (this.state.visible) mainClass += ' visible';

    return (
      <div className={mainClass}>
        <div className="header">
          <div className="title-container">
            <div className="title">{moment(this.props.month.yearMonth + '01', 'YYYYMMDD').format('MMMM DD')}</div>
            <div className="subtitle">{this.props.month.count} payments</div>
          </div>
          <div className="buttons-container">
            <TotoIconButton image={require('../img/trash.svg')} size='m' marginHorizontal={6} />
            <TotoIconButton image={require('../img/close.svg')} size='m' marginHorizontal={6} onPress={this.props.onClose} />
          </div>
        </div>
        <div className="confirm-container">
          <TotoIconButton image={require('../img/tick.svg')} size='l' label='Confirm the expenses' />
        </div>
        <div className="expenses-container">
          <TotoList
            data={this.props.month.expenses}
            dataExtractor={this.dataExtractor}
            />
        </div>
      </div>
    )
  }
}
