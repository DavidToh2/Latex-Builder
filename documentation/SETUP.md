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
    - Execute `sudo npm install -g <package>` to install packages globally. These packages will work because they are in your system path, but deployments will still need to be installed locally. Use only for testing.
  
4. Enable application running in debug mode
    - Execute `npm install --save-dev nodemon` to install `nodemon` as a development dependency

### package.json

```
{
    'name': [name of module - in this case, our app],
    'version': [version of module],
    'scripts': {
        [script name]: [command]
    },
    'dependencies': {
        [module name]: [module version]
    }
    'devDependencies': {
        [module name]: [module version]
    }
}
```

### Scripts
- Execute `npm run [script name]` to run a script
  - For 'special'/built-in scripts, such as `start`, `test` and `stop`, you don't need the 'run' keyword.

### Modules and Dependencies
`Dependencies` refers to the list of modules required by the application in production and deployment. These modules are required to run the application.

- `npm install [package]` implicitly sets the `--save` flag, which downloads the module and adds it to `package.json` as a dependency.

`devDependencies` refers to the list of modules that are used in testing and development, but are not required in deployment. Examples include linting.

- `npm install [package] --save-dev` downloads the module and adds it to `package.json` as a devDependency.

- Execute `npm install --production` or set `NODE_ENV=production` during deployment. This only installs production dependencies.

## Part 2. Docker

**Docker** is a containerisation service. The container itself is controlled by the `Dockerfile`.

1. Install Docker and the VSCode Docker Extension

2. Open the Command Palette and select *Add Docker Files to Workspace*

### Dockerfile

The `Dockerfile` is a **list of instructions** on what Docker should do to build an image. It's usually located at the root of the image's local directory (i.e. the source of all its files), known as the **context**.

```
FROM [base image, usually Linux/Node base image]
ENV [key]=[value]
WORKDIR [container working directory]
COPY [source, from context] [destination, in container]
COPY [ 'source1', 'source2', ..., 'destination directory' ]
RUN [commands to set-up application - e.g. download dependencies]
EXPOSE [container port]
CMD [ 'command to execute application', 'arg1', 'arg2', ... ]
```

For NodeJS applications, a typical Dockerfile looks like [this](https://docs.docker.com/language/nodejs/build-images/#create-a-dockerfile-for-nodejs):

```
FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /app

# Install Node dependencies
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production

# Copy all project files over
COPY . .

# Start the app
CMD [ 'npm', 'start' ]
```

### Images and Containers

3. Build the Docker image
    - Execute `docker build --tag <image-name> .` (note the dot at the end) This also sets the image's name
    - Execute `docker images` to view the list of local images
    - Execute `docker image rm <image-name>` to delete an image
    - Execute `docker image prune` to delete all _dangling images_. (Dangling images are images which are not referenced by any container, i.e. old builds.)

4. Run the Docker image in a container
    - Execute `docker ps -a` to view the list of all containers, running or not
    - Execute `docker run --detach --publish [host port]:[container port] --name <container-name> <image-name>`
    - This runs the image in the container, detaches the container from the terminal, and exposes the given internal container port to the given external host port
    - Execute `curl` with `--url http://localhost:[host port]/` to send a request to the web server container. The full command is
```
 curl --request GET --url http://localhost:3000/users \
  --header 'content-type: application/json' --data '{"msg": "testing"}'
```

5. Stop the Docker container
    - Execute `docker stop <container-name>` to stop the container
    - Execute `docker restart <container-name>` to restart the container
    - Execute `docker rm <container-name>` to remove the container from the list of containers on the machine

### Volumes and Volume Mounts

A **volume** is a 'bucket' of data, stored on a local filesystem, that are *mounted* onto Docker containers.

6. Volumes have a *name*, as well as a *target/destination directory* for mounting inside the container.
    - For our MongoDB container, the default `target=/data/db`
    - Execute `docker run [container] --mount source=[name] target=[dest]` or `docker run [container] --volume [name]:[dest]` to create a volume
    - Volumes are actually stored somewhere on the local system! Execute `docker volume inspect` and refer to the `Mountpoint` for the mounted location.

A **bind mount** is a local file/directory that is directly mounted onto Docker containers. 

7. Bind mounts have a *source directory* from our local filesystem, and a *destination directory* for mounting inside the container.
   - Execute `docker run [container] --mount source=[source] target=[dest]` or `docker run [container] --volume [source]:[dest]` to create a volume
   - You can use `source=$(pwd)` to refer to the current working directory.

8. Delete the Docker volume to reset the database
    - Execute `docker volume ls` to list all volumes
    - Execute `docker volume prune` to delete all dangling volumes
    - Execute `docker volume rm <volume-name>` to remove a volume

[Docker tutorial](https://docs.docker.com/language/nodejs/build-images/)

## Part 3: Setting Up MongoDB/Mongoose and Docker Compose

**MongoDB** is a NoSQL database framework. **Mongoose** is the NodeJS version of this framework.

### Mongoose

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

### Docker Compose

**Docker Compose** is a tool that allows us to define and configure multi-container Docker applications. We do so by editing the `docker-compose.yml` file.

The file format is as follows:

```
services:
    [network name]:
        container_name: [optional, defaults to <project>_<service>_<index>]
        command: [command to execute on launch, overrides the one specified by Dockerfile]
        image: [image name]
        ports:
            - [host port]:[container port]
        working_dir: [container working directory, overrides the one specified by Dockerfile]
        volumes:
            - [source/name]:[destination]
        environment:
            - [VARIABLE]: [VALUE]

volumes:
    [source/name]: (uses default options)
```

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

## Part 4: Building and Development

1. Build both containers at once
    - Execute `docker-compose up`
    - Execute `docker-compose up --build` to rebuild images

2. Stop all containers
    - Execute `docker-compose down`

[Docker compose example](https://hub.docker.com/r/excellalabs/mongo)

[Docker with authentication](https://hub.docker.com/r/duluca/minimal-mongo)