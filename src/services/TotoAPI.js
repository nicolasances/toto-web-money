import * as config from '../Config';
import moment from 'moment';

var newCid = function() {

	let ts = moment().format('YYYYMMDDHHmmssSSS');

	let random = (Math.random() * 100000).toFixed(0).padStart(5, '0');

	return ts + '-' + random;

}
/**
 * Wrapper for the fetch() React method that adds the required fields for Toto authentication
 */
export default class TotoAPI {

  fetch(url, options) {

    if (options == null) options = {method: 'GET', headers: {}};
    if (options.headers == null) options.headers = {};

    // Adding standard headers
    options.headers['Accept'] = 'application/json';
    options.headers['Authorization'] = config.AUTH;
    options.headers['x-correlation-id'] = newCid();

    return fetch(config.API_URL + url, options);
  }

  /**
   * POSTs a file to the specified URL
   */
  postFile(url, file) {

    return new Promise((success, failure) => {

      const req = new XMLHttpRequest();
      const formData = new FormData();

      formData.append("file", file, file.name);

      req.open("POST", config.API_URL + url);

      // Adding standard headers
      req.setRequestHeader('Accept', 'application/json');
      req.setRequestHeader('Authorization', config.AUTH);
      req.setRequestHeader('x-correlation-id', newCid());

      req.send(formData);

      req.onreadystatechange = () => {
        if (req.readyState === XMLHttpRequest.DONE && req.status === 200) {
          if (req.response) success(JSON.parse(req.response));
        }
      }

    })

  }
}
