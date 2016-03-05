/*
Route that handles the API for questions, and users.
Spring 2016 Senior Project
Author: Sukeerthi Khadri 
*/
// dependencies
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

// mongoose model
var Question = require('../models/questions');

// middleware. code is executed for every request to this router
var requestCount = 0;
router.use(function (req, res, next) {
	console.log('Time of request : ', Date.now());
	console.log('Request count : ', requestCount);
	next();
});

// root of API
router.route('/').get(function (req, res) {
	// notify user on how to access API
	res.status(200).json({
		message: 'Welcome to the SugarCub3d API. Go to /questions or /users to use the API.'
	});
});

// Questions route
var questionsRoute = router.route('/questions');

/*
GET - Respond with a list of questions
Params:
*/
questionsRoute.get(function (req, res) {
	// initialize Mongo query
	var findQuery = Question.find();

	// get query params and build query
	var reqQuery = req.query;

	if (reqQuery.where) {
		var where = JSON.parse(reqQuery.where)
		findQuery.where(where)
	}
	if (reqQuery.sort) {
		var sort = JSON.parse(reqQuery.sort);
		findQuery.sort(sort);
	}
	if (reqQuery.select) {
		var select = JSON.parse(reqQuery.select);
		findQuery.select()
	}

})


