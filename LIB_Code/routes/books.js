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
  db.findBookByID(req.params.id, function (result, err) {
      if (err) {
        res.status(500).send("Database error.");
        return;
      }
      req.book = result[0];
      db.findAuthorsByBookID(req.params.id, function (result, err) {
          if (err) {
            res.status(500).send("Database error.");
            return;
          }
          req.book_authors = result;
          db.findPublisherByBookID(req.params.id, function (result, err) {
              if (err) {
                res.status(500).send("Database error.");
                return;
              }
              req.book_publisher = result;
              db.findGenreByBookID(req.params.id, function (result, err) {
                  if (err) {
                    res.status(500).send("Database error.");
                    return;
                  }
                  req.book_genre = result;
          next();
        })
      })
    })
  })
});

// GET list of books
router.get('/', function(req, res, next) {
  let bookList = db.getBook;
  bookList(function (result, err) {
      if (err) {
        res.status(500).send("Database error.");
        return;
      }
    res.status(200);
    res.render('books/index', {
      bookList:result,
      loggedIn: req.session.verified,
      userObj: req.session.userObj
    });
  })
});

// GET input info for new books
router.get('/new', function(req, res, next) {
  res.status(200);
  res.render('books/new', {
    loggedIn: req.session.verified,
    userObj: req.session.userObj
  });
});

// POST add new books into database
router.post('/new', function(req, res, next) {
  let newBook = [req.body.isbn, req.body.title, req.body.year, req.body.price, req.body.royalties, req.body.numPages, req.body.stockQty]
  let newAuthor = [req.body.a_fname, req.body.a_lname]
  let newPublisher = [req.body.compname, req.body.p_phone, req.body.p_email, req.body.bankaccount]

  db.findBookByID(req.body.isbn, function (result, err) {
      if (err) {
        res.status(500).send("Database error.");
        return;
      }
      let foundBook = result;
      if (foundBook.length===0){
        // insert new book
        db.insertBook([newBook], function (result, err) {
            if (err) {
              res.status(500).send("Database error.");
              return;
            }
          })
      } else {
        res.status(404).send();
        return;
      }

      // insert publisher
      db.insertPublisher([[newPublisher]], function (result, err) {
          if (err) {
            res.status(500).send("Database error.");
            return;
          }
          db.insertBookPublishedByPublisher([[req.body.isbn, req.body.compname]], function (result, err) {
              if (err) {
                res.status(500).send("Database error.");
                return;
              }
          // insert new author
          db.insertAuthor([newAuthor], function (result, err) {
            if (err) {
              res.status(500).send("Database error.");
              return;
            }
            let a_id = result[0].a_id;
            db.insertBookWrittenByAuthor([[req.body.isbn, a_id]], function (result, err) {
                if (err) {
                  res.status(500).send("Database error.");
                  return;
                }
                // establish book genre
                db.insertBookHasGenre([[req.body.isbn, req.body.genre]], function (result, err) {
                    if (err) {
                      res.status(500).send("Database error.");
                      return;
                    }
                    return res.status(202).send(String(req.body.isbn));
            });
          });
        });
      });
    });
  });
});

// GET specific book requested
router.get('/:id', function(req, res, next) {
  res.status(200);
  res.render('books/show', {
    foundBook:req.book,
    foundAuthors:req.book_authors,
    foundPublisher:req.book_publisher,
    foundGenre: req.book_genre,
    loggedIn: req.session.verified,
    userObj: req.session.userObj
  });
});

// PUT add book item to cart array
let tempCart = [];
router.put('/', function(req, res, next) {
  db.findBookByID(req.body.isbn, function (result, err) {
      if (err) {
        res.status(500).send("Database error.");
        return;
      }

      // if cart is empty
      if (tempCart.length === 0){
        if (result[0].stockqty>=1){
          result[0].qty = 1;
          result[0].subtotal = result[0].price;
          tempCart.push(result[0]);
        } else {
          res.status(404).send();
        }
      } else {

      // if there is something
      let matching = false;
      let matchIndex = 0;
          for (const i in tempCart) {
            if (tempCart[i].isbn === result[0].isbn){
              matching = true;
              matchIndex = i
            }
          }
          if (matching) {
            if (result[0].stockqty >= tempCart[matchIndex].qty+1){
              tempCart[matchIndex].qty++;
              let subtotal = (tempCart[matchIndex].price * tempCart[matchIndex].qty).toFixed(2);
              tempCart[matchIndex].subtotal = subtotal;
            } else {
              res.status(404).send();
            }
          } else {
            if (result[0].stockqty>=1){
              result[0].qty = 1;
              result[0].subtotal = result[0].price;
              tempCart.push(result[0]);
            }
          }
        }
        console.log(tempCart)
      req.session.cart = tempCart;
      tempCart = [];
    res.status(202).send();
    return;
  });
});

// POST delete books from database
router.post('/', function(req, res, next) {
    db.deleteBookbyID(req.body.isbn, function (result, err) {
        if (err) {
          res.status(500).send("Database error.");
          return;
        }
      res.status(202).send();
      return;
  });
});

// PUT search given keyword/ table
router.put('/searchResult', function(req, res, next) {

  if (req.body.tableSelect === 'book'){
    db.findSearchBook(req.body.keyword, function (result, err) {
        if (err) {
          res.status(500).send("Database error.");
          return;
        }
        req.session.searchRes = result;
        res.status(202).send(result);
        return;
    });
  }
  if (req.body.tableSelect === 'author'){
    db.findSearchAuthor(req.body.keyword, function (result, err) {
        if (err) {
          res.status(500).send("Database error.");
          return;
        }
        req.session.searchRes = result;
        res.status(202).send(result);
        return;
    });
  }
  if (req.body.tableSelect === 'genre'){
    db.findSearchGenre(req.body.keyword, function (result, err) {
        if (err) {
          res.status(500).send("Database error.");
          return;
        }
        req.session.searchRes = result;
        res.status(202).send(result);
        return;
    });
  }
  if (req.body.tableSelect === 'publisher'){
    db.findSearchPublisher(req.body.keyword, function (result, err) {
        if (err) {
          res.status(500).send("Database error.");
          return;
        }
        req.session.searchRes = result;
        res.status(202).send();
        return;
    });
  }
});


// export router to app.js
module.exports = router;
