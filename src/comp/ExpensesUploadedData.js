import React, { Component } from 'react';
import moment from 'moment';

import TotoIcon from './TotoIcon';
import TotoList from './TotoList';
import TotoDialogButtons from './TotoDialogButtons';

import './ExpensesUploadedData.css';

export default class ExpensesUploadedData extends Component {

  constructor(props) {
    super(props);

    this.onSelectItem = this.onSelectItem.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  /**
   * When an item gets selected
   */
  onSelectItem(item, selected) {

    if (this.props.onSelectItem) this.props.onSelectItem(item, selected);

  }

  /**
   * Go ahead and import the stuff you selected
   */
  onConfirm() {
    // If someone cares...
    if (this.props.onConfirm) this.props.onConfirm();
  }

  /**
   * Cancel everything!
   */
  onCancel() {
    // If someone cares...
    if (this.props.onCancel) this.props.onCancel();
  }

  /**
   * Extracts the data to the TotoList
   */
  dataExtractor(item, index) {

    return {
      avatar: {
        type: 'select',
        value: '',
        size: 'm'
      },
      date: {
        yearMonth: moment(item.yearMonth + '01', 'YYYYMMDD').format('MMM YY')
      },
      title: item.count + ' expenses',
      amount: '€ ' + item.total
    }

  }

  render() {

    let containerClass = 'expenses-uploaded-data';
    if (this.props.visible) containerClass += ' visible';

    // Rows container
    let rowsContainer;
    if (this.props.uploadedData && this.props.uploadedData.months) rowsContainer = (
      <div className='rows-container'>
        <TotoList
            data={this.props.uploadedData.months}
            dataExtractor={this.dataExtractor}
            onAvatarClick={this.onSelectItem}
            />
      </div>
    )

    return (
      <div className={containerClass}>
        <div className='header'>
          <div className='label' style={{flex: 1}}>The following was found. Select what should be imported</div>
          <TotoIcon image={require('../img/tick.svg')} size='s' />
          <div className='label'>File successfully uploaded</div>
        </div>
        {rowsContainer}
        <TotoDialogButtons onConfirm={this.onConfirm} onCancel={this.onCancel} />
      </div>
    )
  }
}
