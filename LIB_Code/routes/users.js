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

// query database
router.param('id', function (req, res, next, item) {
  db.findUserOrderDetails(req.params.id, function (result, err) {
      if (err) {
        res.status(500).send("Database error.");
        return;
      }
      req.customerOrder = result;
      next();
  })
});

// GET login page
router.get('/login', function (req, res, next) {
  res.status(200);
  res.render('users/login', {
    loggedIn: req.session.verified,
    userPage: req.session.userid
  });
});

// POST login existing user
router.post('/login', function (req, res, next) {

  db.findUserByEmail(req.body.username, function (result, err) {
      if (err) {
        res.status(500).send("Database error.");
        return;
      }

      // if username exists
      if (result.length === 1 && req.body.password.length > 0) {
        db.findUserDetailByEmail(req.body.username, function (findUserDetails, err) {
            if (err) {
              res.status(500).send("Database error.");
              return;
            }
            if (findUserDetails.length>0){
              findUserDetails[0].hasAddress = true;
            } else {
              result[0].hasAddress = false;
            }

          // check PW
          if (result[0].u_password === req.body.password) {
            if (findUserDetails.length){
              req.session.verified = true;
              req.session.userid = result[0].email;
              req.session.userObj = findUserDetails[0];
            } else {
              req.session.verified = true;
              req.session.userid = req.body.username;
              req.session.userObj = result[0];

            }
            res.status(202).send(req.body.username.toString());
            return;

          } else {
            res.status(400).send("Password does not match");
            return;
          }
        })
        } else {
          res.status(400).send("User does not exist");
          return;
        }
  })
})

// PUT logout existing user
router.put('/login', function (req, res, next) {
  console.log(req.session)
  req.session.verified = false;
  req.session.userid = "";
  req.session.userObj = {}
  req.session.cart=[];
  res.status(200).send();
});

// GET sign-up page
router.get('/new', function (req, res, next) {
  res.status(200);
  res.render('users/new', {loggedIn: req.session.verified, userPage: req.session.userid});
});

// POST create new user
router.post('/', function (req, res, next) {
  db.findUserByEmail(req.body.email, function (result, err) {
      if (err) {
        res.status(500).send("Database error.");
        return;
      }
      if (result.length){
        res.status(400).send();
        return;
      } else {
        let passedValues = [req.body.firstName, req.body.lastName, req.body.phone, req.body.email, req.body.password, false]
        db.insertUsers([passedValues], function (result, err) {
            if (err) {
              res.status(500).send("Database error.");
              return;
            }
            res.status(200).send(req.body.email);
        });
      }
    });
});

// PUT analytics existing user
router.put('/', function (req, res, next) {
  // Stats by Year/ Date
  if (req.body.selectedAnalytics === 'date'){
    db.getAnalyticsByDate(function (result, err) {
        if (err) {
          res.status(500).send("Database error.");
          return;
        }
        res.status(200).send(result);
    });
  }

  // stats by Author
  if (req.body.selectedAnalytics === 'author'){
    db.getAnalyticsByAuthor(function (result, err) {
        if (err) {
          res.status(500).send("Database error.");
          return;
        }
        res.status(200).send(result);
    });
  }

  // stats by Genre
  if (req.body.selectedAnalytics === 'genre'){
    db.getAnalyticsByGenre(function (result, err) {
        if (err) {
          res.status(500).send("Database error.");
          return;
        }
        res.status(200).send(result);
    });
  }

  // stats by Publisher
  if (req.body.selectedAnalytics === 'publisher'){
    db.getAnalyticsByPublisher(function (result, err) {
        if (err) {
          res.status(500).send("Database error.");
          return;
        }
        res.status(200).send(result);
    });
  }
});

// GET selected user
router.get('/:id', function (req, res, next) {
  res.status(200).render('users/show', {
        loggedIn: req.session.verified,
        userPage: req.params.id,
        userObj: req.session.userObj,
        userOrder: req.customerOrder
  })
});


// export router to app.js
module.exports = router;
