// UPDATE REQUIRED FOR SET UP AND CONNECTION TO POSTGRESQL
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',                           // insert your user name here
  host: 'localhost',                          // insert your host name here
  database: 'COMP3005_onlineBookstore',       // insert your database name here
  password: 'COMP3005',                       // insert your password here
  port: 5432,
})

const format = require('pg-format');

// create schemas-----------------------------------------------------------------------------------------------------------------
const createEntitySchemas = function(callback){
  pool.query(`
    DROP TABLE IF EXISTS address CASCADE;
    CREATE TABLE address (
      street              varchar(255),
      postalcode          varchar(100),
      city                varchar(100),
      province            varchar(100),
      country             varchar(100),
      CONSTRAINT add_id PRIMARY KEY(street, postalcode)
    );
    DROP TABLE IF EXISTS author CASCADE;
    CREATE TABLE author (
      a_id              serial PRIMARY KEY,
      a_firstname       varchar(255),
      a_lastName        varchar(255)
    );
    DROP TABLE IF EXISTS book CASCADE;
    CREATE TABLE book (
      isbn              varchar(255) PRIMARY KEY,
      title             varchar(255),
      year              smallint,
      price             numeric(5, 2),
      royalties         real,
      numPages          smallint,
      stockQty          smallint
    );
    DROP TABLE IF EXISTS publisher CASCADE;
    CREATE TABLE publisher (
      compname          varchar(255) PRIMARY KEY,
      p_phone           varchar(100),
      p_email           varchar(255),
      p_bankAccount     varchar(34)
    );
    DROP TABLE IF EXISTS users CASCADE;
    CREATE TABLE users (
      email             varchar(255) PRIMARY KEY,
      u_firstName       varchar(255),
      u_lastName        varchar(255),
      u_phone           varchar(255),
      u_password        varchar(255),
      isAdmin           boolean
    );
    DROP TABLE IF EXISTS orders CASCADE;
    CREATE TABLE orders (
      o_id                serial PRIMARY KEY,
      email               varchar(255),
      totalQty            smallint,
      totalPrice          numeric(5, 2),
      status              varchar(100),
      orderPlacedDate     varchar(255),
      FOREIGN KEY(email) REFERENCES users(email) ON DELETE CASCADE
    );
    `
    , (error, results)=>{
    if (error){
      throw error
    }
    callback();
  })
}

const createRelationsSchemas = function(callback){
  pool.query(`
    DROP TABLE IF EXISTS book_boughtBy_order CASCADE;
    CREATE TABLE book_boughtBy_order (
      o_id        integer REFERENCES orders (o_id) ON DELETE CASCADE,
      isbn        varchar(255) REFERENCES book (isbn) ON DELETE CASCADE,
      soldQty     smallint,
      PRIMARY KEY (o_id, isbn)
    );
    DROP TABLE IF EXISTS genre CASCADE;
    CREATE TABLE genre (
      isbn        varchar(255) REFERENCES book (isbn) ON DELETE CASCADE,
      genre       varchar(100),
      PRIMARY KEY (isbn, genre)
    );
    DROP TABLE IF EXISTS book_publishedBy_publisher CASCADE;
    CREATE TABLE book_publishedBy_publisher (
      isbn        varchar(255) REFERENCES book (isbn) ON DELETE CASCADE,
      compname    varchar(255) REFERENCES publisher (compname) ON DELETE CASCADE,
      PRIMARY KEY (isbn, compname)
    );
    DROP TABLE IF EXISTS book_writtenBy_author CASCADE;
    CREATE TABLE book_writtenBy_author (
      isbn        varchar(255) REFERENCES book (isbn) ON DELETE CASCADE,
      a_id        integer REFERENCES author (a_id) ON DELETE CASCADE,
      PRIMARY KEY (isbn, a_id)
    );
    DROP TABLE IF EXISTS publisherAddress CASCADE;
    CREATE TABLE publisherAddress (
      street      varchar(255),
      postalcode  varchar(100),
      compname    varchar(255) REFERENCES publisher (compname) ON DELETE CASCADE,
      FOREIGN KEY (street, postalcode) REFERENCES address (street, postalcode),
      PRIMARY KEY (street, postalcode)
    );
    DROP TABLE IF EXISTS shipper CASCADE;
    CREATE TABLE shipper (
      o_id              integer REFERENCES orders (o_id) ON DELETE CASCADE,
      trackingnumber    varchar(100),
      PRIMARY KEY (o_id, trackingnumber)
    );
    DROP TABLE IF EXISTS usersAddress CASCADE;
    CREATE TABLE usersAddress (
      street      varchar(255),
      postalcode  varchar(100),
      email       varchar(255) REFERENCES users (email) ON DELETE CASCADE,
      FOREIGN KEY (street, postalcode) REFERENCES address (street, postalcode),
      PRIMARY KEY (street, postalcode, email)
    );
    DROP TABLE IF EXISTS ordersAddress CASCADE;
    CREATE TABLE ordersAddress (
      o_id        integer REFERENCES orders (o_id) ON DELETE CASCADE,
      street      varchar(255),
      postalcode  varchar(100),
      isShipping  boolean,
      isBilling   boolean,
      FOREIGN KEY (street, postalcode) REFERENCES address (street, postalcode),
      PRIMARY KEY (o_id, street, postalcode)
    );
    `
    , (error, results)=>{
    if (error){
      throw error
    }
    callback();
  })
}

