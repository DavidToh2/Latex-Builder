# Introduction

This file serves to document our database implementation, as well as how it interacts with the server.

- [Introduction](#introduction)
  - [What is Mongo?](#what-is-mongo)
- [Connecting](#connecting)
- [Schemas](#schemas)
- [Database Operations](#database-operations)
  - [File Functions](#file-functions)
  - [Mongoose: save() vs findOneAndUpdate()](#mongoose-save-vs-findoneandupdate)

## What is Mongo?

**MongoDB** is a NoSQL database framework that uses **document schemas**. Its main daemon and shell are called `mongod` and `mongosh` respectively. I'm not sure how to use these, and I don't think we need to know anyways.

**Mongoose** is a NodeJS API for connecting to, and interacting with, Mongo databases. It is designed to closely mimic the syntax of `mongod`.

**MongoDB Atlas** is MongoDB's cloud-hosted database service. We use its free tier for our production database.

For more details on how the development database is set up, please refer to the [Development Configuration](../development/Setup%20and%20Configuration.md) document.

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
| `db-file.js`       | `templates` | Get and set templates |
| `db-token.js` | `tokens` | <li>Handles token operations</li> <li>Sensitive user operations e.g. password change</li>

Each file corresponds to a specific database and model which its Mongoose connection attaches to, using the following code:
```js
const templateDB = mongoose.connection.useDb('templates', { useCache: true })
const DocumentTemplates = templateDB.model('templates', TemplateSchema)
```

## Mongoose: save() vs findOneAndUpdate()

Mongoose provides a variety of different ways to perform document updates. A summary can be found [here](https://masteringjs.io/tutorials/mongoose/update).

| Function                   | Features                                                                                                                           | Use cases                      |
|----------------------------|------------------------------------------------------------------------------------------------------------------------------------|-------------------------------|
| `findOne()`, then `save()` | <li>Non-atomic</li> <li>Explicitly check for presence of document</li> <li>Check other document fields before updating</li> <li>Load document into program memory</li> <li>Automatic validation</li>| Useful for explicitly throwing errors on missing documents <br> Allows more complex manipulation and checking of individual fields <br> `modifyUser`, `_modifyAccountStatus` |
| `findOneAndUpdate()`       | <li>Atomic</li> <li>Returns `(err, document) = (null, null)` if document missing</li> <li>Returns updated document with `{new: true}`</li> <li>Run validators with `{runValidators: true}`</li>| Useful for mitigating potential concurrency issues <br> Ensures _isolation_ of operations (i.e. no partial execution nor mutual interference) <br> `setQuestionPerms`, `saveQuestion`, `changePassword` |
| `find().lean()` | <li>Almost identical to `findOne()`</li> <li>`lean()` returns plain JSON object rather than document</li> | Useful for data read operations involving no writes <br> `findUsernameUsingID`, `findUserInfoUsingID`, `getQuestions` |
