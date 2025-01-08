var express = require('express');
var usersController = require('./controllers/usersController');
const env = require("dotenv");
const partiesController = require('./controllers/partiesController');
env.config();

var app = express();


//static files
app.use(express.static('./public'));

//fire controller
usersController(app);
partiesController(app);

//listen to port
app.listen(5000);
console.log('You are listening to port 5000.');