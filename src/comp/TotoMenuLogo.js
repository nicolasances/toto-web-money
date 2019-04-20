import React, { Component } from 'react';
import './TotoMenuLogo.css';

import chimp from '../img/chimp.png';

export default class TotoMenuLogo extends Component {

  /**
   * Render method
   */
  render() {
    return (
      <div className="toto-menu-logo">
        <img className="img" src={chimp} alt='chimp' />
        <div className="title">toto money</div>
      </div>
    )
  }
}
