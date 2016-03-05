var mongoose = require('mongoose');

module.exports = mongoose.model('UploadedPDF', {
	originalFilename : String,
	s3BucketFilename : String,
	linkToDownload : String
});
