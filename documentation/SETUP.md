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

1. Install Docker and the VSCode Docker Extension

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
 curl --request GET --url http://localhost:3000/users \
  --header 'content-type: application/json' --data '{"msg": "testing"}'
```

5. Stop the Docker container
    - Execute `docker stop <container-name>` to stop the container
    - Execute `docker restart <container-name>` to restart the container
    - Execute `docker rm <container-name>` to remove the container from the list of containers on the machine

[Docker tutorial](https://docs.docker.com/language/nodejs/build-images/)

## Part 3: MongoDB/Mongoose

**MongoDB** is a NoSQL database framework. **Mongoose** is the NodeJS version of this framework.

