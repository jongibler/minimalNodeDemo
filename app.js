//setup web app
var express = require('express');
var app = express();
app.set('view engine', 'ejs');

//setup db
var mongoose = require('mongoose');
mongoose.connect('mongodb://dbuser:dbpassword@ds047114.mongolab.com:47114/experimental');

//routes
app.get('/', function (req, res) {
  res.render('index');
});

app.get('/persons', function (req, res) {
  res.render('persons');
});
app.get('/admin', function (req, res) {
  res.render('admin');
});
app.get('/admin/persons/edit/:id', function (req, res) {
  res.render('admin/persons/edit');
});

app.use('/api/persons', require('./api/persons.js'));
app.use('/controllers', express.static(__dirname + '/controllers'));
app.use('/res', express.static(__dirname + '/resources'));

//start server
app.listen(80, function () {
  console.log('Listening on port 80');
});