const seedDB = function(callback){
  pool.query(`
    COPY address(street, postalcode, city, province, country)
    FROM 'C:\\Users\\Public\\dataSeeds\\address.csv'
    DELIMITER ','
    CSV HEADER
    ;
    COPY author(a_firstname, a_lastname)
    FROM 'C:\\Users\\Public\\dataSeeds\\author.csv'
    DELIMITER ','
    CSV HEADER
    ;
    COPY book(isbn, title, year, price, royalties, numPages, stockQty)
    FROM 'C:\\Users\\Public\\dataSeeds\\book.csv'
    DELIMITER ','
    CSV HEADER
    ;
    COPY publisher(compname, p_phone, p_email, p_bankAccount)
    FROM 'C:\\Users\\Public\\dataSeeds\\publisher.csv'
    DELIMITER ','
    CSV HEADER
    ;
    COPY users(email, u_firstname, u_lastname, u_phone, u_password, isAdmin)
    FROM 'C:\\Users\\Public\\dataSeeds\\users.csv'
    DELIMITER ','
    CSV HEADER
    ;
    COPY orders(email, totalQty, totalPrice, status, orderPlacedDate)
    FROM 'C:\\Users\\Public\\dataSeeds\\orders.csv'
    DELIMITER ','
    CSV HEADER
    ;
    COPY book_boughtBy_order(o_id, isbn, soldQty)
    FROM 'C:\\Users\\Public\\dataSeeds\\book_boughtBy_order.csv'
    DELIMITER ','
    CSV HEADER
    ;
    COPY genre(isbn, genre)
    FROM 'C:\\Users\\Public\\dataSeeds\\genre.csv'
    DELIMITER ','
    CSV HEADER
    ;
    COPY book_publishedBy_publisher(isbn, compname)
    FROM 'C:\\Users\\Public\\dataSeeds\\book_publishedBy_publisher.csv'
    DELIMITER ','
    CSV HEADER
    ;
    COPY book_writtenBy_author(isbn, a_id)
    FROM 'C:\\Users\\Public\\dataSeeds\\book_writtenBy_author.csv'
    DELIMITER ','
    CSV HEADER
    ;
    COPY publisherAddress(street, postalcode, compname)
    FROM 'C:\\Users\\Public\\dataSeeds\\publisherAddress.csv'
    DELIMITER ','
    CSV HEADER
    ;
    COPY shipper(o_id, trackingnumber)
    FROM 'C:\\Users\\Public\\dataSeeds\\shipper.csv'
    DELIMITER ','
    CSV HEADER
    ;
    COPY usersAddress(street, postalcode, email)
    FROM 'C:\\Users\\Public\\dataSeeds\\usersAddress.csv'
    DELIMITER ','
    CSV HEADER
    ;
    COPY ordersAddress(o_id, street, postalcode, isShipping, isBilling)
    FROM 'C:\\Users\\Public\\dataSeeds\\orderAddress.csv'
    DELIMITER ','
    CSV HEADER
    ;
    `
    , (error, results)=>{
    if (error){
      throw error
    }
    callback();
    })
  }

  const restock_trigger = function(callback){
    pool.query(`
      DROP FUNCTION IF EXISTS sold_prev_month(varchar(255)) CASCADE;
      CREATE FUNCTION sold_prev_month(book_ISBN varchar(255))
      RETURNS smallint AS $no_sold$
      DECLARE no_sold smallint;
      BEGIN
      SELECT COALESCE(SUM(soldQty),0) into no_sold
      FROM orders INNER JOIN book_boughtby_order ON orders.o_id = book_boughtby_order.o_id
      WHERE isbn = book_ISBN AND orders.o_id IN (SELECT o_id
      										   FROM orders
      										   WHERE (TO_DATE(orderplaceddate,'YYYY-MM-DD') >= DATE_TRUNC('month', current_date - interval '1' month)) AND (TO_DATE(orderplaceddate,'YYYY-MM-DD') < DATE_TRUNC('month', current_date)));
      RETURN no_sold;
      END;
      $no_sold$ LANGUAGE plpgsql;

      DROP FUNCTION IF EXISTS restock() CASCADE;
      CREATE OR REPLACE FUNCTION restock()
        RETURNS trigger AS
      $$
      BEGIN
      UPDATE book
      SET stockqty = (NEW.stockqty + sold_prev_month(OLD.isbn));
      RETURN NEW;
      END;

      $$
      LANGUAGE 'plpgsql';

      DROP TRIGGER IF EXISTS orderMoreBooks ON book CASCADE;
      CREATE TRIGGER orderMoreBooks
        AFTER UPDATE OF stockQty
        ON book
      FOR EACH ROW
      WHEN (NEW.stockqty < 10 and OLD.stockqty >= 10)
      EXECUTE PROCEDURE restock();
      `
      , (error, results)=>{
      if (error){
        throw error
      }
      callback();
      })
    }

