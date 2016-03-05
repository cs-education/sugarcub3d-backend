var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema for question record object (metrics on user answering a specific question)
var questionRecordSchema = new Schema({
	// _id : Schema.Types.ObjectId	automatically assigned by Mongoose
	dateCreated: {type: Date, required: true, default: Date.now},
	questionId: {type: Schema.Types.ObjectId, required: true, ref: 'Question'},
	responseTime: {type: Number, required: true, default: -1},
	attemptCount: {type: Number, required: true, default: -1},
	attemptResponses: {type: [String], required: true, default: []},
	attemptsBeforeHint: {type: Number, required: true, default: 0}
});

module.exports = mongoose.model('QuestionRecord', questionRecordSchema);