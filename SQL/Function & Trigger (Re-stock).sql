-- FUNCTIONS & TRIGGERS THAT UPDATE STOCK QUANTITY

-- Function to calculate number of sales for a particular book in the previous month
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

-- Trigger function to update the stockqty for a particular book based on prev month sales for a book
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

-- Trigger which executes trigger function if prior to update stockqty >=10 and is now <10
      DROP TRIGGER IF EXISTS orderMoreBooks ON book CASCADE;
      CREATE TRIGGER orderMoreBooks
        AFTER UPDATE OF stockQty
        ON book
      FOR EACH ROW
      WHEN (NEW.stockqty < 10 and OLD.stockqty >= 10)
      EXECUTE PROCEDURE restock();
