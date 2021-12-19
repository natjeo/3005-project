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
  db.findOrderByID(req.params.id, function (result, err) {
      if (err) {
        res.status(500).send("Database error.");
        return;
      }
      req.foundOrder = result;
      next();
  })
});

// GET home page (index)
router.get('/', function(req, res, next) {
    res.status(200);
    res.render('orders/index', {
      loggedIn: req.session.verified,
      userObj: req.session.userObj
    });
});

// GET selected order
router.get('/:id', function (req, res, next) {
  // find shipping info
  db.findTracking([req.foundOrder[0].o_id], function (result, err) {
    if (err) {
      res.status(500).send("Database error in insertOrders.");
      return;
    }
    let trackingInfo = result

  // find order details
  db.findOrderDetails([req.foundOrder[0].o_id], function (result, err) {
      if (err) {
        res.status(500).send("Database error in insertOrders.");
        return;
      }
      result.forEach((item) => {
        let subtotal = item.soldqty * item.price
        item.subtotal = subtotal.toFixed(2)
      });
      let orderDetails = result

      db.findOrderAddress([req.foundOrder[0].o_id], function (result, err) {
          if (err) {
            res.status(500).send("Database error in insertOrders.");
            return;
          }

    res.status(200).render('orders/show', {
          loggedIn: req.session.verified,
          userObj: req.session.userObj,
          orderDetails: orderDetails,
          orderAddress: result,
          trackingDetails: trackingInfo,
      })
    })
  })
})
});

// POST checkout and create a new order
router.post('/', function(req, res, next){
  // order related setup
  let tracking = 'Not yet shipped.'
  let d = new Date();
  let date = d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate();
  var totalQty = 0;
  var totalPrice = 0;

  req.session.cart.forEach((item) => {
    totalQty += item.qty
    totalPrice += parseFloat(item.subtotal)
  });
  let newOrder = [req.session.userObj.email, totalQty, totalPrice, 'Order placed', date]
  // address related setup
  let shippingAddress = [req.body.s_street, req.body.s_postal, req.body.s_city, req.body.s_state, req.body.s_country]
  let orderAddress = []
  // books ordered related setup
  let booksBought = []

  // insert new order
  db.insertOrders([newOrder], function (result, err) {
    if (err) {
      res.status(500).send("Database error in insertOrders.");
      return;
    }
    let orderNumb = parseInt(result[0].o_id)

  // insert shipper
  db.insertshipper([[orderNumb, tracking]], function (result, err) {
    if (err) {
      res.status(500).send("Database error in insertOrders.");
      return;
    }

  // insert Book Bought By Order
  req.session.cart.forEach(book => {
    let eachBookBought = [];

    eachBookBought.push(orderNumb)
    eachBookBought.push(book.isbn);
    eachBookBought.push(book.qty);
    booksBought.push(eachBookBought);
    let updateQty = book.stockqty - book.qty

    db.reduceQty(updateQty, book.isbn, function (result, err) {
      if (err) {
        res.status(500).send("Database error in insertBookBoughtByOrder.");
        return;
      }
    })

  });
  db.insertBookBoughtByOrder(booksBought, function (result, err) {
    if (err) {
      res.status(500).send("Database error in insertBookBoughtByOrder.");
      return;
    }

  // if shipping address === billing address
  if (req.body.s_isBilling) {
    db.findAddress(req.body.s_street, req.body.s_postal, function (result, err) {
      if (err) {
        res.status(500).send("Database error in insertBookBoughtByOrder.");
        return;
      }
      // insert address if not in database
      if (result.length===0){
        db.insertAddress([shippingAddress], function (result, err) {
          if (err) {
            res.status(500).send("Database error in insertAddress.");
            return;
          }
          // insert order address
          db.insertOrderAddress([[req.body.s_street, req.body.s_postal, orderNumb, req.body.s_isShipping, req.body.s_isBilling]], function (result, err) {
              if (err) {
                res.status(500).send("Database error in insertOrderAddress.");
                return;
              }
              req.session.cart = [];
              return res.status(201).send(String(orderNumb));
          })
        });
      } else {
        // insert order address
        db.insertOrderAddress([[req.body.s_street, req.body.s_postal, orderNumb, req.body.s_isShipping, req.body.s_isBilling]], function (result, err) {
            if (err) {
              res.status(500).send("Database error in insertOrderAddress.");
              return;
            }
            req.session.cart = [];
            return res.status(201).send(String(orderNumb));
        })
      }
    })

  } else {
    // if shipping address !== billing address
    db.findAddress(req.body.s_street, req.body.s_postal, function (result, err) {
      if (err) {
        res.status(500).send("Database error in insertBookBoughtByOrder.");
        return;
      }
      let existingShipping = result;
      db.findAddress(req.body.b_street, req.body.b_postal, function (result, err) {
        if (err) {
          res.status(500).send("Database error in insertBookBoughtByOrder.");
          return;
        }
        let existingBilling = result;

        if (existingShipping.length===0){
          let billingAddress = [req.body.b_street, req.body.b_postal, req.body.b_city, req.body.b_state, req.body.b_country]
            db.insertAddress([shippingAddress], function (result, err) {
              if (err) {
                res.status(500).send("Database error in insertAddress.");
                return;
              }
            })
        }

        if (existingBilling.length===0){
          let billingAddress = [req.body.b_street, req.body.b_postal, req.body.b_city, req.body.b_state, req.body.b_country]
            db.insertAddress([billingAddress], function (result, err) {
              if (err) {
                res.status(500).send("Database error in insertAddress.");
                return;
              }
            })
        }

      // insert order address
      let addShipping = [req.body.s_street, req.body.s_postal, orderNumb, req.body.s_isShipping, req.body.s_isBilling]
      let addBilling = [req.body.b_street, req.body.b_postal, orderNumb, req.body.b_isShipping, req.body.b_isBilling]
      db.insertOrderAddress_shipBill([addShipping], [addBilling], function (result, err) {
          if (err) {
            res.status(500).send("Database error in insertOrderAddress.");
            return;
          }
          req.session.cart = [];
          return res.status(201).send(String(orderNumb));
      })
    })
  })
  }

})
})
})
})

// PUT search for order details by o_id
router.put('/', function(req, res, next) {
  db.findOrderByID(parseInt(req.body.orderLookup), function (result, err) {
    if (result.length===0){
      res.status(500).send("o_id does not exist.");
      return;
    } else {
      res.status(201).send(req.body.orderLookup);
      return;
    }
  });
});

// export router to app.js
module.exports = router;
