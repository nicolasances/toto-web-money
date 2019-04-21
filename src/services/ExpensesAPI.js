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

  /**
   * Get generic app settings
   * from the /app/expenses microservice
   */
  getAppSettings(userEmail) {

    return new TotoAPI().fetch('/app/expenses/settings?user=' + userEmail).then((response) => response.json());

  }

  /**
   * Retrieves the settings
   */
  getSettings(userEmail) {

    return new TotoAPI().fetch('/expenses/settings?user=' + userEmail)
        .then((response) => response.json());

  }

  /**
   * Retrieves the spending (total) for each day between dateFrom and dateTo
   */
  getExpensesPerDay(userEmail, dateFrom, dateTo, targetCurrency) {

    let dateToFilter = dateTo == null ? '' : ('&dateTo=' + dateTo);
    let currencyFilter = targetCurrency ? '&targetCurrency=' + targetCurrency : '';

    return new TotoAPI().fetch('/expenses/stats/expensesPerDay?user=' + userEmail + '&dateFrom=' + dateFrom + dateToFilter + currencyFilter)
        .then((response) => response.json());

  }

}
