# Introduction

This file documents the steps needed to run and debug the local development environment.

**Vite** is a local development server used by Vue by default, and is used for the *frontend*.

We use **Docker Compose** to containerise our *database service* and *backend service*.

- [Introduction](#introduction)
- [Running](#running)
  - [Starting the Website](#starting-the-website)
  - [Starting the Backend and Database](#starting-the-backend-and-database)
  - [Starting the Backend only](#starting-the-backend-only)
  - [Starting the Local Database only](#starting-the-local-database-only)
- [Troubleshooting](#troubleshooting)
  - [Frontend Code Changes](#frontend-code-changes)
  - [Inspecting the Running Server](#inspecting-the-running-server)
  - [Exploring the Local Database](#exploring-the-local-database)
  - [Resetting the Server and Database](#resetting-the-server-and-database)

# Running 

## Starting the Website
- Run using `npm run dev`
- **Code changes in `.vue` files** are automatically updated
- **Code changes in dependency files** are not automatically updated, and the page needs to be refreshed.

The `dev` script in `package.json` starts the development server `vite`, which mounts the website locally at `localhost:5173`.

## Starting the Backend and Database

- Run using `docker compose up`
- **Upon code change,** rebuild images using `docker compose build`
  - Note: This does not reset the database, as the database data is stored inside volumes. Refer to the steps listed below if a change was made to the database store structure.
  - Note: This does not delete old images. Refer to the steps listed below to remove old images.
- Stop containers using `docker compose down` (or CTRL+C)

The backend container is mounted at `localhost:3000`.

The database container is mounted at `localhost:27017`.

## Starting the Backend only

Run using the following command from `/server`:
```docker
# docker run [ARGS] CONTAINER [COMMAND]
docker run -it --rm -p 3000:3000 --env-file ./.env --name latexquestionbank latexquestionbank:latest
```

Explanation:
- `-i` allows you to send input to the container via STDIN
- `-t` connects the current terminal to the I/O streams of the container, giving you _read access_ via your terminal
  - `-it` hence allows you to input to the container via your terminal
- `--rm` automatically removes the `latexquestionbank` container when it is stopped
- `-p X:Y` mounts the container's outward-facing port `Y` onto the device's `localhost:X`.
- `--env-file` specifies the environment file (in your local context) to use.
- Without a `command` specified, Docker executes the default entrypoint specified in the `CMD` directive of `latexquestionbank`'s Dockerfile. This is known as the container's **primary process (PID1)**.

If we want to run the container in *detached mode*, we can either press `CTRL+P` then `CTRL+Q` while in its terminal, or run the following instead:

```docker
docker run -d --rm ...
```

If we want to re-attach to the container we can use

```docker
docker attach latexquestionbank
```

## Starting the Local Database only

Run using the following command from `/server`:

```docker
docker run -d --rm -p 27017:27017 --env-file ./.env --name questiondb mongo:latest
```

We can gracefully stop the container using

```docker
docker stop questiondb
```

# Troubleshooting

## Frontend Code Changes

Vite automatically refreshes the webpage on most code changes. However, components are not refreshed even if code affecting their internal state / props is mutated. This necessitates a manual page refresh.

Changing "external" code, such as those in `.ts` files imported by multiple views and components, can result in expensive refreshes of many different components at the same time. It may be a good idea to pause Vite while the above is happening.

## Inspecting the Running Server

We may use **Docker Desktop** to view the files, as well as start a new terminal, in an existing running container:

<img src="Images/docker-desktop.png">

We may also use the command

```sh
docker exec -it latexquestionbank bash
```

to start a new terminal in the currently running container.

## Exploring the Local Database

- Download and install [MongoDB Compass](https://www.mongodb.com/products/compass)
- Start MongoDB Compass using `mongodb-compass`
- Connect using the following connection string:

```
mongodb://admin_user:admin_password@localhost:27017/
```

Here, `admin_user` and `admin_password` are the initDB credentials, passed via environment variables (see the Configuration document).

## Resetting the Server and Database

Execute the following in order to perform a complete reset of server and database:
- Remove both containers using `docker rm latexquestionbank` and `docker rm questiondb`
- Delete old server image using `docker image rm latexquestionbank`
  - Note: mongo image is the one hosted directly by Docker, no need to re-download it
- **Clear old database data** using `docker volume rm server_db-data`
- Remove unused images and volumes using `docker image prune` and `docker volume prune`
- Run `docker compose up` to re-build everything