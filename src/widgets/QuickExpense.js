import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import moment from 'moment';

import TotoListAvatar from '../comp/TotoListAvatar';
import TotoInput from '../comp/TotoInput';
import TotoIconButton from '../comp/TotoIconButton';
import TotoCurrencySelector from '../comp/TotoCurrencySelector';
import CategorySelectionPopup from '../comp/CategorySelectionPopup';
import categoriesMap from '../services/CategoriesMap';
import ExpensesAPI from '../services/ExpensesAPI';
import TotoEventBus from '../services/TotoEventBus';
import * as config from '../Config';

import './QuickExpense.css';

const cookies = new Cookies();

export default class QuickExpense extends Component {

  constructor(props) {
    super(props);

    this.state = {
      category: 'VARIE',
      user: cookies.get('user'),
      currency: 'DKK',
    }

    // Bindings
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeAmount = this.onChangeAmount.bind(this);
    this.onChangeCurrency = this.onChangeCurrency.bind(this);
    this.onChangeCategory = this.onChangeCategory.bind(this);
    this.saveExpense = this.saveExpense.bind(this);

  }

  /**
   * When the component mount
   */
  componentDidMount() {

    // Load
    this.load();

  }

  componentWillUnmount() {
  }

  /**
   * When description is changed
   */
  onChangeDescription(desc) {
    this.setState({description: desc});
  }

  /**
   * Amount
   */
  onChangeAmount(amount) {
    this.setState({amount: amount.replace(',', '.')});
  }

  /**
   * Change of currency
   */
  onChangeCurrency(c) {
    this.setState({currency: c});
  }

  /**
   * Change of category
   */
  onChangeCategory(c) {
    this.setState({category: c});
  }

  /**
   * Saves an expense
   */
  saveExpense() {

    let exp = {
      amount: this.state.amount,
      date: moment().format('YYYYMMDD'),
      category: this.state.category,
      description: this.state.description,
      yearMonth: moment().format('YYYYMM'),
      currency: this.state.currency,
      user: this.state.user.email
    }

    new ExpensesAPI().postExpense(exp).then((data) => {

      TotoEventBus.publishEvent({name: config.EVENTS.expenseCreated, context: {expenseId: data.id}});

    })
  }

  /**
   * Load everything
   */
  load() {

    new ExpensesAPI().getSettings(this.state.user.email).then((data) => {
      // Set state
      this.setState({settings: data});
    })

  }

  render() {

    // Category popup to change category
    let categoryPopup = (<CategorySelectionPopup category={this.state.category} onCategoryChange={this.onChangeCategory}/>);

    return (
      <div className='quick-expense'>
        <TotoListAvatar
          image={categoriesMap.get(this.state.category).image}
          size='l'
          popup={categoryPopup}
          />
        <div className='input-container'>
          <TotoInput
            placeholder='Quick expense...'
            onChange={this.onChangeDescription}
            />
        </div>
        <div className='input-container amount'>
          <TotoInput
            placeholder='100'
            padding='0 0 0 12px'
            width='46px'
            onChange={this.onChangeAmount}
            />
        </div>
        <div className='input-container'>
          <TotoCurrencySelector
            initialValue='DKK'
            />
        </div>
        <div style={{display: 'flex', flex: 1}}></div>
        <TotoIconButton image={require('../img/tick.svg')} size='l' onPress={this.saveExpense}/>
      </div>
    )
  }
}
