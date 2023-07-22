# Introduction

This file describes the steps needed to deploy the app to production.

- [Introduction](#introduction)
  - [Environmental Variables (Server)](#environmental-variables-server)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Frontend: AWS S3](#frontend-aws-s3)
  - [Compiling Vue](#compiling-vue)
  - [Deploying to S3](#deploying-to-s3)
  - [IAM](#iam)
  - [Cloudfront](#cloudfront)
- [Server: Docker + AWS EC2](#server-docker--aws-ec2)
  - [EC2](#ec2)
  - [Building Docker in EC2](#building-docker-in-ec2)
- [Database: MongoDB Atlas](#database-mongodb-atlas)
  - [Network Access](#network-access)

## Environmental Variables (Server)

In the `.env` file, set the `NODE_ENV` environment variable:
```
NODE_ENV=production
```

## Frontend

The Vue frontend is compiled and minified in `./dist`, so that the site is now essentially static. These static files are then pushed to an **AWS S3 bucket** and served through **Cloudfront CDN**.

External users connect to the website through a Cloudfront URL [d1j3agbahkhud6.cloudfront.net](d1j3agbahkhud6.cloudfront.net).

## Backend

The server, which resides in `latexquestionbank`, is deployed to an **EC2 machine**.

The database, which resides in `questiondb`, is deployed to **MongoDB Atlas**. The connection URI to the database is
```
mongodb+srv://<username>:<password>@questiondb.<srvID>.mongodb.net/?retryWrites=true&w=majority
```

The users' filesystems will be stored on another **AWS S3 bucket**. (to be implemented)



# Frontend: AWS S3

## Compiling Vue

The Vue frontend needs to be compiled. In `vue-frontend`, execute `npm run build`, which runs `vite build`.

All Vue components are transformed into HTML, CSS and JS files and minified under the `./dist` category. The main file is `index.html`. Assets are minified under `./dist/assets`.

## Deploying to S3

We set up an AWS S3 bucket, **latex-builder**, for hosting the static front-end website.

An S3 bucket is a way of hosting static files, and works especially well with one-page web applications such as Vue.

We enable static website hosting for our bucket, which provides us with a bucket website endpoint. This endpoint is the entrypoint from which we can issue commands to our S3 bucket.

## IAM

We create an IAM policy with _read, write and list_ permissions to our S3 bucket, then assign it to the **latex-builder** bucket resource.

We then create an IAM user, **latex-builder-deploy**, and assign it the above permission policy. This IAM user requires an access key pair to configure as a profile in the AWS CLI. We can then use this profile to issue commands to the S3 bucket, like so:
```
aws --region ap-southeast-1 --profile latex-builder-deploy s3 [command]
```
We can now sync up our local repo with the bucket like so:
```
aws --region ap-southeast-1 --profile latex-builder-deploy s3 sync ./dist [S3URI]
```
This can be set up as a script in `package.json`.

## Cloudfront

We then set up a Cloudfront distribution, with our S3 bucket's website endpoint as the origin. We select "Redirect HTTP to HTTPS" as our protocol policy.

[Tutorial](https://levelup.gitconnected.com/deploying-vue-js-to-aws-with-https-and-a-custom-domain-name-3ae1f79fe188)

# Server: Docker + AWS EC2

## EC2

We set up an AWS EC2 virtual machine, **Web Server**, to host the backend services.

The EC2 machine is a `t2.micro` Spot Instance, configured to stop whenever terminated.

When initialising the machine, a key pair is generated and assigned. The key pair `.pem` file is downloaded and saved to a location on your computer. We need to run `chmod 400 keypair.pem` to set the `.pem` file's permissions to read-only.

The default system username, used to launch the instance, is `ec2-user`. 

The Public IPv4 DNS of the EC2 machine provides an endpoint from which we can `ssh` into the machine, like so:
```
ssh -i [location of .pem] [Username]@[Public IPv4 DNS]
```

## Building Docker in EC2

We push the `latexquestionbank` Docker image to Docker Hub.

We then `ssh` into the EC2 machine, and re-pull the Docker image.

# Database: MongoDB Atlas

We set up a cloud-hosted MongoDB Atlas database `questiondb`, and configure a root username and password. All connections to the database subsequently require authentication.

## Network Access

