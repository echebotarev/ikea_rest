const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const handleError = require('./handleError');

// mongoose.set('useFindAndModify', false);
mongoose.SchemaTypes.String.set('trim', true);

mongoose.connect('mongodb://localhost:27020/kaspi-product-prices');

// вместо MongoError будет выдавать ValidationError (проще ловить и выводить)
mongoose.plugin(beautifyUnique);

const db = mongoose.connection;

console.log('Connect Mongoose');

db.on('error', err => handleError(err));

db.once('open', () => console.log('Mongoose connected to DB!'));

module.exports = mongoose;
