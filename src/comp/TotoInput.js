import React, { Component } from 'react';

import './TotoInput.css';

/**
 * Text input for Toto
 * Properties:
 * - placeholder              : (optional) a placeholder text, removed when the user focuses on the input field
 * - color                    : (optioanl) overrides the text color
 * - onPressEnter             : (optional) callback when the enter key is pressed
 */
export default class TotoInput extends Component {

  constructor(props) {
    super(props);

    this.state = {
      placeholder: props.placeholder
    }

    // Binding
    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  /**
   * When focusing
   */
  onFocus() {
    this.setState({placeholder: '', focused: true})
  }

  /**
   * When blurring
   */
  onBlur() {

    let placeholder = '';
    if (this.props.value == null || this.props.value === '') placeholder = this.props.placeholder;

    this.setState({placeholder: placeholder, focused: false});

  }

  /**
   * When text changes
   */
  onChange(event) {
    this.setState({value: event.target.value});
    // Send back the Value
    if (this.props.onChange) this.props.onChange(event.target.value);
  }

  /**
   * When a keyboard key is pressed
   */
  onKeyPress(e) {

    if (e.key === 'Enter') {
      // Callback if any
      if (this.props.onPressEnter) this.props.onPressEnter();
      // Remove the focus
      e.target.blur();
    }

  }


  render() {

    // Input text classes
    let inputClass = 'text-input';
    // Placeholder class
    if (!this.props.value || this.props.value === '') inputClass += ' placeholder';
    // Size
    inputClass += ' ' + (this.props.size ? this.props.size : 'm')

    // Value & Placeholder
    let placeholder = this.state.placeholder ? this.state.placeholder : (this.state.focused ? this.state.placeholder : this.props.placeholder)
    let value = (this.props.value !== '' && this.props.value != null) ? this.props.value : placeholder

    // Additional text styles
    let textStyles = {};
    if (this.props.color) textStyles.color = this.props.color;
    if (this.props.padding) textStyles.padding = this.props.padding;
    if (this.props.width) textStyles.width = this.props.width;
    if (this.props.textAlign) textStyles.textAlign = this.props.textAlign;

    return (
      <div className="toto-input" onClick={this.onPress}>
        <input type="text" style={textStyles} className={inputClass} value={value} onKeyPress={this.onKeyPress} onFocus={this.onFocus} onChange={this.onChange} onBlur={this.onBlur}/>
      </div>
    )
  }
}
