import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import moment from 'moment';

import TotoListAvatar from '../comp/TotoListAvatar';
import TotoInput from '../comp/TotoInput';
import TotoDateInput from '../comp/TotoDateInput';
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
      date: moment().format('YYYYMMDD')
    }

    // Bindings
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeAmount = this.onChangeAmount.bind(this);
    this.onChangeCurrency = this.onChangeCurrency.bind(this);
    this.onChangeCategory = this.onChangeCategory.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
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
   * Change of date
   */
  onChangeDate(d) {
    this.setState({date: d});
  }

  /**
   * Saves an expense
   */
  saveExpense() {

    let exp = {
      amount: this.state.amount,
      date: this.state.date,
      category: this.state.category,
      description: this.state.description,
      yearMonth: moment(this.state.date, 'YYYYMMDD').format('YYYYMM'),
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
          <TotoDateInput
            onChange={this.onChangeDate}
            />
        </div>
        <div className='input-container grow'>
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
        <div className='input-container margined'>
          <TotoCurrencySelector
            initialValue='DKK'
            />
        </div>
        <TotoIconButton image={require('../img/tick.svg')} size='m' onPress={this.saveExpense}/>
      </div>
    )
  }
}
