var mongoose = require('mongoose');

//User schema and model
var userSchema = new mongoose.Schema({
    name: String,
    surname: String,
    sex: String,
    birthday: Date,
    username: String,
    password: String,
    email: String,
    following: Array
});

//Party schema and model
var partySchema = new mongoose.Schema({
    userOrganizer : String,
    title: String,
    description: String,
    category: String,
    latitude: String,
    longitude: String,
    address: String,
    date: Date,    
    privateParty: Boolean,
    guests: Array,
    state: String,
    messages: Array
});

//Notification schema and model
var notificationSchema = new mongoose.Schema({
    userOwner: String,
    datetime: Date,
    message: String,
    invite: Boolean,
    partyID: String,
    userToBeAccepted: String,
    read: Boolean
});

var User = mongoose.model('User', userSchema)
var Party = mongoose.model('Party', partySchema)
var Notification = mongoose.model('Notification', notificationSchema)

module.exports = { User, Party, Notification}
