# Introduction

This file describes the steps needed to deploy the app to production.

- [Introduction](#introduction)
  - [Environmental Variables (Server)](#environmental-variables-server)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Frontend: AWS S3](#frontend-aws-s3)
  - [Compiling Vue](#compiling-vue)
  - [Creating S3 Bucket](#creating-s3-bucket)
  - [IAM Profile](#iam-profile)
  - [Deploying to S3](#deploying-to-s3)
  - [Cloudfront](#cloudfront)
- [Server: Docker + AWS Lightsail](#server-docker--aws-lightsail)
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

The latex previews will be stored on another **AWS S3 bucket**. (to be implemented)

# Frontend: AWS S3

## Compiling Vue

The Vue frontend needs to be compiled. In `vue-frontend`, execute `npm run build`, which runs `vite build`.

All Vue components are transformed into HTML, CSS and JS files and minified under the `./dist` category. The main file is `index.html`. Assets are minified under `./dist/assets`.

## Creating S3 Bucket

We set up an AWS S3 bucket, **latex-builder**, for hosting the static front-end website.

An S3 bucket is a way of hosting static files, and works especially well with one-page web applications such as Vue.

We enable static website hosting for our bucket, which provides us with a bucket website endpoint. This endpoint is the entrypoint from which we can issue commands to our S3 bucket.

## IAM Profile

We create an IAM policy, **S3-sync-to-latex-builder-bucket**, with _read, write and list_ permissions to our S3 bucket, then assign it to the **latex-builder** bucket resource.

We then create an IAM user, **latex-builder-deploy**, and assign it the above permission policy. 

This IAM user requires an access key pair to configure as a profile in the AWS CLI. The access key may be generated in the AWS IAM Console, then saved in your machine.

To configure the access key pair as a profile named `latex-deploy`, run `aws configure --profile latex-builder-deploy` and key in your access key pair:
```sh
$ aws configure --profile latex-builder-deploy
AWS Access Key ID [None]: 
AWS Secret Access Key [None]: 
Default region name [None]: ap-southeast-1
Default output format [None]:
```

## Deploying to S3

We can then use this profile to issue commands to the S3 bucket, like so:
```sh
aws --region ap-southeast-1 --profile latex-builder-deploy s3 [command]
```
We can now sync up our local repo with the bucket like so:
```sh
aws --region ap-southeast-1 --profile latex-builder-deploy s3 sync ./dist [S3URI]
```
This can be set up as a script `npm run deploy` in `package.json`.

## Cloudfront

We then set up a Cloudfront distribution, with our S3 bucket's website endpoint as the origin. We select "Redirect HTTP to HTTPS" as our protocol policy.

[Tutorial](https://medium.com/@kyashkarande/deploy-vuejs-app-on-aws-s3-with-cloudfront-distribution-and-a-custom-domain-9058bf39f0a3)

[Tutorial (requires Medium paid account, no longer accessible)](https://levelup.gitconnected.com/deploying-vue-js-to-aws-with-https-and-a-custom-domain-name-3ae1f79fe188)

# Server: Docker + AWS Lightsail



# Database: MongoDB Atlas

We set up a cloud-hosted MongoDB Atlas database `questiondb`, and configure a root username and password. All connections to the database subsequently require authentication.

## Network Access

