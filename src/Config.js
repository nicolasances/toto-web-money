
export const API_URL = 'https://imatzdev.it/apis';
export const AUTH = 'Basic c3RvOnRvdG8=';

export const EVENTS = {
  expenseCreated: 'expenseCreated', // Expense has been created
  expenseUpdated: 'expenseUpdated', // Expense has been updated
  expensesFileUploaded: 'expensesFileUploaded', // Expenses file has been uploaded
  totoDropzoneClearFilesRequested: 'totoDropzoneClearFilesRequested', // Command to clear the files cache (in the TotoDropzone)
  expensesUploadConfirmed: 'expensesUploadConfirmed', // An expenses upladed file has been confirmed and the expenses are being posted to the /epxenses API
}
