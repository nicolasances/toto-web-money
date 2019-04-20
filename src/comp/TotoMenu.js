import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import TotoMenuLogo from './TotoMenuLogo';
import TotoMenuItem from './TotoMenuItem';

/**
 * Properties:
 * - onSignOut        : (mandatory) callback() to be called when the user clicks on the "logout" menu item
 */
class TotoMenu extends Component {

  constructor(props) {
    super(props);
  }

  /**
   * Render method
   */
  render() {
    return (
      <div style={styles.menu}>
        <TotoMenuLogo />
        <TotoMenuItem label='Import' target='/' image={require('../img/import.svg')} selected={this.props.location.pathname == '/'} />
        <TotoMenuItem label='Expenses' target='/expenses' image={require('../img/chart.svg')} selected={this.props.location.pathname == '/expenses'} />
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
