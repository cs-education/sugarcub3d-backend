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
		console.log(problems);
		res.json(problems);
	});
});

/* get request for a random problem */
router.get('/random', function(req, res, next){
	var coord = [Math.random(), 0];
	console.log(coord);
	var query1 = Problem.findOne({rand_coord: {$near:coord}});
	query1.exec(function(err, problem){
		if(err){return next(err);}
		console.log(problem);
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
	console.log(req.body.question);
	var problem = new Problem({question:req.body.question, answer:req.body.answer, choices:req.body.choices, rand_coord:[Math.random(), 0]});

	problem.save(function(err, problem){
		if(err){return next(err);}
		console.log(problem);
		res.json(problem);
	});
});

module.exports = router;
