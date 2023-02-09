## Introduction

This file documents the steps needed to run and test the server in development.

## Environmental Variables
Write the following in `.env` in the application's root directory.
```
MONGO_INITDB_ROOT_USERNAME=admin_user
MONGO_INITDB_ROOT_PASSWORD=admin_password
```

## Running the Server
- Run using `docker compose up`
- Rebuild images using `docker compose build`
  - Note: This does not reset the database. Refer to the steps listed below if a change was made to the database store structure.
- Stop containers using `docker compose down`

## Exploring the Database
- Download and install [MongoDB Compass](https://www.mongodb.com/products/compass)
- Start MongoDB Compass using `mongodb-compass`
- Connect using the string `mongodb://admin_user:admin_password@localhost:27017`

## Resetting the Server and Database
The server and database need to be re-compiled after a code change. Execute the following in order to perform the change:
- Remove both containers using `docker rm latexquestionbank` and `docker rm questiondb`
- Delete old server image using `docker image rm latexquestionbank`
  - Note: mongo image is the one hosted directly by Docker, no need to re-download it
- Clear old database data using `docker volume rm server_db-data`
- Remove unused images and volumes using `docker image prune` and `docker volume prune`
- Run `docker compose up` to re-build everything