import React, { Component } from 'react';
import Cookies from 'universal-cookie';

import TotoListAvatar from '../comp/TotoListAvatar';
import TotoInput from '../comp/TotoInput';
import TotoIconButton from '../comp/TotoIconButton';
import TotoCurrencySelector from '../comp/TotoCurrencySelector';
import categoriesMap from '../services/CategoriesMap';
import ExpensesAPI from '../services/ExpensesAPI';

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
    this.setState({amount: amount});
  }

  /**
   * Change of currency
   */
  onChangeCurrency(c) {
    this.setState({currency: c});
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
        <TotoListAvatar image={categoriesMap.get(this.state.category).image} size='l'/>
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
        <TotoIconButton image={require('../img/tick.svg')} size='l'/>
      </div>
    )
  }
}
