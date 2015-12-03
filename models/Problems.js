// Schema for problems
var mongoose = require('mongoose');

// rand_coord for randomly choosing problems geospatially
var ProblemSchema = new mongoose.Schema({
	question: String,
	answer: String,
	choices: [String],
	rand_coord: {type: [Number], index: '2d', default: function(){
		return [Math.random(), 0];
	}}
});

// mongoose.model(model name, schema name, collection name)
// without collection name, find returns null
mongoose.model('Problem', ProblemSchema, 'Problem');