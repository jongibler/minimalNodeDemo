var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json());
var User = require('../models/User.js');

router.post('/', function(req, res) {
	var user = new User();

	//copy props by name
	for(var k in req.body) user[k]=req.body[k];

	User.findOneAndUpdate(	{_id : user._id }, user, { upsert: true }, function (err, result) {
		if (err) {
			res.status(500).send(err);
			return;
		}
		res.json(result);
	});

});

router.delete('/:id', function(req, res) {
	User.remove({ _id : req.params.id }, function (err, deletedUser) {
		if (err) {
			res.status(500).send(err);
			return;
		}
		User.find(function(err, allUsers) {
			if (err){
				res.status(500).send(err);
				return;
			}
			res.json(allUsers);
		});
	});
});

module.exports = router;
