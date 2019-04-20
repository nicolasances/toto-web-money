import React, { Component } from 'react';
import SVG from 'react-svg';

import TotoIconButton from './TotoIconButton';

import './TotoDashboardSection.css';

const defaultEmptyImg = require('../img/inbox-empty.svg');

/**
 * Section of the dashboard, it represents an area of the dashboard.
 * Properties:
 * - title            : (optional) the title of the section
 * - empty            : (optional, default false) set to true if the section is currently empty
 * - loading          : (optional, default false) set to true if the section's content is currently loading
 * - actions          : (optional) an array[] of possible actions to show in the header.
 *                      Each action is a {
 *                        name      : just a unique name for the action
 *                        image     : the image to show (loaded image)
 *                        onPress   : callback() to call when the icon is pressed
 *                      }
 */
export default class TotoDashboardSection extends Component {

  constructor(props) {
    super(props);

    this.state = {}
  }

  render() {

    // Actions bar
    let actionsBar;
    if (this.props.actions) actionsBar = (
      <div className='actions-bar'>
        {this.props.actions.map((action) =>
          <TotoIconButton image={action.image} onPress={action.onPress} size='m' borders={false}/>
        )}
      </div>
    )

    // Title
    let title;
    if (this.props.title) title = (
      <div className="title-bar">
        <div className='title'>{this.props.title}</div>
        {actionsBar}
      </div>
    )

    // Outer border styles
    let outerBorderStyles = 'section-outer-border';
    // If the widget is empty and not loading, show the outer border
    if ((this.props.loading || !this.props.loading) && this.props.empty) outerBorderStyles += ' empty';

    // Empty message: shown only if the section is empty and not loading
    let emptyContent;
    let emptyImage = this.props.emptyImage ? this.props.emptyImage : defaultEmptyImg;
    if ((this.props.loading || !this.props.loading) && this.props.empty) emptyContent = (
      <div className="empty-message">
        <SVG className="empty-image" src={emptyImage} />
        <div className="message">You've never uploaded files yet. Go ahead, try it!</div>
      </div>
    )

    // Styles
    let sectionStyles = 'toto-dashboard-section';
    // If the section is empty
    if ((this.props.loading || !this.props.loading) && this.props.empty) sectionStyles += ' empty';

    return (
      <div className={outerBorderStyles}>
        <div className={sectionStyles}>
          {title}
          {emptyContent}
          {this.props.children}
        </div>
    </div>
    )
  }
}
