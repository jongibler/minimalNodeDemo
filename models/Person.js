var mongoose = require('mongoose');

module.exports = mongoose.model('Person', {
	firstName : String,
	lastName : String,
	age : Number,
	description: String,
	tags : Array,
	uploadedPDFUrl : String
});
