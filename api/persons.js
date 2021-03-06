var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json());
var Person = require('../models/Person.js');

router.get('/', function(req, res) {
	console.log(new Date(Date.now()).toLocaleString() + ' - ' + 'Api Person Get All');
	Person.find(function(err, persons) {
		if (err){
			console.log(err);
			res.status(500).send(err);
			return;
		}
		res.json(persons);
	});
});

router.get('/:id', function(req, res){
	console.log(new Date(Date.now()).toLocaleString() + ' - ' + 'Api Person Get ' + req.params.id);

	if (req.params.id == "getTagsCount")
	{
		getTagsCount(function(tagsCount){res.json(tagsCount)});
		return;
	}

	Person.findById(req.params.id, function (err, person){
		if (err){
			console.log(err);
			res.status(500).send(err);
			return;
		}
		res.json(person);
	});
});

router.post('/', function(req, res) {
	var person = new Person();
	//copy props by name
	for(var k in req.body) person[k]=req.body[k];

	Person.findOneAndUpdate(	{_id : person._id }, person, { upsert: true }, function (err, result) {
		if (err) {
			res.status(500).send(err);
			return;
		}
		res.json(result);
	});

});

router.delete('/:id', function(req, res) {
	Person.remove({ _id : req.params.id }, function (err, deletedPerson) {
		if (err) {
			res.status(500).send(err);
			return;
		}
		Person.find(function(err, persons) {
			if (err){
				res.status(500).send(err);
				return;
			}
			res.json(persons);
		});
	});
});

function getTagsCount(cb){
	var tagCounts = null;
	Person.aggregate([
		{ $project: { tags: 1 } },
		{ $unwind: "$tags" },
		{ $group: {
			_id: "$tags",
			count: { $sum : 1 }
		}}],
		function (err, result) {
			if (err) {
				console.log(err);
				return;
			}
			cb(result);
		});	
};

module.exports = router;
