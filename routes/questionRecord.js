/*
Route that handles API for question records.
Spring 2016 Senior Project
Author: Sukeerthi Khadri
*/

// dependencies
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

// mongoose model
var QuestionRecord = require('../models/questionRecord');

// middleware. code is executed for every request to this router
var requestCount = 0;
router.use(function (req, res, next) {
	console.log('Time of request : ', Date.now());
	requestCount++;
	console.log('Request count : ', requestCount);
	console.log('Request at /questionRecords');
	next();
});

// /questionRecords
var questionRecordsRoute = router.route('/');

/*
GET - Respond with a list of question records
*/
questionRecordsRoute.get(function (req, res) {
	// initialize Mongo query
	var findQuery = QuestionRecord.find();

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
	findQuery.exec(function (err, questionRecords) {
		if (err) {
			console.error(err.stack);
			res.status(500).json({ message: 'HTTP 500 - Internal Server Error.'});
		}
		else {
			// Success
			QuestionRecord.populate(questionRecords, {path: 'questionId'}, function (err, records) {
				if (err)
					res.status(500).json({message: 'HTTP 500 - Internal Server Error'});
				else {
					res.status(200).json({message: 'HTTP 200 OK', data: records});
				}
			});
		}
	});
});

/*
POST - Create a new question record.
*/
questionRecordsRoute.post(function (req, res) {
	// check if all params have been provided
	if (!req.body.questionId || !req.body.responseTime || !req.body.attemptCount || !req.body.attemptResponses || !req.body.attemptsBeforeHint)
		res.status(400).json({message: 'HTTP 400 - Bad Request! All required params not provided'});
	else {

		var newRecord = new QuestionRecord();

		newRecord.questionId = req.body.questionId;
		newRecord.responseTime = req.body.responseTime;
		newRecord.attemptCount = req.body.attemptCount;
		newRecord.attemptResponses = req.body.attemptResponses;
		newRecord.attemptsBeforeHint = req.body.attemptsBeforeHint;

		newRecord.save(function (err, savedRecord) {
			if (err) {
				console.error(err.stack);
				res.status(500).json({message: 'HTTP 500 - Internal Server Error'});
			}
			else {
				// record saved, get populated results
				QuestionRecord.findOne({_id: savedRecord._id})
				.populate('questionId')
				.exec(function (err, questionRecord) {
					if (err)
						res.status(500).json({message: 'HTTP 500 - Internal server error.'});
					else
						res.status(201).json({message: 'HTTP 201 - Question Record created.', data: questionRecord});
				});
			}
		});

	}
});


module.exports = router;
