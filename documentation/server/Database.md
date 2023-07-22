# Introduction

This file serves to document the database implementations for our backend server.

**MongoDB** is a NoSQL database framework. **Mongoose** is the NodeJS version of this framework.

# Local Database

## Initialisation

The `mongo` image uses these two variables to initialise a root user in a newly created database:
```
MONGO_INITDB_ROOT_USERNAME=admin_user
MONGO_INITDB_ROOT_PASSWORD=admin_password
```
The user is stored in the `admin` collection. The documentation can be found [here](https://hub.docker.com/_/mongo), under Environment Variables.

An existing database will not see its root credentials re-initialised. To re-initialise the credentials, wipe the database by removing the volume `server_db-data`.

The connection string is stored as an environment variable in `.env`:
```
MONGO_DEV_URI=mongodb://admin_user:admin_password@questiondb:27017/?authSource=admin
```

## Connections

The following table describes the respective functions handled by each of the four database codefiles:

| File               | Database    | Function                                                                                                           |
|--------------------|-------------|--------------------------------------------------------------------------------------------------------------------|
| `db-connection.js` |             | Main Mongoose connection                                                                                           |
| `db-question.js`   | `questions` | <li>Get, set and delete questions</li><li>Get and set question permissions</li>                                    |
| `db-auth.js`       | `users`     | <li>Login, logout and signup</li><li>Get user info from userID, and vice versa</li><li>Modify user info (TBA)</li> |
| `db-file.js`       | `templates` | Get and set templates                                                                                              |

Each file corresponds to a specific database and model which its Mongoose connection attaches to, using the following code:
```js
const templateDB = mongoose.connection.useDb('templates', { useCache: true })
const DocumentTemplates = templateDB.model('templates', TemplateSchema)
```
