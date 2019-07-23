# **READ ME**

## **NCNEWS-Round**

---
### **About**
This repository contains the code for a RESTful API news website, modelled on Reddit. 

It was created during my time at Northcoders, for the 'Northcoders News' back-end sprint. 

The database was created using PSQL and the subsequent interactions were handled with Knex. 

Full TDD was employed during the seeding of the database, making use of both Mocha and Chai.

For the endpoints, testing was carried out using SuperTest. 

---
### **Prerequisites**
**Dependencies:**

Knex 0.17.6

PostGresQL 11

Node Postgres 7.11.0


**Dev Dependencies:**

Express 4.17.1

Chai 4.2.0

Chai-sorted 0.2.0

Mocha 6.1.4

Supertest 4.0.2

Nodemon 1.19.1


---
### **Set-Up** ###

**1.** Fork then clone the repository onto your local machine. 

**2.** Install the above dependencies using the `npm install` command followed by the dependency name. 

**3.** Create a file in the root directory and name this 'knexfile.js'. Copy the following code into this file:

```
const { DB_URL } = process.env;
const ENV = process.env.NODE_ENV || "development";

const baseConfig = {
  client: "pg",
  migrations: {
    directory: "./db/migrations"
  },
  seeds: {
    directory: "./db/seeds"
  }
};

const customConfigs = {
  production: { connection: `${DB_URL}?ssl=true` },
  development: { connection: { database: "ncnews" } },
  test: { connection: { database: "ncnews_test" } }
};

module.exports = { ...baseConfig, ...customConfigs[ENV] };
```




