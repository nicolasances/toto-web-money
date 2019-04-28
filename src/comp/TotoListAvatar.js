import React, { Component } from 'react';
import SVG from 'react-svg';

import './TotoListAvatar.css';

import tick from '../img/tick.svg';

/**
 * Displays an avatar contained in a circle
 * Properties:
 * - image          : (optional) the svg image (loaded)
 * - text           : (optional) text of the avatar
 * - size           : (optional, default 'm') defines the size of the icon: ('s', 'ms', 'm', 'l', 'xl')
 * - selected       : (optional, default false) if the avatar is in a "selected" state, it will show a tick (removing any previous image if any)
 * - onPress        : (optional), callback() to the avatar click
 */
export default class TotoListAvatar extends Component {

  render() {

    let buttonClass = "toto-list-avatar";
    if (this.props.size) buttonClass += ' ' + this.props.size;
    else buttonClass += ' m';
    if (this.props.selected) buttonClass += ' selected';

    let svgClass = 'icon';

    // Content of the avatar
    let content;
    if (this.props.image) content = (<SVG src={this.props.image} className={svgClass}/>)
    else if (this.props.text) content = (<div className='text'>{this.props.text}</div>)
    else content = (<div className='text'></div>)
    // Override content
    if (this.props.selected) content = (<SVG src={tick} className={svgClass} />)

    return (
      <div className={buttonClass} onClick={() => {if (this.props.onPress) this.props.onPress()}}>
        {content}
      </div>
    )
  }
}
