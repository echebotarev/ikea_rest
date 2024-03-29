const express = require('express');
const cors = require('cors');

const path = require('path');

require('dotenv').config();
const config = require('./libs/config');

/** ROUTES * */
const rest = require('./routes/rest');
const download = require('./routes/download');
const available = require('./routes/available');
const suggestion = require('./routes/suggestion');
const recommendation = require('./routes/recommendation');
/** ROUTES * */

const setMiddlewares = require('./libs/setMiddlewares');

const app = express();

// добавляем промежуточные ф-ии
setMiddlewares(app, path.join(__dirname, 'middlewares'));

const corsOptions = {
  origin: true,
  optionsSuccessStatus: 200,
  credentials: true
};

app.get('/', (req, res) => res.end('API is Ok'));
app.use('/api/v1', cors(corsOptions), rest);
app.use('/api/v1/available', cors(corsOptions), available);
app.use('/api/v1/suggestion', cors(corsOptions), suggestion);
app.use('/api/v1/recommendation', cors(corsOptions), recommendation);

app.use('/download', download);
app.use(
  '/api/v1/static',
  express.static('static', {
    etag: false,
    // eslint-disable-next-line no-shadow
    setHeaders(res, path, stat) {
      res.set('Content-Length', stat.size);
      res.set('Content-Type', 'text/xml;charset=UTF-8');
    }
  })
);

app.listen(config.get('port'), () => {
  console.log(`Listening on port ${config.get('port')}!`);
});
