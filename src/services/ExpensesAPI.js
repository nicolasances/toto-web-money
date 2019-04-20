import TotoAPI from './TotoAPI';

/**
 * API to access the /expenses/ Toto API
 */
export default class ExpensesAPI {

  /**
   * Posts the specified file to the /expenses/import endpoint
   */
  postExpensesFile(file, bankCode) {

    return new TotoAPI().postFile('/expenses/import/uploads/' + bankCode, file);

  }

  /**
   * Gets the uploads
   */
  getUploads() {

    return new TotoAPI().fetch('/expenses/import/uploads').then((response) => response.json());

  }

}
