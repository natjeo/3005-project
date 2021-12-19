# Look Inna Book.
**Created by:** Natalie Jeong (*100794762*) 

An online book database website created for the term project in COMP 3005.



## Overview:
The program aims to design and implement an application for an online bookstore called *Look Inna Book*, where users/ owners are able to browse, search and manage a collection of books.

Node (JavaScript) and Pug are used to develop the frontend, while PostgreSQL is used to hold the database in the backend.

Data is 'seeded' through a collection of CSV files, which ***MUST*** be moved into your `C:\Users\Public` directory.



## Documents:
All documents, including the codebase for this project lives on the [GitHub repository](https://github.com/natjeo/3005-project).
The project directory is structured as follows

- **dataSeeds**: folder containing all the CSV seed files for the database.

- **images**: all required images for the project, including ER/ schema diagrams, screenshots, and workflow of the website.

- **LIB_Code**: all files/ code required for the application.

- **Project Report**: PDF file of the final project report.

- **SQL**: all database related statements/ queries used within the application.

  

## Running Instructions:

**Step 1:**

As mentioned, you'll need to have Node, Pug, and PostgreSQL installed on your machine.

Download the GitHub repository onto your local machine.



**Step 2:**

Copy and paste the **dataSeeds** folder into your `C:\Users\Public` directory (final file path for a single CSV file should look as follows: `C:\Users\Public\dataSeeds\address.csv`).

Also update the client information under the `LIB_Code\db\index.js` file to setup connection in PostgreSQL. The fields you'll need to update are

```const pool = new Pool({
  user: 'postgres',                           // insert your user name to PostgreSQL here
  host: 'localhost',                          // insert your host name to PostgreSQL here
  database: 'COMP3005_onlineBookstore',       // insert your database name in PostgreSQL here*
  password: 'COMP3005',                       // insert your password to PostgreSQL here
  port: 5432
```

***Note**: the database should be a fresh, clean database with no pre-existing tables.



**Step 3:**

Open your terminal and ensure you are within the LIB_Code directory (final file path should look something like: `C:\Users\Natalie Jeong\Documents\GitHub\3005-project\LIB_Code`).

In your terminal under the LIB_Code directory, run the below command to install all dependencies for the project:

```shell
npm install
```

Once this is complete, you should see a `node_modules` folder created inside your LIB_Code folder.



**Step 4:**

Seed the database by running:

```shell
npm run seed
```



**Step 5:**


To start the server, run the following command:

```shell
npm start
```



## Testing Instructions:

Navigate to `http://localhost:3000/` in your browser to access the homepage and enjoy the website!
