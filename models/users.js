var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema for user object
var userSchema = new Schema({
	// _id : Schema.Types.ObjectId	automatically assigned by Mongoose
	dateCreated: {type: Date, required: true, default: Date.now},
	name: {type: String, required: false, default: null},
	email: {type: String, required: false, default: null},
	school_grade: {type: Number, required: false, min: 1, max: 16}, // 0 = undefined/null, 1-16 = not null
	experienceRating: {
		difficulty: {type: Number, required: false, min: 1, max: 5}, // 0 = undefined/null, 1-5 = not null
		gameInterface: {type: Number, required: false, min: 1, max: 5} // 0 = undefined/null, 1-5 = not null
	},
	questionRecords: [{type: Schema.Types.ObjectId, ref: 'QuestionRecord'}]
});

module.exports = mongoose.model('User', userSchema);

