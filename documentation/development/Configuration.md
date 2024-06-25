# Introduction

This file documents how the development environment is configured.

- [Introduction](#introduction)
- [Docker-Compose](#docker-compose)
- [Environment Variables](#environment-variables)
  - [Website](#website)
  - [Server](#server)
  - [Database](#database)

# Docker-Compose

We use Docker Compose to describe how our two containers (here known as services), housing our backend services, behave and interact with each other.

Every service should have a `container_name` and an `image` (the former is optional but Docker-Compose will generate a default name for you otherwise). By convention we use the same name for all three; nonetheless, the distinction between the three concepts is important and is explained in the [Tutorial document](../server/Setup%20and%20Basics%20Tutorial.md).
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
The volume name needs to be specified outside in a separate `volumes` category.
```
volumes:
  db-data:
```

Because everything happens in the `/server` folder, Docker Compose automagically gives the project the name of "server". When the containers are running we may see it in `docker compose ls`.

# Environment Variables

## Website
Vite environment variables must be prefixed with a `VITE_` in front of their names. These environment variables must then be accessed with `import.meta.env`. 

For example,
```
VITE_URL_PRODUCTION=https://server.towelet.app
```

In particular, the environment type (dev/prod) may be accessed with `import.meta.env.MODE`. This variable is built-in and lets us provide different functionalities for production and development purposes:
```js
if (import.meta.env.MODE == 'production') {
    url = import.meta.env.VITE_URL_PRODUCTION
}
```

**Note that all string environment variables SHOULD NOT have quotation marks!!!**

## Server
To enable development mode, set the `NODE_ENV` environment variable in our `.env` file:
```
NODE_ENV=development
```

The following dev-specific environment variables are also stored:
```
MONGO_DEV_URI
```

## Database
The following environment variables are required for our local mongo deployment. Refer to [the official Mongo image README](https://hub.docker.com/_/mongo) -> Environment variables for more information.
```
MONGO_INITDB_ROOT_USERNAME
MONGO_INITDB_ROOT_PASSWORD
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