//setup web app
var express = require('express');
var app = express();
app.set('view engine', 'ejs');

//setup db
var mongoose = require('mongoose');
mongoose.connect('mongodb://dbuser:dbpassword@ds047114.mongolab.com:47114/experimental');

//setup authentication
//TODO: MOVE TO SEPARATE FILE
app.use(require('cookie-parser')());
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

var passport = require('passport')
, LocalStrategy = require('passport-local').Strategy;
var User = require('./models/User.js');
var bodyParser = require('body-parser');
app.use(bodyParser.json());

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { console.log('err'+ err); return done(err); }
      if (!user) { console.log('!user'); return done(null, false); }
      if (user.password != password) { console.log('!password'); return done(null, false); }
      console.log('authenticated');
      return done(null, user);
    });
  }
));
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});
passport.deserializeUser(function(id, cb) {
  User.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});
app.use(passport.initialize());
app.use(passport.session());

app.post('/login', passport.authenticate('local'), function(req, res) { res.send('login ok'); });
app.get('/authTest',
function(req, res) {
  res.send(req.user);
});


//routes
app.get('/', function (req, res) {
  res.render('index');
});
app.get('/persons', function (req, res) {
  res.render('persons/index');
});

app.use('/admin', require('./routes/admin.js'));
app.use('/api', require('./routes/api.js'));
app.use('/publicapi/persons', require('./publicapi/persons.js'));

app.use('/controllers', express.static(__dirname + '/controllers'));
app.use('/res', express.static(__dirname + '/resources'));

//start server
app.listen(80, function () {
  console.log('Listening on port 80');
});
