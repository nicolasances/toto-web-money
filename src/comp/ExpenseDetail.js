import React, { Component } from 'react';

import TotoDateInput from './TotoDateInput';
import TotoAmountInput from './TotoAmountInput';
import TotoCurrencySelector from './TotoCurrencySelector';
import CategoryInput from './CategoryInput';
import TotoInput from './TotoInput';
import TotoIconButton from './TotoIconButton';
import ExpensesAPI from '../services/ExpensesAPI';
import TotoEventBus from '../services/TotoEventBus';
import * as config from '../Config';

import './ExpenseDetail.css';

/**
 * Paramters:
 * - onDeleted              : callback called when the expense HAS BEEN deleted
 * - onSaved                : callback called when the expense HAS BEEN updated
 */
export default class ExpenseDetail extends Component {

  constructor(props) {
    super(props);

    this.state = {
      expense: props.expense
    }

    // Bindings
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onChangeAmount = this.onChangeAmount.bind(this);
    this.onChangeCurrency = this.onChangeCurrency.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeCategory = this.onChangeCategory.bind(this);
    this.save = this.save.bind(this);
    this.delete = this.delete.bind(this);
  }

  /**
   * On changes, update state
   */
  onChangeDate(date) {this.setState({expense: {...this.state.expense, date: date}})}
  onChangeAmount(amount) {this.setState({expense: {...this.state.expense, amount: amount}})}
  onChangeCurrency(c) {this.setState({expense: {...this.state.expense, currency: c}})}
  onChangeDescription(d) {this.setState({expense: {...this.state.expense, description: d}})}
  onChangeCategory(c) {this.setState({expense: {...this.state.expense, category: c}})}

  /**
   * Save the expense
   */
  save() {

    // Update
    new ExpensesAPI().putExpense(this.state.expense.id, this.state.expense).then((data) => {
      // Event
      TotoEventBus.publishEvent({name: config.EVENTS.expenseUpdated, context: {expense: this.state.expense}});
      // Callback
      if (this.props.onSaved) this.props.onSaved();
    })
  }

  /**
   * Deletes the expense
   */
  delete() {

    new ExpensesAPI().deleteExpense(this.state.expense.id).then((data) => {
      // Event
      TotoEventBus.publishEvent({name: config.EVENTS.expenseDeleted, context: {expense: this.state.expense}});
      // Callback
      if (this.props.onDeleted) this.props.onDeleted();
    })
  }

  render() {
    return (
      <div className='expense-detail'>
        <div className='detail-header'>
          <div className='category-container'> <CategoryInput value={this.props.expense.category} onChange={this.onChangeCategory} size='xl' showLabel={false} /> </div>
          <div className='description-container'> <TotoInput value={this.props.expense.description} onChange={this.onChangeDescription} onPressEnter={this.save} color='#5ddef4' size='l' textAlign='center' /> </div>
        </div>
        <div className='expense-detail-line1'>
          <div className="date-container"> <TotoDateInput value={this.props.expense.date} size='xl' onChange={this.onChangeDate} /> </div>
          <div className="amount-container"> <TotoAmountInput value={this.props.expense.amount} onPressEnter={this.save} onChange={this.onChangeAmount}/> </div>
          <div className="currency-container"> <TotoCurrencySelector initialValue={this.props.expense.currency} size='xl' onChange={this.onChangeCurrency}/> </div>
        </div>
        <div className='expense-detail-line3'>
        </div>
        <div className='expense-detail-buttons'>
          <TotoIconButton image={require('../img/tick.svg')} marginHorizontal={6} size='l' onPress={this.save} />
          <TotoIconButton image={require('../img/trash.svg')} marginHorizontal={6} size='l' onPress={this.delete}/>
        </div>
      </div>
    )
  }
}
