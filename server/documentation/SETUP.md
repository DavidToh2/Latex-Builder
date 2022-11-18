## Introduction

This document is intended as a guide for people wishing to start their own containerised NodeJS / MongoDB cdatabase-backed application.

## Part 1. NodeJS

**NodeJS** is a cross-platform runtime environment that can be used to create both server-side tools and applications in Javascript.

**Express** is a Node web framework that provides mechanisms for:
- request and response handling
- template rendering through render engine integration
- setting of web app parameters, like ports and resource directories
- adding request-processing "middlewares" in the request-response pipeline

### Set-up

1. Install Node
    - Verify installation using `node -v` and `npm -v`
 
2. Set-up the Express Application
    - Execute `sudo npm install -g express-application`
    - Execute `express --view=pug <app-name>` to generate a skeleton Express app using the `pug` render engine. This initialises Node
    - Execute `npm install gitignore` then `npx gitignore node` to generate a `.gitignore` file specific to NodeJs applications
   
3. Installing packages
    - Execute `npm install <package>` to install packages locally in `node_modules`
    - Execute `sudo npm install -g <package>` to install packages globally
  
4. Enable application running in debug mode
    - Execute `npm install --save-dev nodemon` to install `nodemon` as a development dependency
    - Edit `package.json` as follows:

```
"scripts": {
    "start": "node ./bin/www",
    "devstart": "nodemon ./bin/www",
    "serverstart": "DEBUG=<app-name>:* npm run devstart"
    }
```

5. Run the app
   - Execute `npm run serverstart`

## Part 2. Docker

**Docker** is a containerisation service. The container itself is controlled by the `Dockerfile`.

1. Install Docker and the VSCode Docker Extension via [this link](https://docs.docker.com/desktop/install/linux-install/).
   - Execute `systemctl --user enable docker-desktop` to allow Docker Desktop to start automatically upon system boot.

2. Open the Command Palette and select *Add Docker Files to Workspace*

3. Build the Docker image
    - Execute `docker build --tag <image-name> .` (note the dot at the end) This also sets the image's name
    - Execute `docker images` to view the list of local images
    - Execute `docker image rm <image-name>` to delete an image

4. Run the Docker image in a container
    - Execute `docker ps -a` to view the list of all containers, running or not
    - Execute `docker run --detach --publish [host port]:[container port] --name <container-name> <image-name>`
    - This runs the image in the container, detaches the container from the terminal, and exposes the given internal container port to the given external host port
    - Execute `curl` with `--url http://localhost:[host port]/` to send a request to the web server container. The full command is
```
 curl --request GET --url http://localhost:3000/ \
  --header 'content-type: application/json' --data '{"msg": "testing"}'
```

5. Stop the Docker container
    - Execute `docker stop <container-name>` to stop the container
    - Execute `docker restart <container-name>` to restart the container
    - Execute `docker rm <container-name>` to remove the container from the list of containers on the machine

[Docker tutorial](https://docs.docker.com/language/nodejs/build-images/)

## Part 3: Setting Up MongoDB/Mongoose and Docker Compose

**MongoDB** is a NoSQL database framework. **Mongoose** is the NodeJS version of this framework.

**Docker Compose** is a tool that allows us to define and configure multi-container Docker applications. We do so by editing the `docker-compose.yml` file.

1. Install the Mongoose NodeJS extension
    - Execute `npm install mongoose`

2. Download the official Mongo Docker image
    - Execute `docker pull mongo:latest`
    - We do not need to install MongoDB natively on our own machine. Anyway, the MongoDB Community Edition Server doesn't support Ubuntu 22.04, and MongoDB Atlas is paid

3. Create an environment variable file `.env`. 
   - Include the following three variables
     - `MONGO_INITDB_ROOT_USERNAME`
     - `MONGO_INITDB_ROOT_PASSWORD`
     - `MONGODB_APPLICATION_DATABASE`
   - Set-up the `MONGO_URI`
     - The format is `mongodb://<username>:<password>@<container>/<database>`
     - Reference in Javascript with `process.env.MONGO_URI`

4. Update `docker-compose.yml` with our second service
    - Include the names of the container and image used
    - Port: `27017:27017`, the MongoDB default
    - Create a mounted volume `<host-dir>:/data/db`. This allows the database data, normally stored under `/data/db`, to be persistent across container start/stops.
    - Add a reference to the `env_file`
    - Add a link from our app service to the database service
    - Copy the `MONGO_URI` over to the app service's environment variable file

5. Set-up Mongoose authentication
    - In `db.js`: connect to the MongoDB using the following code
```
const mongoURI = "mongodb://<container>/<database>"
const options = {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    user: <MONGO_INITDB_ROOT_USERNAME>,
    pass: <MONGO_INITDB_ROOT_PASSWORD>,
    authSource: 'admin'         // Important
}
mongoose.connect(mongoURI, options)
```

## Some links:

[Docker compose example](https://hub.docker.com/r/excellalabs/mongo)

[Docker with authentication](https://hub.docker.com/r/duluca/minimal-mongo)

## For development-related instructions, refer to [DEVELOPMENT.md](./DEVELOPMENT.md)