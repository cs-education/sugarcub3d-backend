/*
Route that handles the API for questions.
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
	console.log('Request at /questions');
	next();
});


// /questions
var questionsRoute = router.route('/');

/*
GET - Respond with a list of questions
*/
questionsRoute.get(function (req, res) {
	// get query params and build query
	var queryParams = req.query;
  	var where, sort, select, skip, limit;

	if (queryParams.where) {
 		where = JSON.parse(queryParams.where)
	}
	if (queryParams.sort) {
		sort = JSON.parse(queryParams.sort);
	}
	if (queryParams.select) {
		select = JSON.parse(queryParams.select);
	}
	if (queryParams.skip) {
		skip = parseInt(queryParams.skip, 10);
	}
	if (queryParams.limit) {
		limit = parseInt(queryParams.limit, 10);
	}

	// check if random order is requested
	if (!queryParams.random || queryParams.random === 'false') {
		var findQuery = Question.find();
		findQuery.where = where;
		findQuery.sort = sort;
		findQuery.select = select;
		findQuery.skip = skip;
		findQuery.limit = limit;
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
	}
	else {	// random order requested
		var options = {skip: skip, limit: limit};
		Question.findRandom(where, select, options, function (err, questions) {
			if (err) {
				console.error(err.stack);
				res.status(500).json({message: 'HTTP 500 - Internal Server Error.'});
			}
			else {
				// check if results are null
				if (!questions)
					res.status(200).json({message: 'No questions matching query.', data: questions});
				else
					res.status(200).json({message: 'HTTP 200 - OK', data: questions});
			}
		});
	}
	
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
					
					// MC question, check if params are provided
					if (req.body.questionType === 'MC' && (!req.body.questionType || !req.body.questionText || !req.body.hintText || !req.body.correctAnswerText || !req.body.optionsText || !req.body.explanationText || !req.body.optionsText.A || !req.body.optionsText.B || !req.body.optionsText.C || !req.body.optionsText.D)) {

						// send error
						res.status(400).json({message: 'HTTP 400 - Bad Request. All required parameters for object creation not provided.'});
						console.error('HTTP 400 - Bad Request. All required parameters for object creation not provided.');
					}
					// IDE question, check if params are provided
					else if (req.body.questionType === 'IDE' && (!req.body.questionType || !req.body.questionText || !req.body.hintText || !req.body.correctAnswerText)) {
						
						// send error
						res.status(400).json({message: 'HTTP 400 - Bad Request. All required parameters for object creation not provided.'});
						console.error('HTTP 400 - Bad Request. All required parameters for object creation not provided.');
					}
					else {	// all required parameters provided
						// create new question object
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

					// MC question, check if params are provided
					if (req.body.questionType === 'MC' && (!req.body.questionType || !req.body.questionText || !req.body.hintText || !req.body.correctAnswerText || !req.body.optionsText || !req.body.explanationText || !req.body.optionsText.A || !req.body.optionsText.B || !req.body.optionsText.C || !req.body.optionsText.D)) {

						// send error
						res.status(400).json({message: 'HTTP 400 - Bad Request. All required parameters for object creation not provided.'});
						console.error('HTTP 400 - Bad Request. All required parameters for object creation not provided.');
					}
					// IDE question, check if params are provided
					else if (req.body.questionType === 'IDE' && (!req.body.questionType || !req.body.questionText || !req.body.hintText || !req.body.correctAnswerText)) {
						
						// send error
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


// /questions/:id
var questionsIdRoute = router.route('/:id');

/*
GET - Respond with a question or a 404 Not Found
*/
questionsIdRoute.get(function (req, res) {
	if (req.params.id) {
		// find question in DB
		Question.findById(req.params.id, function (err, question) {
			if (err) {
				console.error(err.stack);
				res.status(500).json({message: 'HTTP 500 - Internal Server Error. Check validity of _id and try again later.'});
			}
			else {
				if (!question)	// question not found
					res.status(404).json({message: 'HTTP 404 - Question with _id ' + req.params.id + ' not found'});
				else
					res.status(200).json({message: 'HTTP 200 - Question found', data: question});
			}

		});
	}
	else
		res.status(400).json({message: 'HTTP 400 - Must include id as part of URL path.'});
});

/*
DELETE - Respond with successful deletion or 404 Not Found
*/
questionsIdRoute.delete(function (req, res) {
	if (req.params.id) {
		// find and remove document
		Question.findByIdAndRemove(req.params.id, function (err, question) {
			if (err) {
				console.error(err.stack);
				res.status(500).json({message: 'HTTP 500 - Internal Server Error.'});
			}
			else {
				if (!question)
					res.status(404).json({message: 'HTTP 404 - Question with _id' + req.params.id + ' not found.'});
				else
					res.status(200).json({message: 'HTTP 200 - Question removed.'});
			}
		});
	}
	else
		res.status(400).json({message: 'HTTP 400 - Must include id as part of URL path.' });
});

/*
PUT - Update a question or respond with 404 Not Found
*/
questionsIdRoute.put(function (req, res) {
		// find question in database before creationg
		Question.findById(req.params.id, function (err, question) {
			if (err) {
				console.error(err.stack);
				res.status(500).json({message: 'HTTP 500 - Internal Server Error'});
			}
			else {	// no error, check if question exists

				if (!question)	// question not found, respond with error
					res.status(404).json({message: 'HTTP 404 - Question with _id ' + req.params.id + ' not found.'});

				else {	// question exists, update its values

					// MC question, check if params are provided
					if (req.body.questionType === 'MC' && (!req.body.questionType || !req.body.questionText || !req.body.hintText || !req.body.correctAnswerText || !req.body.optionsText || !req.body.explanationText || !req.body.optionsText.A || !req.body.optionsText.B || !req.body.optionsText.C || !req.body.optionsText.D)) {

						// send error
						res.status(400).json({message: 'HTTP 400 - Bad Request. All required parameters for object creation not provided.'});
						console.error('HTTP 400 - Bad Request. All required parameters for object creation not provided.');
					}
					// IDE question, check if params are provided
					else if (req.body.questionType === 'IDE' && (!req.body.questionType || !req.body.questionText || !req.body.hintText || !req.body.correctAnswerText)) {
						
						// send error
						res.status(400).json({message: 'HTTP 400 - Bad Request. All required parameters for object creation not provided.'});
						console.error('HTTP 400 - Bad Request. All required parameters for object creation not provided.');
					}
					else {	

						// params provided, update question
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




