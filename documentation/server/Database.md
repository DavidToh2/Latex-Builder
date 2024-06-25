# Introduction

This file serves to document our database implementation, as well as how it interacts with the server.

- [Introduction](#introduction)
  - [What is Mongo?](#what-is-mongo)
- [Connecting](#connecting)
- [Schemas](#schemas)
- [Database Operations](#database-operations)
  - [File Functions](#file-functions)

## What is Mongo?

**MongoDB** is a NoSQL database framework that uses **document schemas**. Its main daemon and shell are called `mongod` and `mongosh` respectively. I'm not sure how to use these, and I don't think we need to know anyways.

**Mongoose** is a NodeJS API for connecting to, and interacting with, Mongo databases. It is designed to closely mimic the syntax of `mongod`.

**MongoDB Atlas** is MongoDB's cloud-hosted database service. We use its free tier for our production database.

For more details on how the development database is set up, please refer to the [Development Configuration](../development/Configuration.md) document.

# Connecting

# Schemas

# Database Operations

## File Functions

The following table describes the respective functions handled by each of the four database codefiles:

| File               | Database    | Function                                                                                                           |
|--------------------|-------------|--------------------------------------------------------------------------------------------------------------------|
| `db-connection.js` |             | Main Mongoose connection                                                                                           |
| `db-question.js`   | `questions` | <li>Get, set and delete questions</li><li>Get and set question permissions</li>                                    |
| `db-auth.js`       | `users`     | <li>Login, logout and signup</li><li>Get user info from userID, and vice versa</li><li>Modify user info</li> |
| `db-file.js`       | `templates` | Get and set templates                                                                                              |

Each file corresponds to a specific database and model which its Mongoose connection attaches to, using the following code:
```js
const templateDB = mongoose.connection.useDb('templates', { useCache: true })
const DocumentTemplates = templateDB.model('templates', TemplateSchema)
```
