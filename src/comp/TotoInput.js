import React, { Component } from 'react';

import './TotoInput.css';

/**
 * Text input for Toto
 * Properties:
 * - placeholder              : (optional) a placeholder text, removed when the user focuses on the input field
 * - color                    : (optioanl) overrides the text color
 */
export default class TotoInput extends Component {

  constructor(props) {
    super(props);

    this.state = {
      value: props.value ? props.value : '',
      placeholder: props.placeholder
    }

    // Binding
    this.onPress = this.onPress.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
  }

  /**
   * When pressing
   */
  onPress() {
    this.setState({placeholder: ''})
  }

  /**
   * When focusing
   */
  onFocus() {
    this.setState({placeholder: ''})
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
   * When blurring
   */
  onBlur() {

    let placeholder = '';
    if (this.state.value === '' || this.state.value > 0) placeholder = this.props.placeholder;

    this.setState({placeholder: placeholder});

  }


  render() {

    // Input text classes
    let inputClass = 'text-input';
    // Placeholder class
    if (!this.state.value || this.state.value === '') inputClass += ' placeholder';
    // Size
    inputClass += ' ' + (this.props.size ? this.props.size : 'm')

    // Value
    let value = (this.state.value !== '') ? this.state.value : this.state.placeholder

    // Additional text styles
    let textStyles = {};
    if (this.props.color) textStyles.color = this.props.color;
    if (this.props.padding) textStyles.padding = this.props.padding;
    if (this.props.width) textStyles.width = this.props.width;
    if (this.props.textAlign) textStyles.textAlign = this.props.textAlign;

    return (
      <div className="toto-input" onClick={this.onPress}>
        <input type="text" style={textStyles} className={inputClass} value={value} onFocus={this.onFocus} onChange={this.onChange} onBlur={this.onBlur}/>
      </div>
    )
  }
}
