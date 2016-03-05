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
	requestCount++;
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
			res.status(500).json({ message: 'HTTP 500 - Internal Server Error.'});
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
		Question.findOne({'questionText' : req.body.questionText}, function (err, question) {

			if (err) {
				console.error(err.stack);
				res.status(500).json({message: 'HTTP 500 - Internal Server Error'});
			}
			else {	// no error, check if question exists

				if (!question) {	// question doesn't exist, so create new one	
					
					// check if required params are provided
					if (!req.body.questionType || !req.body.questionText || !req.body.hintText || !req.body.correctAnswerText || !req.body.optionsText || !req.body.explanationText || !req.body.optionsText.A || !req.body.optionsText.B || !req.body.optionsText.C || !req.body.optionsText.D) {

						// req params not provided
						res.status(400).json({message: 'HTTP 400 - Bad Request. All required parameters for object creation not provided.'});
						console.error('HTTP 400 - Bad Request. All required parameters for object creation not provided.');
					}
					else {	// all required parameters provided
						var newQues = new Question();

						newQues.questionType = req.body.questionType;
						newQues.questionText = req.body.questionText;
						newQues.hintText = req.body.hintText;
						newQues.correctAnswerText = req.body.correctAnswerText;
						newQues.optionsText = req.body.optionsText;
						newQues.explanationText = req.body.explanationText;

						// save question
						newQues.save(function (err, savedQuestion) {
							if (err) {
								console.error(err.stack);
								res.status(500).json({message: 'HTTP 500 - Internal Server Error'});
							}
							else {
								// question saved
								res.status(201).json({message: 'Question saved', data: savedQuestion});
							}
						});

					}
				}
				else {	// question exists, update its values

					// check if required params are provided
					if (!req.body.questionType || !req.body.questionText || !req.body.hintText || !req.body.correctAnswerText || !req.body.optionsText || !req.body.explanationText || !req.body.optionsText.A || !req.body.optionsText.B || !req.body.optionsText.C || !req.body.optionsText.D) {

						// req params not provided
						res.status(400).json({message: 'HTTP 400 - Bad Request. All required parameters for object creation not provided.'});
						console.error('HTTP 400 - Bad Request. All required parameters for object creation not provided.');
					}
					else {	// params provided, update question
						question.questionType = req.body.questionType;
						question.questionText = req.body.questionText;
						question.hintText = req.body.hintText;
						question.correctAnswerText = req.body.correctAnswerText;
						question.optionsText = req.body.optionsText;
						question.explanationText = req.body.explanationText;
						// update date created with date last modified
						question.dateCreated = Date.now();

						// save/update question
						question.save(function (err, savedQuestion) {
							if (err) {
								console.error(err.stack);
								res.status(500).json({message: 'HTTP 500 - Internal Server Error'});
							}
							// question saved
							res.status(200).json({message: 'Question updated', data: savedQuestion});
						});
					}
				}

			}
		});
	 
});

module.exports = router;




