var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json());
var Person = require('../models/Person.js');

router.get('/', function(req, res) {
	console.log(new Date(Date.now()).toDateString() + ' - ' + 'Public Api Persons Get');
	Person.find(function(err, persons) {
		if (err){
			console.log(err);
			res.status(500).send(err);
			return;
		}
		res.json(persons);
	});
});

module.exports = router;
