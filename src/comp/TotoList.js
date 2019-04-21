import React, { Component } from 'react';

import TotoListAvatar from './TotoListAvatar';

import './TotoList.css';

/**
 * Displays a list of items
 * Properties:
 * - data                 : (mandatory) the data to be provided as an []
 * - dataExtractor        : (mandatory) the data extractor. A (items) => {} that will return an object:
 *                          { avatar  : {
 *                              type :  the type of avatar: 'image', 'text', 'number', 'select' (selectable radio button)
 *                              value:  the value to display in the avatar. Based on the type, can be an image, text, etc.
 *                              size :  the size of the avatar. Can be 's', 'ms', 'm', 'l', 'xl'
 *                            },
 *                            date  :   a date, if any, to display. It's an {} in the following form: {
 *                              yearMonth : a date in a yearMonth format
 *                            },
 *                            title :   the main text to be displayed on the row
 *                            amount :  an amount to display (typically at the end of the row)
 *                          }
 * - onAvatarClick        : (optional) function(item, selected) invoked when the avatar is clicked.
 *                          The function will receive the item clicked and the indication if it is selected or unselected
 */
export default class TotoList extends Component {

  constructor(props) {
    super(props);

    this.buildItems = this.buildItems.bind(this);
  }

  /**
   * Builds the items of the list
   */
  buildItems(data) {

    let items = [];

    for (var i = 0; i < data.length; i++) {

      let itemData = this.props.dataExtractor(data[i], i);
      let key = 'TotoListItem-' + i + '-' + Math.random();

      items.push((
        <Item key={key} data={itemData} item={data[i]} onAvatarClick={this.props.onAvatarClick} />
      ))
    }

    return items;
  }

  render() {

    let items;
    if (this.props.data && this.props.data.length > 0) items = this.buildItems(this.props.data);

    return (
      <div className='toto-list'>
        {items}
      </div>
    )
  }
}

class Item extends Component {

  constructor(props) {
    super(props);

    this.onItemAvatarClick = this.onItemAvatarClick.bind(this);
  }

  /**
   * Reacts to the avatar click
   */
  onItemAvatarClick() {

    let selected = this.props.item.selected == null ? false : this.props.item.selected;
    selected = !selected;

    // If there's a configured callback
    if (this.props.onAvatarClick) this.props.onAvatarClick(this.props.item, selected);

  }


  render() {

    let data = this.props.data;

    // Avatar
    let avatar;
    if (data.avatar) {
      // Avatar size
      let avatarSize = data.avatar.size ? data.avatar.size : 'm';
      // Text
      if (data.avatar.type === 'text') {
        avatar = (<TotoListAvatar text={data.avatar.value} size={avatarSize} />)
      }
      // Number
      if (data.avatar.type === 'number') {
        avatar = (<TotoListAvatar text={data.avatar.value} size={avatarSize} />)
      }
      // Image
      else if (data.avatar.type === 'image') {
        avatar = (<TotoListAvatar image={data.avatar.value} size={avatarSize} />)
      }
      // Select
      else if (data.avatar.type === 'select') {
        avatar = (<TotoListAvatar text='' selected={this.props.item.selected} size={avatarSize} onPress={this.onItemAvatarClick} />)
      }
    }

    // Date in case any
    let date;
    if (data.date) {
      // In case of a yearMonth
      if (data.date.yearMonth) {
        date = (<div className='yearMonth'>{data.date.yearMonth}</div>)
      }
    }

    // Main text of the item
    let title;
    if (data.title) {
      title = (<div className='item-title'>{data.title}</div>)
    }

    // Amount if any
    let amount;
    if (data.amount) {
      amount = (<div className='item-amount'>{data.amount}</div>)
    }

    return (
      <div className='item'>
        {avatar}
        {date}
        {title}
        {amount}
      </div>
    )
  }
}
