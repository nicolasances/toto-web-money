
import {apiUrl, auth} from './env.js';

export const API_URL = apiUrl;
export const AUTH = auth;

export const EVENTS = {
  expenseCreated: 'expenseCreated', // Expense has been created
  expenseUpdated: 'expenseUpdated', // Expense has been updated
  expenseDeleted: 'expenseDeleted', // Expense has been deleted
  expensesFileUploaded: 'expensesFileUploaded', // Expenses file has been uploaded
  totoDropzoneClearFilesRequested: 'totoDropzoneClearFilesRequested', // Command to clear the files cache (in the TotoDropzone)
  expensesUploadConfirmed: 'expensesUploadConfirmed', // An expenses upladed file has been confirmed and the expenses are being posted to the /epxenses API
}
