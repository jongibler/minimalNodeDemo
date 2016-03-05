//get port for running app
var port = process.argv[2];
if (port == null) {
    console.log("Please supply a PORT argument. E.g.   node app.js 80");
    console.log("Exiting...");
    process.exit(1);
}

//setup web app
var express = require('express');
var app = module.exports = express();
app.set('view engine', 'ejs');

//db
var mongoose = require('mongoose');
mongoose.connect('mongodb://dbuser:dbpassword@ds047114.mongolab.com:47114/experimental');

//internal modules
require('./authentication.js');
require('./pdfUploader.js');

//routes
app.get('/', function (req, res) {
  res.render('index');
});
app.get('/persons', function (req, res) {
  res.render('persons/index', {user: req.user});
});

app.use('/admin', require('./routes/admin.js'));
app.use('/api', require('./routes/api.js'));
app.use('/publicapi/persons', require('./publicapi/persons.js'));
app.use('/controllers', express.static(__dirname + '/controllers'));
app.use('/res', express.static(__dirname + '/resources'));

//error handling
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

//start server
app.listen(port, function () {
  console.log('Listening on port ' + port);
});
