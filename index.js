const express = require('express');
const cors = require('cors');

const config = require('./libs/config');

/** CRON */
// eslint-disable-next-line no-unused-vars
// const cron = require('./cron');
/** CRON */

/** ROUTES * */
const rest = require('./routes/rest');
const available = require('./routes/available');
const suggestion = require('./routes/suggestion');
const recommendation = require('./routes/recommendation');
/** ROUTES * */

const app = express();

const corsOptions = {
  origin: true,
  optionsSuccessStatus: 200
};

app.get('/', (req, res) => res.end('API is Ok'));
app.use('/api/v1', cors(corsOptions), rest);
app.use('/api/v1/available', cors(corsOptions), available);
app.use('/api/v1/suggestion', cors(corsOptions), suggestion);
app.use('/api/v1/recommendation', cors(corsOptions), recommendation);

app.use('/api/v1/static', express.static('static'));

app.listen(config.get('port'), () => {
  console.log(`Listening on port ${config.get('port')}!`);
});
