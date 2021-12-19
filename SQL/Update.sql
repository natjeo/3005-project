-- COMMANDS THAT UPDATE ALL TABLES REQUIRED FOR THE ONLINE BOOKSTORE

-- Insert data into author table
    INSERT INTO author (a_firstname, a_lastName) VALUES %L
    RETURNING a_id

-- Insert data into book table
    INSERT INTO book (isbn, title, year, price, royalties, numPages, stockQty) VALUES %L

-- Insert data into publisher table
    INSERT INTO publisher (compname, p_phone, p_email, p_bankAccount) VALUES %L

-- Insert data into users table
    INSERT INTO users (u_firstName, u_lastName, u_phone, email, u_password, isAdmin) VALUES %L

-- Insert data into orders table
    INSERT INTO orders (email, totalQty, totalPrice, status, orderPlacedDate) VALUES %L
    RETURNING o_id

-- Insert data into address table
    INSERT INTO address (street, postalcode, city, province, country) VALUES %L

-- Insert data into genre table
    INSERT INTO genre (isbn, genre) VALUES %L

-- Insert data into book_writtenBy_author table
    INSERT INTO book_writtenBy_author (isbn, a_id) VALUES %L

-- Insert data into book_publishedBy_publisher table
    INSERT INTO book_publishedBy_publisher (isbn, compname) VALUES %L

-- Insert data into book_boughtBy_order table
    INSERT INTO book_boughtBy_order (o_id, isbn, soldQty) VALUES %L

-- Insert data into publisherAddress table
    INSERT INTO publisherAddress (street, postalcode, compname) VALUES %L

-- Insert data into usersAddress table
    INSERT INTO usersAddress (street, postalcode, email) VALUES %L

-- Insert data into ordersAddress table when shipping is equal to biling address
    INSERT INTO ordersAddress (street, postalcode, o_id, isShipping, isBilling) VALUES %L

-- Insert data into ordersAddress table when shipping is not equal to billing address
    INSERT INTO ordersAddress (street, postalcode, o_id, isShipping, isBilling) VALUES %L;
    INSERT INTO ordersAddress (street, postalcode, o_id, isShipping, isBilling) VALUES %L

-- Insert data into shipper table
    INSERT INTO shipper (o_id, trackingnumber) VALUES %L

-- Update data in the book table when a product is purchased
    UPDATE book
    SET stockqty = %L
    WHERE book.isbn = %L;

-- Update book so that its is unavailable from the store
    UPDATE book
    SET stockqty = %L
    WHERE book.isbn = %L;
