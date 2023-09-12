# Introduction

This file describes the steps taken to deploy the web-app's frontend to production environment.

The Vue frontend is compiled and minified in `./dist`, so that the site is now essentially static. These static files are then pushed to an **AWS S3 bucket**, which is proxied through **Cloudflare's CDN**.

- [Introduction](#introduction)
- [Deployment](#deployment)
  - [Compiling Vue](#compiling-vue)
  - [Creating S3 Bucket](#creating-s3-bucket)
  - [IAM Profile](#iam-profile)
  - [Deploying to S3](#deploying-to-s3)
- [Configuration](#configuration)
  - [Configuring S3 for Website Hosting](#configuring-s3-for-website-hosting)


# Deployment

## Compiling Vue

The Vue frontend needs to be compiled. In `vue-frontend`, execute `npm run build`, which runs `vite build`.

All Vue components are transformed into HTML, CSS and JS files and minified under the `./dist` category. The main file is `index.html`. Assets are minified under `./dist/assets`.

## Creating S3 Bucket

We set up an AWS S3 bucket, **towelet.app**, for hosting the static front-end website. This bucket has to have the same name as our domain's URI To the site.

An S3 bucket is a way of hosting static files, and works especially well with one-page web applications such as Vue.

We enable static website hosting for our bucket, which provides us with a bucket website endpoint. This endpoint is the entrypoint from which we can issue commands to our S3 bucket.

## IAM Profile

We create an IAM policy, **S3-sync-to-latex-builder-bucket**, with _read, write and list_ permissions to our S3 bucket, then assign it to the **towelet.app** bucket resource.

We then create an IAM user, **latex-builder-deploy**, and assign it the above permission policy. 

This IAM user requires an access key pair to configure as a profile in the AWS CLI. The access key may be generated in the AWS IAM Console, then saved in your machine.

To configure the access key pair as a profile named `latex-deploy`, run `aws configure --profile latex-builder-deploy` and key in your access key pair:
```sh
$ aws configure --profile latex-builder-deploy
```

## Deploying to S3

We can then use this profile to issue commands to the S3 bucket, like so:
```sh
aws --region [region] --profile latex-builder-deploy s3 [command]
```
We can now sync up our local repo with the bucket like so:
```sh
aws --region [region] --profile latex-builder-deploy s3 sync ./dist [S3URI]
```
This can be set up as a script `npm run deploy` in `package.json`.

# Configuration

## Configuring S3 for Website Hosting

We need to configure the S3 bucket for static website hosting. This can be done under the S3 console menu -> Properties -> Static website hosting.

The index document is set to be `index.html`, which is also the root document object compiled by Vite.

We now have access to a public HTTP endpoint, http://towelet.app.s3-website-[region].amazonaws.com, from which we can access the webpage.