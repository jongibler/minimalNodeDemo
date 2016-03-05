var app = require('./app.js');

app.use(require('cookie-parser')());
app.use(require('express-session')({ secret: 'TNSLPPBNTSO', resave: false, saveUninitialized: false }));

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
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
