const express = require('express');
const cors = require('cors');

const config = require('./libs/config');

/** ROUTES * */
const rest = require('./routes/rest');
// const xml = require('./routes/xml');
/** ROUTES * */

const app = express();

const corsOptions = {
  origin: true,
  optionsSuccessStatus: 200
};

app.get('/', (req, res) => res.end('API is Ok'));
app.use('/api/v1', cors(corsOptions), rest);
// app.use('/api/xml', xml);

app.listen(config.get('port'), () => {
  console.log(`Listening on port ${config.get('port')}!`);
});
