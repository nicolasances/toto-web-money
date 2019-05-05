import React, { Component } from 'react';
import SVG from 'react-svg';

import TouchableOpacity from './TouchableOpacity';
import categoriesMap from '../services/CategoriesMap';

import './CategorySelectionPopup.css';

export default class CategorySelectionPopup extends Component {

  constructor(props) {
    super(props);

    this.comp = React.createRef();

    // Bindings
    this.onCategoryChange = this.onCategoryChange.bind(this);
  }

  /**
   * Calculates the measures
   */
  componentDidMount() {

    this.width = this.comp.current.offsetWidth;

  }

  /**
   * When the category is changed
   */
  onCategoryChange(key) {
    // CAll callback if configured
    if (this.props.onCategoryChange) this.props.onCategoryChange(key);
  }

  render() {

    // Categories buttons
    let categoryButtons = [];
    categoriesMap.forEach((value, key) => {

      let k = 'CatNewEx' + Math.random();

      let cat = (
        <Category key={k} image={value.image} label={value.label} selected={this.props.category === key} onPress={() => {this.onCategoryChange(key);}} />
      )

      categoryButtons.push(cat);
    })


    return (
      <div className='category-selection-popup' ref={this.comp}>
        <div className='title'> Select a category </div>
        <div className='buttons-container'>
          {categoryButtons}
        </div>
      </div>
    )
  }
}

/**
 * Category item
 */
class Category extends Component {

  render() {

    let selectedStyle = this.props.selected ? 'selected' : 'unselected';

    let mainStyle = 'cat-selector-container ' + selectedStyle;

    return (
      <div className={mainStyle}>
        <TouchableOpacity className='image-container' onPress={this.props.onPress}>
          <SVG src={this.props.image} className='image' />
        </TouchableOpacity>
        <div className='label'>{this.props.label}</div>
      </div>
    )
  }

}
