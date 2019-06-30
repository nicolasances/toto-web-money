import React, { Component } from 'react';
import moment from 'moment';
import Cookies from 'universal-cookie';

import TotoDashboardSection from './TotoDashboardSection';
import TotoIconButton from './TotoIconButton';
import TotoList from './TotoList';
import ExpensesAPI from '../services/ExpensesAPI';
import TotoEventBus from '../services/TotoEventBus';
import * as config from '../Config';

import trash from '../img/trash.svg';

import './RecentUploads.css';

const cookies = new Cookies();
const imgInProgress = require('../img/hourglass.svg');
const imgDone = require('../img/tick.svg');
const imgExclamation = require('../img/exclamation.svg');

export default class RecentUploads extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      selectedItemsCount: 0,
      user: cookies.get('user'),
    }

    // Binding
    this.loadData = this.loadData.bind(this);

    // Load the data
    this.loadData();

    this.clearAll = this.clearAll.bind(this);
  }

  /**
   * When mounted
   */
  componentDidMount() {

    TotoEventBus.subscribeToEvent(config.EVENTS.expensesFileUploaded, this.loadData);
  }

  /**
   * When unmounting
   */
  componentWillUnmount() {

    TotoEventBus.unsubscribeToEvent(config.EVENTS.expensesFileUploaded, this.loadData);
  }

  /**
   * Loads the recent uploads
   */
  loadData() {

    new ExpensesAPI().getUploads(this.state.user.email).then((data) => {

      this.setState({
        loading: false,
        uploads: data.months
      })
    }, () => {
      this.setState({loading: false});
    })

  }

  /**
   * Data extractor for the list
   */
  dataExtractor(item, index) {

    let avatarImage;
    if (item.status === 'INPROGRESS') avatarImage = imgInProgress;
    else if (item.status === 'POSTED') avatarImage = imgDone;
    else if (item.status === 'INCONSISTENT') avatarImage = imgExclamation;

    return {
      avatar: {
        type: 'image',
        value: avatarImage,
        size: 'm'
      },
      date: {
        yearMonth: moment(item.yearMonth + '01', 'YYYYMMDD').format('MMM YY')
      },
      title: item.count + ' expenses',
      amount: '€ ' + item.total.toFixed(2)
    }

  }

  /**
   * Deletes the selected items
   */
  deleteSelectedItems() {

  }

  /**
   * Clears all the recent uploads
   */
  clearAll() {

    new ExpensesAPI().deleteAllUploads(this.state.user.email).then(() => {
      this.loadData();
    })
  }

  /**
   * Retrieves the list of selected items
   */
  getSelectedItems() {

    if (this.state.uploads == null) return [];

    let selectedItems = [];

    for (var i = 0; i < this.state.uploads.length; i++) {

      if (this.state.uploads[i].selected) selectedItems.push(this.state.uploads[i]);
    }

    return selectedItems;

  }

  render() {

    // Define the actions that can be used on this section
    let actions = [];
    if (this.state.selectedItemsCount > 0) actions.push({name: 'delete', image: trash, onPress: this.deleteSelectedItems});

    return (
      <div className='recent-uploads'>
        <div className="header">
          <div className="title">Recent uploads</div>
          <div className="buttons-container">
            <TotoIconButton image={require('../img/trash.svg')} onPress={this.clearAll} />
          </div>
        </div>
        <TotoList
            data={this.state.uploads}
            dataExtractor={this.dataExtractor}
            onPress={this.props.onItemPress}
            />
      </div>
    )
  }
}
