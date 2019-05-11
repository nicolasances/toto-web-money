import React, { Component } from 'react';
import Popup from "reactjs-popup";
import SVG from 'react-svg';

import TouchableOpacity from './TouchableOpacity';
import CategorySelectionPopup from './CategorySelectionPopup';
import categoryMap from '../services/CategoriesMap';

import './CategoryInput.css';

/**
 * Currency selector for Toto
 * Properties:
 * - initialValue             : initial value of the currency (e.g. 'EUR')
 */
export default class CategoryInput extends Component {

  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
      popupOpen: false
    }

    // Binding
    this.openPopup = this.openPopup.bind(this);
    this.onClosePopup = this.onClosePopup.bind(this);
    this.onCategoryChange = this.onCategoryChange.bind(this);
  }

  /**
   * Open the popup
   */
  openPopup() {
    this.setState({popupOpen: true});
  }

  /**
   * When the popup gets closed
   */
  onClosePopup() {
    this.setState({popupOpen: false});
  }

  /**
   * When a new category is selected
   */
  onCategoryChange(category) {
    // Update the state
    this.setState({value: category});
    // Close the popup
    this.onClosePopup();
    // Callback
    if (this.props.onChange) this.props.onChange(category);
  }

  render() {

    // Class
    let categoryInputClass = 'category-input';
    categoryInputClass += ' ' + (this.props.size ? this.props.size : 'm');

    // Image to be loaded
    let category = categoryMap.get(this.state.value);

    return (
      <div>

        <TouchableOpacity className={categoryInputClass} onPress={this.openPopup}>
          <div className='icon'><SVG src={category.image} /></div>
          <div className='label'>{category.label}</div>
        </TouchableOpacity>

        <Popup
          on='click'
          closeOnDocumentClick={true}
          closeOnEscape={true}
          onClose={this.onClosePopup}
          overlayStyle={{backgroundColor: 'rgba(0,0,0,0.5)'}}
          contentStyle={{backgroundColor: '#007c91', borderRadius: '3px', border: 'none', boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)'}}
          arrow={false}
          open={this.state.popupOpen}
          >

          <CategorySelectionPopup onCategoryChange={this.onCategoryChange} />

        </Popup>

      </div>
    )
  }
}
