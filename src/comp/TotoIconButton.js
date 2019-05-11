import React, { Component } from 'react';
import SVG from 'react-svg';

import TouchableOpacity from './TouchableOpacity';

import './TotoIconButton.css';

/**
 * Displays an button with an icon inside
 * Properties:
 * - image              : (mandatory) the image (already loaded and svg)
 * - disabled           : (optioanl, default false) true to disable the button
 * - marginHorizontal   : (optioanal, default 0) a horizontal margin to apply to the button
 * - borders            : (optional, default true) if false, won't show the border of the button (only the icon)
 *
 * - onPress            : (optional) a callback() to be called when the button has been clicked
 *
 */
export default class TotoIconButton extends Component {

  constructor(props) {
    super(props);

    this.state = {
      pressed: false
    }

    this.handleClick = this.handleClick.bind(this);
  }

  /**
   * Handles the click of the button
   */
  handleClick() {

    if (this.props.disabled) return;

    // Update the state, to show the press action
    this.setState({pressed: true}, () => {
      setTimeout(() => {this.setState({pressed: false})}, 100);
    });

    // Call the onPress, if any
    if (this.props.onPress) this.props.onPress();

  }

  render() {

    // Button class
    let buttonClass = "toto-icon-button";
    buttonClass += ' ' + (this.props.size ? this.props.size : 'm')
    if (this.props.disabled) buttonClass += ' disabled'
    if (this.props.borders === false) buttonClass += ' no-border'

    // Additional styles
    let style = {};
    if (this.props.marginHorizontal) {
      style.marginLeft = this.props.marginHorizontal + 'px';
      style.marginRight = this.props.marginHorizontal + 'px';
    }

    return (
      <div style={style}>
        <TouchableOpacity className={buttonClass} onPress={this.handleClick}>
          <SVG src={this.props.image} className="icon"/>
        </TouchableOpacity>
      </div>
    )
  }
}
