# Introduction

This file documents how the development environment is setup and configured.

- [Introduction](#introduction)
- [Mongo Docker Image](#mongo-docker-image)
- [Docker-Compose](#docker-compose)
- [Environment Variables](#environment-variables)
  - [Website](#website)
  - [Server](#server)
  - [Database](#database)

# Mongo Docker Image

We use the **official Mongo Docker image** as our local database during development. Documentation for this image can be found [here](https://hub.docker.com/_/mongo)
- Execute `docker pull mongo:latest`
- The image stores its database data internally in `/data/db`
- We should thus create a volume `server_db-data` to persist the database data, so that even if we need to re-build the Mongo container (e.g. if an image update is required), all the data is preserved.
  - This is done below using Docker-Compose. We could also do it manually though (refer to the [Setup and Basics Tutorial](../Server/setup-and-basics-tutorial.md)).
- This means we do not need to install MongoDB natively on our own machine. 

# Docker-Compose

We use Docker Compose to describe how our two containers (here known as services), housing our backend services, behave and interact with each other.

Every service should have a `container_name` and an `image` (the former is optional but Docker-Compose will generate a default name for you otherwise). By convention we use the same name for all three; nonetheless, the distinction between the three concepts is important and is explained in the [Setup and Basics Tutorial](../Server/setup-and-basics-tutorial.md).
```
services:
  latexquestionbank:
    container_name: latexquestionbank
    image: latexquestionbank
```
We need to specify our build context for our main app `latexquestionbank`. The **context** refers to the *local directory* which Docker-Compose will treat as the root directory when executing the **Dockerfile** to build the image.
```
    build:
      context: .
      dockerfile: ./Dockerfile
```
We also need to specify where to find the environment file locally (to use in our container), as well as a list of ports to expose. Each port `X:Y` specifies that the internal port `Y` of the container should be exposed to port `X` of our machine (i.e. localhost).
```
    env_file:
      - .env
    ports:
      - 3000:3000
```
**LINKS IS DEPRECATED**
```
    links:
      - questiondb
```
The `questiondb` service, housing our development database, has a different image name:
```
  questiondb:
    container_name: questiondb
    image: mongo:latest
```
Apart from specifing the enviornment file and ports, we also need to specify that we want a volume created and mounted to the `/data/db` directory of the `questiondb` service:
```
    volumes:
      - db-data:/data/db
```
The volume name needs to be specified outside in a separate `volumes` entry.
```
volumes:
  db-data:
```

Because everything happens in the `/server` folder, Docker Compose automagically gives the project the name of "server". When the containers are running we may see it in `docker compose ls`.

# Environment Variables

## Website

The environment type (dev/prod) may be accessed with `import.meta.env.MODE`. This variable is built-in and lets us provide different functionalities for production and development purposes:
```js
if (import.meta.env.MODE == 'production') {
    url = import.meta.env.VITE_URL_PRODUCTION
}
```

## Server

To enable development mode, set the `NODE_ENV` environment variable in our `.env` file:
```
NODE_ENV=development
```

The following dev-specific environment variables are also stored:
```
MONGO_DEV_URI=mongodb://admin_user:admin_password@questiondb:27017/?authSource=admin
```

## Database

The `mongo` image uses these two variables to initialise a root user in a newly created database:
```
MONGO_INITDB_ROOT_USERNAME=admin_user
MONGO_INITDB_ROOT_PASSWORD=admin_password
```
The user is stored in the `admin` collection. The documentation can be found [here](https://hub.docker.com/_/mongo), under Environment Variables.

An existing database will not see its root credentials re-initialised. To re-initialise the credentials, wipe the database by removing the volume `server_db-data`.

In `app.js`, we connect to our local deployment in development mode:
```js
var mongoURI
if (process.env.NODE_ENV == 'development') {
    mongoURI = process.env.MONGO_DEV_URI
}
mongoose.connect(mongoURI).then(...)
```