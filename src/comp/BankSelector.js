import React, { Component } from 'react';

import TouchableOpacity from './TouchableOpacity';

import './BankSelector.css';

export default class BankSelector extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedBank: null
    }

    this.select = this.select.bind(this);
  }

  /**
   * Selects the specified bank
   */
  select(bankCode) {

    if (this.props.disabled) return;

    this.setState({selectedBank: bankCode});

    if (this.props.onSelect) this.props.onSelect(bankCode);

  }

  render() {

    let containerStyle = 'bank-selector';
    if (this.props.disabled) containerStyle += ' disabled';

    let label = 'Pick a bank';
    if (this.props.label) label = this.props.label;

    return (
      <div className={containerStyle}>
        <div className="label">{label}</div>
        <div className="buttons-container">
          <BankButton text="UniC" onPress={() => {this.select("uc")}} selected={this.state.selectedBank === 'uc'}/>
          <BankButton text="Danske" onPress={() => {this.select("danske")}} selected={this.state.selectedBank === 'danske'}/>
        </div>
      </div>
    )
  }
}

/**
 * Currency item
 */
class BankButton extends Component {

  render() {

    let buttonStyle = 'bank-button';
    buttonStyle += this.props.selected ? ' selected' : ' unselected';

    return (
      <TouchableOpacity className={buttonStyle} onPress={this.props.onPress}>
        <div className="bank-button-label">{this.props.text}</div>
      </TouchableOpacity>
    )
  }

}