// update schemas-----------------------------------------------------------------------------------------------------------------
const insertAuthor = function(passedValues, callback){
  let command = format(`
    INSERT INTO author (a_firstname, a_lastName) VALUES %L
    RETURNING a_id
    `,
    passedValues);
  pool.query(command, (error, results)=>{
    if (error){
      throw error
    }
    callback(results.rows);
  })
}

const insertBook = function(passedValues, callback){
  let command = format(`
    INSERT INTO book (isbn, title, year, price, royalties, numPages, stockQty) VALUES %L`,
    passedValues);
  pool.query(command, (error, results)=>{
    if (error){
      throw error
    }
    callback();
  })
}

const insertPublisher = function(passedValues, callback){
  let command = format(`
    INSERT INTO publisher (compname, p_phone, p_email, p_bankAccount) VALUES %L`,
    passedValues);
  pool.query(command, (error, results)=>{
    if (error){
      throw error
    }
    callback();
  })
}

const insertUsers = function(passedValues, callback){
  let command = format(`
    INSERT INTO users (u_firstName, u_lastName, u_phone, email, u_password, isAdmin) VALUES %L`,
    passedValues);
  pool.query(command, (error, results)=>{
    if (error){
      throw error
    }
    callback();
  })
}

const insertOrders = function(passedValues, callback){
  let command = format(`
    INSERT INTO orders (email, totalQty, totalPrice, status, orderPlacedDate) VALUES %L
    RETURNING o_id
    `,
    passedValues, );
  pool.query(command, (error, results)=>{
    if (error){
      throw error
    }
    callback(results.rows);
  })
}

