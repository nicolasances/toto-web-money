import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import SVG from 'react-svg';

import TouchableOpacity from './TouchableOpacity';

import './TotoMenuItem.css'

/**
 * Defines a menu item.
 * Properties:
 * - image              : (mandatory) the image to display
 * - label              : (mandatory) the label of the menu item
 * - target             : (optional) the name of the target screen to redirect to
 * - selected           : (optional, default false) shows the item as selected
 * - onPress            : (optional) callback() called when the menu item is pressed
 */
class TotoMenuItem extends Component {

  constructor(props) {
    super(props);

    this.onPress = this.onPress.bind(this);
  }

  /**
   * When the menu item is clicked
   */
  onPress() {

    if (this.props.target) this.props.history.push(this.props.target);

    if (this.props.onPress) this.props.onPress();

  }

  render() {

    // root class
    let rootClass = 'toto-menu-item';
    if (this.props.selected) rootClass += ' selected';

    return (
      <TouchableOpacity className={rootClass} onPress={this.onPress}>
        <div className='avatar'>
          <SVG src={this.props.image} className='icon' />
        </div>
        <div className='label'>{this.props.label}</div>
      </TouchableOpacity>
    )
  }

}

export default withRouter(TotoMenuItem);
