import React, { Component } from 'react';

import './TotoAmountInput.css';

export default class TotoAmountInput extends Component {

  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
      prevValue: props.value
    }

    // Bindings
    this.onFocus = this.onFocus.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  /**
   * Clear the value
   */
  onFocus() {
    this.setState({
      value: '',
      prevValue: this.state.value
    })
  }

  /**
   * When blurred check if there's a value, otherwise restore the previous one
   */
  onBlur() {

    if (this.state.value.trim() === '') this.setState({value: this.state.prevValue});

  }

  /**
   * When a keyboard key is pressed
   */
  onKeyPress(e) {

    if (e.key === 'Enter') {
      if (this.props.onPressEnter) this.props.onPressEnter();
    }

  }

  /**
   * When the text changes, update the state
   */
  onChange(event) {
    // Format new value
    let newValue = event.target.value.replace(',', '.');
    // Update the state
    this.setState({value: newValue});
    // Propagate event
    if (this.props.onChange) this.props.onChange(newValue);
  }

  render() {

    return (
      <div className='toto-amount-input'>
        <div className='amount-container'>
          <input className='amount' type='text' value={this.state.value} onKeyPress={this.onKeyPress} onBlur={this.onBlur} onFocus={this.onFocus} onChange={this.onChange}/>
        </div>
      </div>
    )
  }
}