const insertAddress = function(passedValues, callback){
  let command = format(`
    INSERT INTO address (street, postalcode, city, province, country) VALUES %L
    `,
    passedValues);
  pool.query(command, (error, results)=>{
    if (error){
      throw error
    }
    callback();
  })
}

const insertBookHasGenre = function(passedValues, callback){
  let command = format(`
    INSERT INTO genre (isbn, genre) VALUES %L`,
    passedValues);
  pool.query(command, (error, results)=>{
    if (error){
      throw error
    }
    callback();
  })
}

const insertBookWrittenByAuthor = function(passedValues, callback){
  let command = format(`
    INSERT INTO book_writtenBy_author (isbn, a_id) VALUES %L`,
    passedValues);
  pool.query(command, (error, results)=>{
    if (error){
      throw error
    }
    callback();
  })
}

const insertBookPublishedByPublisher = function(passedValues, callback){
  let command = format(`
    INSERT INTO book_publishedBy_publisher (isbn, compname) VALUES %L`,
    passedValues);
  pool.query(command, (error, results)=>{
    if (error){
      throw error
    }
    callback();
  })
}

const insertBookBoughtByOrder = function(passedValues, callback){
  let command = format(`
    INSERT INTO book_boughtBy_order (o_id, isbn, soldQty) VALUES %L`,
    passedValues);
  pool.query(command, (error, results)=>{
    if (error){
      throw error
    }
    callback();
  })
}

const insertPublisherAddress = function(passedValues, callback){
  let command = format(`
    INSERT INTO publisherAddress (street, postalcode, compname) VALUES %L`,
    passedValues);
  pool.query(command, (error, results)=>{
    if (error){
      throw error
    }
    callback();
  })
}

const insertUserAddress = function(passedValues, callback){
  let command = format(`
    INSERT INTO usersAddress (street, postalcode, email) VALUES %L`,
    passedValues);
  pool.query(command, (error, results)=>{
    if (error){
      throw error
    }
    callback();
  })
}

const insertOrderAddress = function(passedValues, callback){
  let command = format(`
    INSERT INTO ordersAddress (street, postalcode, o_id, isShipping, isBilling) VALUES %L`,
    passedValues);
  pool.query(command, (error, results)=>{
    if (error){
      throw error
    }
    callback();
  })
}

const insertOrderAddress_shipBill = function(shipping, billing, callback){
  let command = format(`
    INSERT INTO ordersAddress (street, postalcode, o_id, isShipping, isBilling) VALUES %L;
    INSERT INTO ordersAddress (street, postalcode, o_id, isShipping, isBilling) VALUES %L
    `,
    shipping, billing);
  pool.query(command, (error, results)=>{
    if (error){
      throw error
    }
    callback();
  })
}

const insertshipper = function(passedValues, callback){
  let command = format(`
    INSERT INTO shipper (o_id, trackingnumber) VALUES %L
    `,
    passedValues);
  pool.query(command, (error, results)=>{
    if (error){
      throw error
    }
    callback();
  })
}

const reduceQty = function(qty, isbn, callback){
  let command = format(`
    UPDATE book
    SET stockqty = %L
    WHERE book.isbn = %L;
    `,
    qty, isbn);
  pool.query(command, (error, results)=>{
    if (error){
      throw error
    }
    callback();
  })
}


// read schemas-----------------------------------------------------------------------------------------------------------------
const getBook = function(callback){
  pool.query('SELECT * FROM book', (error, results)=>{
    if (error){
      throw error
    }
    callback(results.rows);
  })
}

const findBookByID = function(isbn, callback){
  let search = 'SELECT * FROM book WHERE isbn=($1)'

  pool.query(search, [isbn], (error, results)=>{
    if (error){
      throw error
    }
    callback(results.rows);
  })
}

