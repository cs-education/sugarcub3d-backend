var mongoose = require('mongoose');
var random = require('mongoose-simple-random');
var Schema = mongoose.Schema;

// Schema for question object
var questionSchema = new Schema({
	// _id : Schema.Types.ObjectId   automatically assigned by Mongoose
	questionType : {type: String, required: true},	// 'MC' or 'IDE' for now
	questionText : {type: String, required: true},
	hintText : {type: String, required: true, default: ''},	// Multiple levels of hints
	correctAnswerText : {type: String, required: true},		// String answer, or 'A', 'B' etc for MC
	optionsText : {
		A : {type: String, default: ''},
		B : {type: String, default: ''},
		C : {type: String, default: ''},
		D : {type: String, default: ''}
	},
	explanationText : {type: String, required: true},
	dateCreated: {type: Date, default: Date.now}
});
questionSchema.plugin(random);

module.exports = mongoose.model('Question', questionSchema);