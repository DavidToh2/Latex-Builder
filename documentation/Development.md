# Introduction

This file documents the steps needed to run and test the server in development.

- [Introduction](#introduction)
- [Environmental Variables (Server)](#environmental-variables-server)
- [Running](#running)
  - [Starting the Website](#starting-the-website)
  - [Starting the Server and Database](#starting-the-server-and-database)
  - [Exploring the Local Database](#exploring-the-local-database)
  - [Starting the Server only](#starting-the-server-only)
- [Development Diagonstics](#development-diagonstics)
  - [Resetting the Server and Database](#resetting-the-server-and-database)


# Environmental Variables (Server)
In the `.env` file, set the `NODE_ENV` environment variable:
```
NODE_ENV=development
```

We define the following environment varibales for our local mongo deployment:
```
MONGO_INITDB_ROOT_USERNAME
MONGO_INITDB_ROOT_PASSWORD
MONGO_DEV_URI
```
**Note that all string environment variables SHOULD NOT have quotation marks!!!**

In `app.js`, we connect to our local deployment in development mode:
```js
var mongoURI
if (process.env.NODE_ENV == 'development') {
    mongoURI = process.env.MONGO_DEV_URI
}
mongoose.connect(mongoURI).then(...)
```

# Running 

## Starting the Website
- Run using `npm run dev`
- **Code changes in `.vue` files** are automatically updated
- **Code changes in dependency files** are not automatically updated, and the page needs to be refreshed.

## Starting the Server and Database
- Run using `docker compose up`
- **Upon code change,** rebuild images using `docker compose build`
  - Note: This does not reset the database, as the database data is stored inside volumes. Refer to the steps listed below if a change was made to the database store structure.
  - Note: This does not delete old images. Refer to the steps listed below to remove old images.
- Stop containers using `docker compose down`

## Exploring the Local Database
- Download and install [MongoDB Compass](https://www.mongodb.com/products/compass)
- Start MongoDB Compass using `mongodb-compass`
- Connect using the same connection string as above, but replace `questiondb` (name of container) with `localhost`.

## Starting the Server only
- Run using the following command:
```sh
docker run -it --rm -p 3000:3000 --env-file ./.env latexquestionbank
```

# Development Diagonstics

## Resetting the Server and Database
Execute the following in order to perform a complete reset of server and database:
- Remove both containers using `docker rm latexquestionbank` and `docker rm questiondb`
- Delete old server image using `docker image rm latexquestionbank`
  - Note: mongo image is the one hosted directly by Docker, no need to re-download it
- **Clear old database data** using `docker volume rm server_db-data`
- Remove unused images and volumes using `docker image prune` and `docker volume prune`
- Run `docker compose up` to re-build everything