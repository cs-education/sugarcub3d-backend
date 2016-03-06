/*
Route that handles API for users.
Spring 2016 Senior Project
Author: Sukeerthi Khadri
*/

// dependencies
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var User = require('../models/users');


// middleware. code is executed for every request to this router
var requestCount = 0;
router.use(function (req, res, next) {
	console.log('Time of request : ', Date.now());
	requestCount++;
	console.log('Request count : ', requestCount);
	console.log('Request at /users');
	next();
});


// /users
var usersRoute = router.route('/');

/*
GET - Respond with a list of users
*/
usersRoute.get(function (req, res) {
	// initialize Mongo query
	var findQuery = User.find();
 
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
	findQuery.exec(function (err, users) {
		if (err) {
			console.error(err.stack);
			res.status(500).json({ message: 'HTTP 500 - Internal Server Error.'});
		}
		else {
			// Success
			res.status(200).json({message: 'OK', data: users});
		}
	});
});

/*
POST - Create or update an existing user
*/
usersRoute.post(function (req, res) {
	// find user in database before creationg
		User.findOne({'email' : req.body.email}, function (err, user) {

			if (err) {
				console.error(err.stack);
				res.status(500).json({message: 'HTTP 500 - Internal Server Error'});
			}
			else {	// no error, check if user exists

				if (!user) {	// user doesn't exist, so create new one	
					
					// check if required params are provided
					if (!req.body.name || !req.body.email || !req.body.school_grade || !req.body.experienceRating || !req.body.questionRecords) {

						// req params not provided
						res.status(400).json({message: 'HTTP 400 - Bad Request. All required parameters for object creation not provided.'});
						console.error('HTTP 400 - Bad Request. All required parameters for object creation not provided.');
					}
					else {	// all required parameters provided
						var newUser = new User();

						newUser.name = req.body.name;
						newUser.email = req.body.email;
						newUser.school_grade = req.body.school_grade;
						newUser.experienceRating = req.body.experienceRating;
						newUser.questionRecords = req.body.questionRecords;
						
						// save user
						newUser.save(function (err, savedUser) {
							if (err) {
								console.error(err.stack);
								res.status(500).json({message: 'HTTP 500 - Internal Server Error'});
							}
							else {
								// user saved
								res.status(201).json({message: 'User saved', data: savedUser});
							}
						});

					}
				}
				else {	// user exists, update its values

					// check if required params are provided
					if (!req.body.name || !req.body.email || !req.body.school_grade || !req.body.experienceRating || !req.body.questionRecords) {

						// req params not provided
						res.status(400).json({message: 'HTTP 400 - Bad Request. All required parameters for object creation not provided.'});
						console.error('HTTP 400 - Bad Request. All required parameters for object creation not provided.');
					}
					else {	// all required parameters provided
						var newUser = user;
						newUser.name = req.body.name;
						newUser.email = req.body.email;
						newUser.school_grade = req.body.school_grade;
						newUser.experienceRating = req.body.experienceRating;
						newUser.questionRecords = req.body.questionRecords;
						
						// save user
						newUser.save(function (err, savedUser) {
							if (err) {
								console.error(err.stack);
								res.status(500).json({message: 'HTTP 500 - Internal Server Error'});
							}
							else {
								// user saved
								res.status(201).json({message: 'User saved', data: savedUser});
							}
						});

					}					
				}

			}
		});
});

module.exports = router;