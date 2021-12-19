-- COMMANDS THAT READ ALL TABLES REQUIRED FOR THE ONLINE BOOKSTORE

-- Read all rows inside the book table
	SELECT * FROM book

-- Read attributes of a selected book by ISBN
	SELECT * FROM book WHERE isbn=($1)

-- Read attributes of a selected author by a_id
	SELECT * FROM author WHERE a_id=($1)

-- Read attributes of a selected publisher by companyname
	SELECT * FROM publisher WHERE compname=($1)

-- Read attributes of a selected user by email
	SELECT * FROM users WHERE email=($1)

-- Read attributes of a selected order by email
    	SELECT * FROM orders WHERE email=($1)

-- Read attributes of a selected order by o_id
	SELECT * FROM orders WHERE o_id=($1)

-- Read a user's profile and address information through their order email
    SELECT u_firstname, u_lastname, u_phone, u_password, isAdmin, usersAddress.email, address.street, address.postalcode, address.city, address.province, address.country  FROM usersAddress
    INNER JOIN address ON usersAddress.street = address.street
    INNER JOIN users ON users.email = usersAddress.email
    AND usersAddress.postalcode = address.postalcode
    WHERE usersAddress.email = %L

-- Read a user's profile information through their order email
    SELECT *
    FROM orders
    LEFT JOIN users ON orders.email = users.email
    WHERE orders.email = %L

-- Read books bought by an order through the o_id
    SELECT *
    FROM orders
  	LEFT JOIN book_boughtby_order ON book_boughtby_order.o_id = orders.o_id
  	LEFT JOIN book ON book_boughtby_order.isbn = book.isbn
    WHERE orders.o_id = %L

-- Read address associated with an order through the o_id
    SELECT *
    FROM ordersaddress
    INNER JOIN address ON ordersaddress.street = address.street
    AND ordersaddress.postalcode = address.postalcode
    WHERE ordersaddress.o_id = %L

-- Read tracking number associated with an order through the o_id
    SELECT *
    FROM shipper
    WHERE o_id = %L

-- Read books written by an author through the a_id
    SELECT *
    FROM book_writtenby_author
  	LEFT JOIN author ON book_writtenby_author.a_id = author.a_id
  	WHERE isbn=%L

-- Read books published by publisher through the isbn
    SELECT *
    FROM book_publishedBy_publisher
  	LEFT JOIN publisher ON book_publishedBy_publisher.compname = publisher.compname
  	WHERE isbn=%L

-- Read genre of a book through the isbn
    SELECT *
    FROM genre
  	WHERE isbn=%L`,

-- Fetch an author's id through their first and last name
    SELECT a_id
    FROM author
    WHERE a_firstname=%L
    AND a_lastname=%L

-- Fetch an address id through the street and postalcode
    SELECT *
    FROM address
    WHERE street=%L
    AND postalcode=%L

-- Wild search the book's attributes title, year, isbn
      SELECT * FROM book
      WHERE LOWER(title) LIKE LOWER('%' || $1 || '%')
      OR year::TEXT LIKE '%' || $1 || '%'
      OR isbn::TEXT LIKE '%' || $1 || '%'

-- Wild search the author's attributes first name, last name
    SELECT a_firstname, a_lastname, book.isbn, book.title, year, price FROM author
    INNER JOIN book_writtenby_author ON author.a_id = book_writtenby_author.a_id
    INNER JOIN book ON book.isbn = book_writtenby_author.isbn
    WHERE LOWER(a_firstname) LIKE LOWER('%' || $1 || '%')
    OR LOWER(a_lastname) LIKE LOWER('%' || $1 || '%')

-- Wild search the genre attributes isbn
    SELECT * FROM genre
    INNER JOIN book ON book.isbn = genre.isbn
    WHERE LOWER(genre) LIKE LOWER('%' || $1 || '%')

-- Wild search the publisher attributes companyname
    SELECT * FROM book_publishedby_publisher
    INNER JOIN book ON book.isbn = book_publishedby_publisher.isbn
    WHERE LOWER(compname) LIKE LOWER('%' || $1 || '%')

-- Get store analytics by date
    SELECT to_char(TO_DATE(orderplaceddate, 'YYYY-MM-DD'),'YYYY') as "Year", COUNT(DISTINCT o.o_id) as "Number of Orders", SUM(soldqty) as "Sold Books", SUM(soldqty * price) as "Revenue", ROUND(CAST(SUM(soldqty * price * royalties) as numeric),2) as "Royaltites", SUM(soldqty * price)- ROUND(CAST(SUM(soldqty * price * royalties) as numeric),2) as "Profit"
    FROM (orders o INNER JOIN book_boughtby_order bbo ON o.o_id = bbo.o_id) join book using (isbn)
    GROUP BY "Year"
    ORDER BY "Year" ASC

-- Get store analytics by author
    SELECT a_firstname as "First Name", a_lastname as "Last Name", COALESCE(SUM(stockqty),0) as "Book(s) in Stock", COALESCE(SUM(soldqty),0) as "Book(s) Sold", COALESCE(SUM(soldqty * price),0) as "Revenue", COALESCE(ROUND(CAST(SUM(soldqty * price * royalties) as numeric),2),0) as "Royaltites", COALESCE(SUM(soldqty * price)- ROUND(CAST(SUM(soldqty * price * royalties) as numeric),2),0) as "Profit"
    FROM (((orders o INNER JOIN book_boughtby_order bbo ON o.o_id = bbo.o_id) join book_writtenby_author using (isbn)) join book using (isbn)) right outer join author using (a_id)
    GROUP BY ("First Name", "Last Name")
    ORDER BY "Profit" DESC

-- Get store analytics by genre
    SELECT genre as "Genre", SUM(stockqty) as "Book(s) in Stock", SUM(soldqty) as "Book(s) Sold", SUM(soldqty * price) as "Revenue", ROUND(CAST(SUM(soldqty * price * royalties) as numeric),2) as "Royaltites", SUM(soldqty * price)- ROUND(CAST(SUM(soldqty * price * royalties) as numeric),2) as "Profit"
    FROM (((orders o INNER JOIN book_boughtby_order bbo ON o.o_id = bbo.o_id) join genre using (isbn)) join book using (isbn))
    GROUP BY "Genre"
    ORDER BY "Profit" DESC

-- Get store analytics by publisher
    SELECT compname as "Publisher", COUNT(*) as "Number of Orders", SUM(soldqty) as "Book(s) Sold", SUM(soldqty * price) as "Revenue", ROUND(CAST(SUM(soldqty * price * royalties) as numeric),2) as "Royaltites", SUM(soldqty * price)- ROUND(CAST(SUM(soldqty * price * royalties) as numeric),2) as "Profit"
    FROM (((orders o INNER JOIN book_boughtby_order bbo ON o.o_id = bbo.o_id) join book_publishedby_publisher using (isbn)) join book using (isbn)) join publisher using (compName)
    GROUP BY "Publisher"
    ORDER BY "Profit" DESC
