//get port for running app
var port = process.argv[2];
if (port == null) {
    console.log("Please supply a PORT argument. E.g.   node app.js 80");
    console.log("Exiting...");
    process.exit(1);
}

//setup web app
var express = require('express');
var app = express();
app.set('view engine', 'ejs');
var multer = require('multer');
var s3 = require('multer-s3');
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
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

var mime = require('mime');

//upload test
var upload = multer({
  storage: s3({
    dirname: 'demo',
    bucket: 'minimalnode',
    secretAccessKey: 'HZlvmyVxIykwlyvfqZouSG2Dh0t0QBRZsLnTe2Kg',
    accessKeyId: 'AKIAJ5OLJIYHQLBPSA2A',
    region: 'eu-west-1',
    contentType: s3.AUTO_CONTENT_TYPE,
    filename: function (req, file, cb) {
      var fileName = Date.now()+'.' + mime.extension(file.mimetype);
      cb(null, fileName);
      req.resultingFilename = fileName;
    }
  })
})

app.get('/upload', function (req, res) {
    res.status(200)
        .send('<form method="POST" enctype="multipart/form-data">'
            + '<input type="file" name="file"/><input type="submit"/>'
            + '</form>');
})

app.post('/upload', upload.single('file'), function(req, res, next){
  var baseUrl = 'http://s3-eu-west-1.amazonaws.com/minimalnode/demo/';
  var fileUrl = baseUrl+req.resultingFilename;
  res.send('Successfully uploaded!<br /><a href="'+fileUrl+'">'+fileUrl+'</a>');
});



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

//start server
app.listen(port, function () {
  console.log('Listening on port ' + port);
});
