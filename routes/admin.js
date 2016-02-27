var express = require('express');
var router = express.Router();

router.get('*' , function (req, res, next) {
  if (!req.user)
    res.status(401).send('Unauthorized');
  else
    next();
});
router.get('/', function (req, res) {
    res.render('admin/index');
});
router.get('/persons/:id', function (req, res) {
    res.render('admin/persons');
});

module.exports = router;
