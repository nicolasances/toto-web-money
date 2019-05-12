import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import TotoMenuLogo from './TotoMenuLogo';
import TotoMenuItem from './TotoMenuItem';

/**
 * Properties:
 * - onSignOut        : (mandatory) callback() to be called when the user clicks on the "logout" menu item
 */
class TotoMenu extends Component {

  /**
   * Render method
   */
  render() {
    return (
      <div style={styles.menu}>
        <TotoMenuLogo />
        <TotoMenuItem label='This month' target='/' image={require('../img/location-pointer.svg')} selected={this.props.location.pathname === '/'} />
        <TotoMenuItem label='Past year' target='/year' image={require('../img/chart.svg')} selected={this.props.location.pathname === '/year'} />
        <TotoMenuItem label='Import' target='/import' image={require('../img/import.svg')} selected={this.props.location.pathname === '/import'} />
        <div style={{display: 'flex', flex: 1}}></div>
        <TotoMenuItem label='Logout' onPress={this.props.onSignOut} image={require('../img/logout.svg')} />
      </div>
    )
  }
}

const styles = {
  menu: {
    padding: 12,
    display: 'flex',
    flexDirection: 'column',
  }
}

export default withRouter(TotoMenu);
