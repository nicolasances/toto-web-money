import React, { Component } from 'react';
import moment from 'moment';

import TotoDashboardSection from './TotoDashboardSection';
import TotoList from './TotoList';
import ExpensesAPI from '../services/ExpensesAPI';

import trash from '../img/trash.svg';

import './RecentUploads.css';

export default class RecentUploads extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      selectedItemsCount: 0
    }

    // Load the data
    this.loadData();

    this.onAvatarClick = this.onAvatarClick.bind(this);
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
        <TotoDashboardSection title="Recent uploads" empty={!this.state.uploads} loading={this.state.loading} actions={actions}>
          <TotoList
              data={this.state.uploads}
              dataExtractor={this.dataExtractor}
              onAvatarClick={this.onAvatarClick}
              />
        </TotoDashboardSection>
      </div>
    )
  }
}
