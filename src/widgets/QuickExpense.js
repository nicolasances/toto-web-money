import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import moment from 'moment';
import Popup from "reactjs-popup";

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
    this.reset = this.reset.bind(this);
    this.showCategoryPopup = this.showCategoryPopup.bind(this);

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
   * Resets the state
   */
  reset() {

    this.setState({
      category: 'VARIE',
      currency: 'DKK',
      date: moment().format('YYYYMMDD'),
      description: '',
      amount: ''
    });
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
    this.setState({category: c, categoryPopupOpen: false});
  }

  /**
   * Change of date
   */
  onChangeDate(d) {
    this.setState({date: d});
  }

  /**
   * Shows the category selection popup
   */
  showCategoryPopup() {
    this.setState({categoryPopupOpen: true});
  }

  /**
   * Saves an expense
   */
  saveExpense() {

    // Prepare the expense
    let exp = {
      amount: this.state.amount,
      date: this.state.date,
      category: this.state.category,
      description: this.state.description,
      yearMonth: moment(this.state.date, 'YYYYMMDD').format('YYYYMM'),
      currency: this.state.currency,
      user: this.state.user.email
    }

    // Save it
    new ExpensesAPI().postExpense(exp).then((data) => {

      // Publish the event
      TotoEventBus.publishEvent({name: config.EVENTS.expenseCreated, context: {expenseId: data.id}});

      // Reset the state of the widget
      this.reset();

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

    return (
      <div className='quick-expense'>
        <TotoListAvatar
          image={categoriesMap.get(this.state.category).image}
          size='l'
          onPress={this.showCategoryPopup}
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
            value={this.state.description}
            />
        </div>
        <div className='input-container amount'>
          <TotoInput
            placeholder='100'
            padding='0 0 0 12px'
            width='46px'
            onChange={this.onChangeAmount}
            onPressEnter={this.saveExpense}
            value={this.state.amount}
            />
        </div>
        <div className='input-container margined'>
          <TotoCurrencySelector
            initialValue='DKK'
            onChange={this.onChangeCurrency}
            />
        </div>
        <TotoIconButton image={require('../img/tick.svg')} size='m' onPress={this.saveExpense}/>


        <Popup
          closeOnDocumentClick={true}
          closeOnEscape={true}
          open={this.state.categoryPopupOpen}
          onClose={() => {this.setState({categoryPopupOpen: false})}}
          overlayStyle={{backgroundColor: 'rgba(0,0,0,0.5)'}}
          contentStyle={{backgroundColor: '#007c91', borderRadius: '3px', border: 'none', boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)'}}
          arrow={false}
          >
          <CategorySelectionPopup category={this.state.category} onCategoryChange={this.onChangeCategory}/>
        </Popup>

      </div>
    )
  }
}
