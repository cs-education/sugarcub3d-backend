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

// /users/:id

var usersIdRoute = router.route('/:id')

/*
GET - Respond with a specific user or 404 Not Found
*/
usersIdRoute.get(function (req, res) {
	if (req.params.id) {
		// find User in DB
		User.findById(req.params.id, function (err, user) {
			if (err) {
				console.error(err.stack);
				res.status(500).json({message: 'HTTP 500 - Internal Server Error. Check validity of _id and try again.'});
			}
			else {
				if (!user) // user not found
					res.status(404).json({message: 'HTTP 404 - User with _id ' + req.params.id + ' not found'});
				else	// user found
					res.status(200).json({message: 'HTTP 200 - User found', data: user});
			}
		});
	}
	else
		res.status(400).json({message: 'HTTP 400 - Must include id as part of URL path.'});
});

/*
PUT - Respond with updated user or 404 Not Found
*/
usersIdRoute.put(function (req, res) {
	// find user in DB
	User.findById(req.params.id, function (err, user) {
		if (err) {
			console.error(err.stack);
			res.status(500).json({message: 'HTTP 500 - Internal Server Error. Check validity of _id and try again.'});
		}
		else {
			if (!user)	// user not found
				res.status(404).json({message: 'HTTP 404 - User with _id ' + req.params.id + ' not found.'});
			else {	// user found

				// check if required params are provided
					if (!req.body.name || !req.body.email || !req.body.school_grade || !req.body.experienceRating || !req.body.questionRecords) {

						// req params not provided
						res.status(400).json({message: 'HTTP 400 - Bad Request. All required parameters for object update not provided.'});
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

/*
DELETE - Respond with deletion confirmation or 404 Not Found
*/
usersIdRoute.delete(function (req, res) {
	if (req.params.id) {
		// find and remove user
		User.findByIdAndRemove(req.params.id, function (err, user) {
			if (err) {
				console.error(err.stack);
				res.status(500).json({message: 'HTTP 500 - Internal Server Error.'});
			}
			else {
				if (!user)
					res.status(404).json({message: 'HTTP 404 - User with _id ' + req.params.id + ' not found.'});
				else
					res.status(200).json({message: "HTTP 200 - User removed."});
			}
		});
	}
});

module.exports = router;