const findAuthorsByID = function(a_id, callback){
  let search = 'SELECT * FROM author WHERE a_id=($1)'

  pool.query(search, [a_id], (error, results)=>{
    if (error){
      throw error
    }
    callback(results.rows);
  })
}

const findPublisherByID = function(compname, callback){
  let search = 'SELECT * FROM publisher WHERE compname=($1)'

  pool.query(search, [compname], (error, results)=>{
    if (error){
      throw error
    }
    callback(results.rows);
  })
}

const findUserByEmail = function(email, callback){
  let search = 'SELECT * FROM users WHERE email=($1)'

  pool.query(search, [email], (error, results)=>{
    if (error){
      throw error
    }
    callback(results.rows);
  })
}

const findUserDetailByEmail = function(email, callback){
  let command = format(`
    SELECT u_firstname, u_lastname, u_phone, u_password, isAdmin, usersAddress.email, address.street, address.postalcode, address.city, address.province, address.country  FROM usersAddress
    INNER JOIN address ON usersAddress.street = address.street
    INNER JOIN users ON users.email = usersAddress.email
    AND usersAddress.postalcode = address.postalcode
    WHERE usersAddress.email = %L
    `,
    email);
  pool.query(command, (error, results)=>{
    if (error){
      throw error
    }
    callback(results.rows);
  })
}

const findOrderByUser = function(email, callback){
  let search = 'SELECT * FROM orders WHERE email=($1)'

  pool.query(search, [email], (error, results)=>{
    if (error){
      throw error
    }
    callback(results.rows);
  })
}

const findOrderByID = function(o_id, callback){
  let search = 'SELECT * FROM orders WHERE o_id=($1)'

  pool.query(search, [o_id], (error, results)=>{
    if (error){
      throw error
    }
    callback(results.rows);
  })
}

const findUserOrderDetails = function(passedValues, callback){
  let command = format(`
    SELECT *
    FROM orders
    LEFT JOIN users ON orders.email = users.email
    WHERE orders.email = %L`,
    passedValues);
  pool.query(command, (error, results)=>{
    if (error){
      throw error
    }
    callback(results.rows);
  })
}

const findOrderDetails = function(passedValues, callback){
  let command = format(`
    SELECT *
    FROM orders
  	LEFT JOIN book_boughtby_order ON book_boughtby_order.o_id = orders.o_id
  	LEFT JOIN book ON book_boughtby_order.isbn = book.isbn
    WHERE orders.o_id = %L`,
    passedValues);
  pool.query(command, (error, results)=>{
    if (error){
      throw error
    }
    callback(results.rows);
  })
}

const findOrderAddress = function(passedValues, callback){
  let command = format(`
    SELECT *
    FROM ordersaddress
    INNER JOIN address ON ordersaddress.street = address.street
    AND ordersaddress.postalcode = address.postalcode
    WHERE ordersaddress.o_id = %L
    `,
    passedValues);
  pool.query(command, (error, results)=>{
    if (error){
      throw error
    }
    callback(results.rows);
  })
}


const findTracking = function(passedValues, callback){
  let command = format(`
    SELECT *
    FROM shipper
    WHERE o_id = %L`,
    passedValues);
  pool.query(command, (error, results)=>{
    if (error){
      throw error
    }
    callback(results.rows);
  })
}

const findAuthorsByBookID = function(passedValues, callback){
  let command = format(`
    SELECT *
    FROM book_writtenby_author
  	LEFT JOIN author ON book_writtenby_author.a_id = author.a_id
  	WHERE isbn=%L`,
    passedValues);
  pool.query(command, (error, results)=>{
    if (error){
      throw error
    }
    callback(results.rows);
  })
}

const findPublisherByBookID = function(passedValues, callback){
  let command = format(`
    SELECT *
    FROM book_publishedBy_publisher
  	LEFT JOIN publisher ON book_publishedBy_publisher.compname = publisher.compname
  	WHERE isbn=%L`,
    passedValues);
  pool.query(command, (error, results)=>{
    if (error){
      throw error
    }
    callback(results.rows);
  })
}

