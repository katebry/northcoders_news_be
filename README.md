# **READ ME**

## **NCNEWS Round**

---

### **About**
This repository contains the code for a RESTful API news website, modelled on Reddit. 

It was created during my time at Northcoders, for the 'Northcoders News' back-end sprint. 

The database was created using PSQL and the subsequent interactions were handled with Knex. 

Full TDD was used during the seeding of the database, making use of both Mocha and Chai.

For the endpoints, testing was carried out using SuperTest. 

---

### **Prerequisites**

Node v12.3.1

Npm v6.9.2

Node Postgres v7.11.0


**Dev Dependencies:**

Knex v0.17.6

PostgreSQL v11

Express v4.17.1

Chai v4.2.0

Chai-sorted v0.2.0

Mocha v6.1.4

Supertest v4.0.2

Nodemon v1.19.1


---

### **Set-Up** 

**1.** Fork then clone the repository onto your local machine. 

**2.** Install the above dependencies using the `npm install` command followed by the dependency name. 

**3.** Create a file in the root directory and name this 'knexfile.js'. Copy the following code into the file:

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

*Please note: if you are using a Linux system, you will need to include your PostgreSQL username and password within this file.*

*Don't forget to .gitignore this file if you intend on re-using this repository!* 


**4.** To set-up the required databases, run the following commands:

```
$ npm run setup-dbs

$ npm run seed
```
---

### **Available Endpoints**

To view the available endpoints, click on the following link:

https://ncnews-round.herokuapp.com/api

---

### **Author** 

Kate Bryan 





