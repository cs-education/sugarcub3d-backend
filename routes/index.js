var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Problem = mongoose.model('Problem');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* get request for list of all problems */
router.get('/problems', function(req, res, next){
	Problem.find(function(err, problems){
		if(err){return next(err);}

		res.json(problems);
	});
});

/* get request for list of all problems */
router.get('/problems/:id', function(req, res, next){
	Problem.findById(req.params.id, function(err, problem){
		if(err){return next(err);}

		res.json(problem);
	});
});

/* post request to create new problem
	provide the following parameters in each request:
	question	- string
	answer		- string
	choices 	- array of strings
*/
router.post('/problems', function(req, res, next){
	var problem = new Problem({
		question:req.body.question,
		answer:req.body.answer,
		choices:req.body.choices,
		rand_coord:[Math.random(), 0]});

	problem.save(function(err, problem){
		if(err){return next(err);}

		res.json(problem);
	});
});

/* update a problem by id */
router.put('/problems/:id', function(req, res, next){
	Problem.findByIdAndUpdate(req.params.id, { $set:{
		question: req.body.question,
		answer: req.body.answer,
		choices: req.body.choices}},
		{new: true},
		function(err, problem){
			if(err){return next(err);}

			res.json(problem);
		}
	);
});

/* delete a problem by id */
router.delete('/problems/:id', function(req, res, next){
	Problem.findByIdAndRemove(req.params.id, function(err, problem){
		if(err){return next(err);}

		res.json(problem);
	});
});

/* get request for a random problem */
router.get('/random', function(req, res, next){
	var coord = [Math.random(), 0];

	var query1 = Problem.findOne({rand_coord: {$near:coord}});
	query1.exec(function(err, problem){
		if(err){return next(err);}

		res.json(problem);
	});
});

module.exports = router;
