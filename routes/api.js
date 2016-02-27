var express = require('express');
var router = express.Router();

router.get('*' , function (req, res, next) {
  if (!req.user)
    res.status(401).send('Unauthorized');
  else
    next();
});

router.use('/persons', require('../api/persons.js'));
router.use('/users', require('../api/users.js'));

module.exports = router;
