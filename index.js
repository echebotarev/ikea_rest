const path = require('path');
const express = require('express');
const cors = require('cors');

const config = require('./libs/config');

/** ROUTES * */
const rest = require('./routes/rest');
const suggestion = require('./routes/suggestion');
/** ROUTES * */

const setMiddlewares = require('./libs/setMiddlewares');

const app = express();
// добавляем промежуточные ф-ии
setMiddlewares(app, path.join(__dirname, 'middlewares'));

const corsOptions = {
  origin: true,
  optionsSuccessStatus: 200
};

app.get('/', (req, res) => res.end('API is Ok'));
app.use('/api/v1', cors(corsOptions), rest);
app.use('/api/v1/suggestion', cors(corsOptions), suggestion);

app.listen(config.get('port'), () => {
  console.log(`Listening on port ${config.get('port')}!`);
});