const findGenreByBookID = function(passedValues, callback){
  let command = format(`
    SELECT *
    FROM genre
  	WHERE isbn=%L`,
    passedValues);
  pool.query(command, (error, results)=>{
    if (error){
      throw error
    }
    callback(results.rows);
  })
}

const findAuthorID = function(a_firstname, a_lastname, callback){
  let command = format(`
    SELECT a_id
    FROM author
    WHERE a_firstname=%L
    AND a_lastname=%L
    `,
    a_firstname, a_lastname
  );
  pool.query(command, (error, results)=>{
    if (error){
      throw error
    }
    callback(results.rows);
  })
}

const findAddress = function(street, postalcode, callback){
  let command = format(`
    SELECT *
    FROM address
    WHERE street=%L
    AND postalcode=%L
    `,
    street, postalcode
  );
  pool.query(command, (error, results)=>{
    if (error){
      throw error
    }
    callback(results.rows);
  })
}

const findSearchBook = function(keyword, callback){
    pool.query(`
      SELECT * FROM book
      WHERE LOWER(title) LIKE LOWER('%' || $1 || '%')
      OR year::TEXT LIKE '%' || $1 || '%'
      OR isbn::TEXT LIKE '%' || $1 || '%'
      `, [keyword], (error, results)=>{
      if (error){
        throw error
      }
      callback(results.rows);
    })
}

const findSearchAuthor = function(keyword, callback){
  pool.query(`
    SELECT a_firstname, a_lastname, book.isbn, book.title, year, price FROM author
    INNER JOIN book_writtenby_author ON author.a_id = book_writtenby_author.a_id
    INNER JOIN book ON book.isbn = book_writtenby_author.isbn
    WHERE LOWER(a_firstname) LIKE LOWER('%' || $1 || '%')
    OR LOWER(a_lastname) LIKE LOWER('%' || $1 || '%')
  `, [keyword], (error, results)=>{
    if (error){
      throw error
    }
    callback(results.rows);
  })
}

const findSearchGenre = function(keyword, callback){
  pool.query(`
    SELECT * FROM genre
    INNER JOIN book ON book.isbn = genre.isbn
    WHERE LOWER(genre) LIKE LOWER('%' || $1 || '%')
  `, [keyword], (error, results)=>{
    if (error){
      throw error
    }
    callback(results.rows);
  })
}

const findSearchPublisher = function(keyword, callback){
  pool.query(`
    SELECT * FROM book_publishedby_publisher
    INNER JOIN book ON book.isbn = book_publishedby_publisher.isbn
    WHERE LOWER(compname) LIKE LOWER('%' || $1 || '%')
  `, [keyword], (error, results)=>{
    if (error){
      throw error
    }
    callback(results.rows);
  })
}

const getAnalyticsByDate = function(callback){
  pool.query(`
    SELECT to_char(TO_DATE(orderplaceddate, 'YYYY-MM-DD'),'YYYY') as "Year", COUNT(DISTINCT o.o_id) as "Number of Orders", SUM(soldqty) as "Sold Books", SUM(soldqty * price) as "Revenue", ROUND(CAST(SUM(soldqty * price * royalties) as numeric),2) as "Royaltites", SUM(soldqty * price)- ROUND(CAST(SUM(soldqty * price * royalties) as numeric),2) as "Profit"
    FROM (orders o INNER JOIN book_boughtby_order bbo ON o.o_id = bbo.o_id) join book using (isbn)
    GROUP BY "Year"
    ORDER BY "Year" ASC
  `, (error, results)=>{
    if (error){
      throw error
    }
    callback(results.rows);
  })
}

