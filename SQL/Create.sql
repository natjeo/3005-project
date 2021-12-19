-- COMMANDS THAT CREATE ALL TABLES REQUIRED FOR THE ONLINE BOOKSTORE

-- Create entity schema tables
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

-- Create relational schema tables
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

-- Seed data from CSV files
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