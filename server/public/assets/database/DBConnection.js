//Connect to db
var mongoose = require('mongoose');
require('dotenv').config()

module.exports = async function ConnectDB() {mongoose
  .connect(process.env.MONGO_URI, {
    dbName: '4AMOOD',
  })
  .then(() => {
    console.log('Connected to the Database.');
  })
  .catch(err => console.error(err))};