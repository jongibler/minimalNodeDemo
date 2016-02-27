var express = require('express');
var router = express.Router();

router.all('*' , function (req, res, next) {
  if (!req.user)
    res.status(401).send('Unauthorized');
  else
    next();
});

router.get('/', function (req, res) {
    res.render('admin/index', {user: req.user});
});

router.get('/persons/:id', function (req, res) {
    res.render('admin/persons', req.user);
});

module.exports = router;
