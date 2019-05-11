import React, { Component } from 'react';
import Popup from "reactjs-popup";

import TouchableOpacity from './TouchableOpacity';

import './TotoCurrencySelector.css';

/**
 * Currency selector for Toto
 * Properties:
 * - initialValue             : initial value of the currency (e.g. 'EUR')
 */
export default class TotoCurrencySelector extends Component {

  constructor(props) {
    super(props);

    this.state = {
      value: this.props.initialValue,
      changed: false
    }

    // Binding
    this.selectCurrency = this.selectCurrency.bind(this);
  }

  /**
   * Selects a currency
   */
  selectCurrency(c) {

    this.setState({value: c, changed: true});

    if (this.props.onChange) this.props.onChange(c);

  }

  render() {

    let displayedClass = 'displayed-currency';
    displayedClass += ' ' + (this.props.size ? this.props.size : 'm');

    let displayedCurrency = (
      <div className={displayedClass}>
        {this.state.value}
      </div>
    )

    return (
      <div className='toto-currency-selector'>
        <Popup
          trigger={displayedCurrency}
          on='click'
          position='top center'
          closeOnDocumentClick={true}
          closeOnEscape={true}
          overlayStyle={{backgroundColor: 'rgba(0,0,0,0.5)'}}
          contentStyle={{backgroundColor: '#007c91', borderRadius: '3px', border: 'none', boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)'}}
          arrow={false}
          >
          <div className='popup'>
            <div className='title'>Select a currency</div>
            <div className='currencies-container'>
              <CurrencyButton text='EUR' selected={this.state.value === 'EUR'} onPress={() => {this.selectCurrency('EUR')}} />
              <CurrencyButton text='DKK' selected={this.state.value === 'DKK'} onPress={() => {this.selectCurrency('DKK')}} />
            </div>
          </div>
        </Popup>
      </div>
    )
  }
}

/**
 * Currency item
 */
class CurrencyButton extends Component {

  render() {

    let buttonStyle = 'curr-button';
    buttonStyle += this.props.selected ? ' selected' : ' unselected';

    return (
      <TouchableOpacity className={buttonStyle} onPress={this.props.onPress}>
        <div className="curr-button-label">{this.props.text}</div>
      </TouchableOpacity>
    )
  }

}
