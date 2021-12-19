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

// GET home page (index)
router.get('/', function(req, res, next) {
    res.status(200);
    res.render('index/index', {
      loggedIn: req.session.verified,
      userObj: req.session.userObj
    });
});

// GET search results
router.get('/searchResult', function(req, res, next) {
  res.status(200);
  res.render('books/searchResult', {
    searchRes: req.session.searchRes,
    loggedIn: req.session.verified,
    userObj: req.session.userObj
  });
});

// export router to app.js
module.exports = router;
