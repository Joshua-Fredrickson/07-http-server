'use strict';

const url = require('url');
const queryString = require('querystring');

module.exports = function bodyParser(req) {
  return new Promise((resolve, reject) => {
    // Josh - the above Promise ends with a resolution or rejection. when resolved the Promise will
    // have a rejection which is handled like an error.
    req.url = url.parse(req.url);
    // Josh - above takes the client's req data and parses the url return data
    req.url.query = queryString.parse(req.url.query);
    // Josh - above takes the client's req parses the querystring return data

    if(req.method !== 'POST' && !== 'PUT') {
      return resolve(req);
      //Josh - the above returns the resolve data from the Promise on line 7,
    }

    let message = '';
    req.on('data',(data) => {
      message += data.toString();
    })
    //Josh - the above takes the client's req data and passes it through a function of ''+ <the string of data>.
  });

  req.on('end', () => {
    try {
      req.body = JSON.parse(message);
      return resolve(req);
    } catch (err) {
      return reject(err);
    }
  });

  req.on('error', err => reject(err));
  return undefined
}