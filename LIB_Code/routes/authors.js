var express = require('express');
var router = express.Router();
const session = require('express-session');
const bodyParser = require('body-parser');
const db = require('../db/index');
const port = 3000

// create session for browser cookies
router.use(session({
  secret: "secret key",
  saveUninitialized: true,
  resave: true
}));
router.use(express.json());

router.get('/', function(req, res, next){
  res.status(200);
  res.render('authors/index');
});

module.exports = router;
