var express = require('express');

const env = require("dotenv");
env.config();

var ConnectDB = require("./public/assets/database/DBConnection.js");
var usersController = require('./controllers/usersController');
const partiesController = require('./controllers/partiesController');
const notificationsController = require('./controllers/notificationsController');


var app = express();

//static files
app.use(express.static(__dirname));

app.use(function(req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    const allowedOrigins = ['http://localhost:3000', 'https://fouramood.netlify.app', 'https://fouramood-mgqn.onrender.com'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
         res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-credentials", true);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, UPDATE");
    next();
  });

ConnectDB();

//fire controllers
usersController(app);
partiesController(app);
notificationsController(app);

//listen to port
app.listen(5000);
console.log('You are listening to port 5000.');