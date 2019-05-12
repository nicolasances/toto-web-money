import React, { Component } from 'react';
import moment from 'moment';
import Cookies from 'universal-cookie';

import TotoDashboardSection from './TotoDashboardSection';
import TotoIconButton from './TotoIconButton';
import TotoList from './TotoList';
import ExpensesAPI from '../services/ExpensesAPI';

import trash from '../img/trash.svg';

import './RecentUploads.css';

const cookies = new Cookies();

export default class RecentUploads extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      selectedItemsCount: 0,
      user: cookies.get('user'),
    }

    // Load the data
    this.loadData();

    this.onAvatarClick = this.onAvatarClick.bind(this);
    this.clearAll = this.clearAll.bind(this);
  }

  /**
   * Loads the recent uploads
   */
  loadData() {

    new ExpensesAPI().getUploads().then((data) => {

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

  /**
   * When an avatar is selected, activate the "delete" button
   */
  onAvatarClick(item, selected) {

    // Update the state
    this.setState(state => {
      const uploads = state.uploads.map((it, i) => {
        if (it.id === item.id) it.selected = selected;
        return it;
      });
      return {uploads}
    });

    if (selected) this.setState({selectedItemsCount: this.state.selectedItemsCount + 1})
    else this.setState({selectedItemsCount: this.state.selectedItemsCount - 1});

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
            onAvatarClick={this.onAvatarClick}
            />
      </div>
    )
  }
}
