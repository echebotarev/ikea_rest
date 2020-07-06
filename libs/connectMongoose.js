const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const config = require('./config');
const handleError = require('./handleError');

mongoose.set('useFindAndModify', false);

mongoose.connect(config.get('mongoose:uri'));

// вместо MongoError будет выдавать ValidationError (проще ловить и выводить)
mongoose.plugin(beautifyUnique);

const db = mongoose.connection;

if (config.get('NODE_ENV') === 'development') {
	mongoose.set('debug', true);
}

db.on('error', err => handleError(err));

db.once('open', () => console.log('Connected to DB!'));

module.exports = mongoose;
