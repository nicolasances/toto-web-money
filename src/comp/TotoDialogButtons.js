import React, { Component } from 'react';

import TotoIconButton from './TotoIconButton';

import './TotoDialogButtons.css';

import tick from '../img/tick.svg';
import cancel from '../img/close.svg';

export default class TotoDialogButtons extends Component {

  constructor(props) {
    super(props);

    this.onConfirm = this.onConfirm.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  /**
   * When the confirm action is pressed
   */
  onConfirm() {
    // If an action has been configured
    if (this.props.onConfirm) this.props.onConfirm();
  }

  /**
   * When the cancel action is pressed
   */
  onCancel() {
    // If an action has been configured
    if (this.props.onCancel) this.props.onCancel();
  }

  render() {
    return (
      <div className='toto-dialog-buttons'>
        <TotoIconButton image={tick} size='l' onPress={this.onConfirm} marginHorizontal={6}/>
        <TotoIconButton image={cancel} size='l' onPress={this.onCancel} marginHorizontal={6}/>
      </div>
    )
  }
}
