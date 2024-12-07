var mongoose = require('mongoose');

//User schema and model
var userSchema = new mongoose.Schema({
    name: String,
    surname: String,
    sex: String,
    username: String,
    password: String,
    email: String
});

var User = mongoose.model('User', userSchema)

module.exports = { User}
