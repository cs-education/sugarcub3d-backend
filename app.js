/*
Sugarcub3d server
Spring 2016 Senior Project 
Authors: Sukeerthi Khadri, Han Chen 
*/

// dependencies (HTTP, Express)
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//var mongo_cred = require('./config/mongolab_credential.json'); // credentials for DB

var mongo_user = 'backend-tester';
var mongo_password = 'team$ugar$ugar';
// mongoose instance from module
var mongoose = require('mongoose');


// connect to database (hosted on MLab)
mongoose.connect('mongodb://' + mongo_user + ':' + mongo_password + '@ds039504.mlab.com:39504/sugarcub3d', function (err) {
  // print error and exit
  if (err) {
    console.log(err)
  }
});

// route modules
var questionRouter = require('./routes/question');

// express instance
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); 

// define base URL for routes
app.use('/api/questions', questionRouter);

// export express instance
module.exports = app;
