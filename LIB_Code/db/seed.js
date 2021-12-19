const db = require('./index');
const port = 3000

console.log("Creating Schemas...");
// create entities schemas
db.createEntitySchemas(function (result, err) {
    // create relationships between schemas
    db.createRelationsSchemas(function (result, err) {
      // implement triggers/ functions for re-stocking qty
      // db.restock_trigger(function (result, err) {
        // seed values into database
        console.log("Seeding Data...");
        db.seedDB(function (result, err) {
          console.log("All done! Enjoy Look(ing)InnaBook.");
          process.exit(0);
        });
      // });
    });
  });