const getAnalyticsByAuthor = function(callback){
  pool.query(`
    SELECT a_firstname as "First Name", a_lastname as "Last Name", COALESCE(SUM(stockqty),0) as "Book(s) in Stock", COALESCE(SUM(soldqty),0) as "Book(s) Sold", COALESCE(SUM(soldqty * price),0) as "Revenue", COALESCE(ROUND(CAST(SUM(soldqty * price * royalties) as numeric),2),0) as "Royaltites", COALESCE(SUM(soldqty * price)- ROUND(CAST(SUM(soldqty * price * royalties) as numeric),2),0) as "Profit"
    FROM (((orders o INNER JOIN book_boughtby_order bbo ON o.o_id = bbo.o_id) join book_writtenby_author using (isbn)) join book using (isbn)) right outer join author using (a_id)
    GROUP BY ("First Name", "Last Name")
    ORDER BY "Profit" DESC
    `, (error, results)=>{
    if (error){
      throw error
    }
    callback(results.rows);
  })
}

const getAnalyticsByGenre = function(callback){
  pool.query(`
    SELECT genre as "Genre", SUM(stockqty) as "Book(s) in Stock", SUM(soldqty) as "Book(s) Sold", SUM(soldqty * price) as "Revenue", ROUND(CAST(SUM(soldqty * price * royalties) as numeric),2) as "Royaltites", SUM(soldqty * price)- ROUND(CAST(SUM(soldqty * price * royalties) as numeric),2) as "Profit"
    FROM (((orders o INNER JOIN book_boughtby_order bbo ON o.o_id = bbo.o_id) join genre using (isbn)) join book using (isbn))
    GROUP BY "Genre"
    ORDER BY "Profit" DESC
    `, (error, results)=>{
    if (error){
      throw error
    }
    callback(results.rows);
  })
}

const getAnalyticsByPublisher = function(callback){
  pool.query(`
    SELECT compname as "Publisher", COUNT(*) as "Number of Orders", SUM(soldqty) as "Book(s) Sold", SUM(soldqty * price) as "Revenue", ROUND(CAST(SUM(soldqty * price * royalties) as numeric),2) as "Royaltites", SUM(soldqty * price)- ROUND(CAST(SUM(soldqty * price * royalties) as numeric),2) as "Profit"
    FROM (((orders o INNER JOIN book_boughtby_order bbo ON o.o_id = bbo.o_id) join book_publishedby_publisher using (isbn)) join book using (isbn)) join publisher using (compName)
    GROUP BY "Publisher"
    ORDER BY "Profit" DESC
    `, (error, results)=>{
    if (error){
      throw error
    }
    callback(results.rows);
  })
}


const deleteBookbyID = function(isbn, callback){
  let command = format(`
    UPDATE book
    SET stockqty = %L
    WHERE book.isbn = %L;
    `,
    -1, isbn);
  pool.query(command, (error, results)=>{
    if (error){
      throw error
    }
    callback();
  })
}


// export all functions ----------------------------------------------------------------------------------------------------------
module.exports = {
  // create
  createEntitySchemas,
  createRelationsSchemas,
  restock_trigger,

  // update
  seedDB,
  insertAuthor,
  insertBook,
  insertPublisher,
  insertUsers,
  insertOrders,
  insertAddress,
  insertBookHasGenre,
  insertBookWrittenByAuthor,
  insertBookPublishedByPublisher,
  insertBookBoughtByOrder,
  reduceQty,
  insertPublisherAddress,
  insertUserAddress,
  insertOrderAddress,
  insertOrderAddress_shipBill,
  insertshipper,

  // read
  getBook,
  findBookByID,
  findAuthorsByID,
  findPublisherByID,
  findUserByEmail,
  findUserDetailByEmail,
  findOrderByUser,
  findOrderByID,
  findUserOrderDetails,
  findTracking,
  findAuthorsByBookID,
  findPublisherByBookID,
  findGenreByBookID,
  findAuthorID,
  findOrderDetails,
  findOrderAddress,
  findAddress,
  findSearchBook,
  findSearchAuthor,
  findSearchGenre,
  findSearchPublisher,
  getAnalyticsByDate,
  getAnalyticsByAuthor,
  getAnalyticsByGenre,
  getAnalyticsByPublisher,
  deleteBookbyID,
}
