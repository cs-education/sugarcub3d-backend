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
	res.status(200).send('Welcome to the SugarCub3d API. Go to /questions or /users to use the API.');
});

// Questions route
var questionsRoute = router.route('/questions');

/*
GET - Respond with a list of questions

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
		findQuery.select(select);
	}
	if (reqQuery.skip) {
		var skip = parseInt(reqQuery.skip, 10);
		findQuery.skip(skip);
	}
	if (reqQuery.limit) {
		var limit = parseInt(reqQuery.limit, 10);
		findQuery.limit(limit);
	}

	// execute query
	findQuery.exec(function (err, questions) {
		if (err) {
			console.error(err.stack);
			res.status(500).json({ message: 'HTTP 500 - Internal Server Error. A team of CS majors are on the case!'});
		}
		else {
			// Success
			res.status(200).json({message: 'OK', data: questions});
		}
	});
});

/*
POST - Create or update an existing question
*/
questionsRoute.post(function (req, res) {
	// find question in database before creationg
	/*if (req.params.questionText) {
		Question.findOne({'questionText' : req.params.questionText}, function (err, question) {

			if (err) {
				console.error(err.stack);
			}
			else { // question already exists

			}
		})
	} */
});

module.exports = router;




