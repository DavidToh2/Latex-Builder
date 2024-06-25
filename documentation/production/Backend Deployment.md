# Introduction

This document describes the steps taken to deploy both the server and the database onto their respective cloud services.

- [Introduction](#introduction)
- [Server: Publishing Docker Image](#server-publishing-docker-image)
- [Server: Deploying to AWS Lightsail](#server-deploying-to-aws-lightsail)
  - [Deploying to Lightsail using Deployment Interface](#deploying-to-lightsail-using-deployment-interface)
  - [Deploying to Lightsail using AWS CLI Lightsail Plugin](#deploying-to-lightsail-using-aws-cli-lightsail-plugin)
  - [Environment Variables](#environment-variables)
  - [Deployment Health Check](#deployment-health-check)
- [Database: MongoDB Atlas](#database-mongodb-atlas)
  - [Network Access (TBD)](#network-access-tbd)

# Server: Publishing Docker Image

# Server: Deploying to AWS Lightsail

We set up an AWS Lightsail container service called **latexbuilder**. This service will host our container, **latexquestionbank**.

## Deploying to Lightsail using Deployment Interface

<img src="Images/lightsail-deployment.png" width=50%>

We can use the Lightsail Deployment Interface to directly *pull images from Docker Hub* into AWS Lightsail. We are required to enter the full image name: `registry.hub.docker.com/<user>/<image>:<label>`. Ensure that the image is public before pulling.

Once the deployment is live, we can connect to the Lightsail container via a public HTTPS URL:
```
https://latexbuilder.<rng>.ap-<region>.cs.amazonlightsail.com/
```

[Container Deployment Tutorial](https://aws.amazon.com/tutorials/deploy-webapp-lightsail/module-three/)

## Deploying to Lightsail using AWS CLI Lightsail Plugin

An alternative method is to [install](https://lightsail.aws.amazon.com/ls/docs/en_us/articles/amazon-lightsail-install-software) and use the AWS CLI Lightsail plugin. To do so, we would need to setup an IAM profile for Lightsail.

We create an IAM policy, **Lightsail-latex-builder-full-access**, with full access to our Lightsail resources.

We then create an IAM user, **lightsail-latex-builder-access**, and assign it to the above permission policy.

We also generate an access key pair for this user, and add the user to the AWS CLI using `aws configure --profile lightsail-latex-builder-access`.

Once done, we may run the following command to push a *local container image* to AWS Lightsail:
```sh
aws lightsail push-container-image           \
    --profile lightsail-latex-builder-access \
    --region ap-southeast-1                  \
    --service-name latexbuilder              \
    --label latest                           \
    --image latexquestionbank:latest
```
Sadly this isn't working as `aws lightsail` cannot detect the Docker daemon.

[IAM Policy Tutorial](https://lightsail.aws.amazon.com/ls/docs/en_us/articles/amazon-lightsail-managing-access-for-an-iam-user)

[Access Key Tutorial](https://lightsail.aws.amazon.com/ls/docs/en_us/articles/lightsail-how-to-set-up-access-keys-to-use-sdk-api-cli)

## Environment Variables

Because our Docker image has to be public for the deployment interface to work, we cannot store environment variables, including application secrets, directly in the image. As such, we need to evaluate the different approaches to handling environment variables in a production environment.

1. Insecure method: dotenv + Adding `.env` file into Docker container

**dotenv** is an npm package that lets a NodeJS application read environment variables. We can use it to read a local `.env` file as follows:
```js
const envpath = path.join(__dirname, '.env')
require('dotenv').config({ path: envpath })
```
The environment file path is the application's root file (i.e. pwd) by default.

Note that this requires the `.env` file to be copied into the Docker image.

[Using dotenv](https://stackoverflow.com/questions/42335016/dotenv-file-is-not-loading-environment-variables)

2. dotenv-vault

**dotenv-vault** is a privately-managed, cloud version of dotenv that implements encryption. Environment files are encrypted and stored in the dotenv-vault team's own Git repo, and can be pulled or pushed to by different members in a team.

However, dotenv-vault is generally only recommended for use in development and staging environments, not for production settings, due to the inherent risk of data leakage in any cloud platforms.

[Drawbacks of using dotenv-vault](https://stackoverflow.com/questions/52546426/is-module-dotenv-for-development-only)

3. Manually keying variables in the Lightsail Deployment interface. **We use this method.**

For the production environment, that would be the following four (actually two) variables:
```
MONGO_URI
COOKIE_SECRET
MONGO_SESSION_DATABASE (unused)
NODE_ENV (seems to be automatically set)
```
The environment variables are remembered across deployments, so hopefully you only need to do this once!

## Deployment Health Check

Lightsail will regularly ping the image, running internally, to ensure that the deployment is still live. We increase the health check interval in the Lightsail Deployment interface to 300s, to avoid spamming the logs.

We add a simple route at the tail end of our server's route middleware stack:
```
// Application error handler above

app.use('/', function(req, res, next) {
    res.send("Health check successful!")
})

// Routing error handler below
```
When we access the server via the aforementioned public HTTPS URL, we should get a response (code 200) that simply says "Health check successful!"

# Database: MongoDB Atlas

We set up a cloud-hosted **MongoDB Atlas** database `questiondb`, and configure a root username and password. All connections to the database subsequently require authentication via the connection URI
```
mongodb+srv://<username>:<password>@questiondb.<srvID>.mongodb.net/?retryWrites=true&w=majority
```

## Network Access (TBD)