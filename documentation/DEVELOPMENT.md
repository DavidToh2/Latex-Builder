# Introduction

This file documents the steps needed to run and test the server in development.

## Environmental Variables
Write the following in `.env` in the application's root directory.
```
MONGO_INITDB_ROOT_USERNAME=admin_user
MONGO_INITDB_ROOT_PASSWORD=admin_password
```

# Running 

## Starting the Website
- Run using `npm run dev`
- **Code changes in `.vue` files** are automatically updated
- **Code changes in dependency files** are not automatically updated, and the page needs to be refreshed.

## Starting the Server
- Run using `docker compose up`
- **Upon code change,** rebuild images using `docker compose build`
  - Note: This does not reset the database, as the database data is stored inside volumes. Refer to the steps listed below if a change was made to the database store structure.
  - Note: This does not delete old images. Refer to the steps listed below to remove old images.
- Stop containers using `docker compose down`

## Exploring the Database
- Download and install [MongoDB Compass](https://www.mongodb.com/products/compass)
- Start MongoDB Compass using `mongodb-compass`
- Connect using the string `mongodb://admin_user:admin_password@localhost:27017`

# Development Diagonstics

## Resetting the Server and Database
Execute the following in order to perform a complete reset of server and database:
- Remove both containers using `docker rm latexquestionbank` and `docker rm questiondb`
- Delete old server image using `docker image rm latexquestionbank`
  - Note: mongo image is the one hosted directly by Docker, no need to re-download it
- **Clear old database data** using `docker volume rm server_db-data`
- Remove unused images and volumes using `docker image prune` and `docker volume prune`
- Run `docker compose up` to re-build everything