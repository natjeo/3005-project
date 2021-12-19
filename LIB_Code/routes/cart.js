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

// GET cart page
router.get('/', function(req, res, next){
  res.status(200);
  res.render('cart/index',{
    loggedIn: req.session.verified,
    userObj: req.session.userObj,
    userCart: req.session.cart
  });
});

// GET checkout page
router.get('/checkout', function(req, res, next){
  res.status(200);
  res.render('cart/checkout',{
    loggedIn: req.session.verified,
    userObj: req.session.userObj,
    userCart: req.session.cart
  });
});

// export router to app.js
module.exports = router;
