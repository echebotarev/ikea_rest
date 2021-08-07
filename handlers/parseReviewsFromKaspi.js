const request = require('request');
const util = require('util');
const cheerio = require('cheerio');

const req = util.promisify(request);

const url = 'https://kaspi.kz/shop/p/ikea-mal-m-003-685-31-belyi-100123341/';

request(url, (error, response, body) => {
  if (!error) {
    const $ = cheerio.load(body);

    console.log(body);
  } else {
    console.log('Произошла ошибка: ' + error);
  }
});

req(url).then((resp) => console.log('Resp', resp.body));
