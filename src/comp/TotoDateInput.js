import React, { Component } from 'react';
import moment from 'moment';
import Calendar from 'react-calendar/dist/entry.nostyle';
import Popup from 'reactjs-popup';

import TouchableOpacity from './TouchableOpacity';

import './TotoDateInput.css';

/**
 * Text input for Toto
 * Properties:
 * - placeholder              : (optional) a placeholder text, removed when the user focuses on the input field
 * - color                    : (optioanl) overrides the text color
 */
export default class TotoDateInput extends Component {

  constructor(props) {
    super(props);

    this.state = {
      value: this.props.value ? this.props.value : moment().format('YYYYMMDD'),
      openPopup: false
    }

    // Binding
    this.onChange = this.onChange.bind(this);
    this.openPopup = this.openPopup.bind(this);
    this.closePopup = this.closePopup.bind(this);
  }

  /**
   * When date changes
   */
  onChange(date) {
    // Update state
    this.setState({value: moment(date).format('YYYYMMDD')}, () => {
      setTimeout(this.closePopup, 150)
    });
    // Send back the Value
    if (this.props.onChange) this.props.onChange(moment(date).format('YYYYMMDD'));
  }

  /**
   * Open popup
   */
  openPopup() {
    this.setState({openPopup: true});
  }

  /**
   * CLoses the popup
   */
  closePopup() {
    this.setState({openPopup: false})
  }

  render() {

    let dateClass = 'toto-date-input';
    dateClass += ' ' + (this.props.size ? this.props.size : 'm');

    return (
      <div>

        <TouchableOpacity className={dateClass} onPress={this.openPopup}>
          <div className='day'>{moment(this.state.value, 'YYYYMMDD').format('DD')}</div>
          <div className='month'>{moment(this.state.value, 'YYYYMMDD').format('MMM')}</div>
        </TouchableOpacity>

        <Popup
          on='click'
          offsetX={48}
          open={this.state.openPopup}
          onClose={this.closePopup}
          overlayStyle={{backgroundColor: 'rgba(0,0,0,0.5)'}}
          contentStyle={{padding: 0, width: 280, backgroundColor: '#007c91', borderRadius: '3px', border: 'none', boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)'}}
          arrow={false}
          >

            <div className='toto-date-input-popup'>
              <Calendar
                className='toto-date-input-calendar'
                onChange={this.onChange}
                />
            </div>

        </Popup>

      </div>
    )
  }
}
