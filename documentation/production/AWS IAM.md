# Introduction

This document serves to be a primer on how AWS IAM works, as well as describe how we configure IAM profiles to allow the AWS CLI, as well as our app's native code (through AWS SDKs), to access our AWS resources.

- [Introduction](#introduction)
- [What is Identity Access Management?](#what-is-identity-access-management)
  - [Policies](#policies)
  - [Groups and Users](#groups-and-users)
  - [IAM Identity Center (successor to AWS Single Sign-On)](#iam-identity-center-successor-to-aws-single-sign-on)
- [Configuring Users](#configuring-users)
  - [User and Policy Creation](#user-and-policy-creation)
  - [Long-Term Access Keys for Programmatic Access](#long-term-access-keys-for-programmatic-access)
  - [Configuring User Profiles in AWS CLI and SDKs](#configuring-user-profiles-in-aws-cli-and-sdks)
  - [Using User Profiles Programmatically](#using-user-profiles-programmatically)


# What is Identity Access Management?

**Identity Access Management**, or **IAM**, is Amazon's identity management framework used to securely control access to AWS resources. **Root users** (who are humans) centrally manage the permissions of **IAM users**, who are assigned specific roles and permissions.

- IAM users may be humans, as in the cases of many large organisations. Employees are granted access to *specific AWS resources*, such as only EC2 or only specific S3 buckets, as well as *specific actions* relevant to their job scope, such as read and write actions.
- IAM users may also be "programmatic users", created to allow *programmatic access* to AWS resources by external applications, the AWS CLI, or the AWS SDK.

AWS's granular approach toward assigning user permissions and roles follows the **principle of least privilege**, where users are not granted any more authorisation than is required for their job.

In the context of our web application, 
- IAM users are mainly used for programmatic access to AWS resources through the AWS SDKs, and (occasionally manually) through the AWS CLI.
- Each IAM user allows a particular service to interact with its relevant AWS resource, and thus access to that IAM user should be restricted to its AWS resource.

## Policies

A policy grants *permissions* for the user to carry out a number of *actions* on a list of *resources*.

The following policies are relevant to our project:
- S3 policies, for our frontend;
- Lightsail policies, for our backend;
- SES policies, for our email service.

## Groups and Users

IAM users are required for the following procedures in our project:
- Pushing our frontend deployment to S3;
- Pushing our backend image to our Lightsail container deployment;
- Enabling our server to use AWS SES.

## IAM Identity Center (successor to AWS Single Sign-On)

The **IAM Identity Center** is a place for root users to configure access to AWS resources for *IAM accounts for human use*. It is intended as a tool for employee management, known as *workforce identities*, so is irrelevant to our project.

# Configuring Users

## User and Policy Creation

Policies may be picked from a gigantic list of pre-configured policies that Amazon provides.
- Our SES IAM user can simply be given the `AmazonSESFullAccess` policy.

Policies may also be configured with specific lists of actions and resources.
- Our S3 IAM user should have *read, write and list* permissions in order to read, write, overwrite and delete objects from our S3 bucket. This can be manually configured like so:
```
        "Effect": "Allow",
        "Action": [
            "s3:PutObject",
            "s3:GetObject",
            "s3:ListBucket",
            "s3:DeleteObject",
            "s3:GetBucketPolicy"
        ],
        "Resource": [
            "arn:aws:s3:::towelet.app",
            "arn:aws:s3:::towelet.app/*"
        ]
```
- Our Lightsail IAM user needs to be configured similarly, to only grant access to actions pertaining to our specific Lightsail resource:
```
        "Effect": "Allow",
        "Action": [
            "lightsail:*"
        ],
        "Resource": [
            "arn:aws:lightsail:<region>:<account-id>:ContainerService/<container-service-id>"
        ]
```
(Note: Our Lightsail container service's ARN was obtained by running `aws lightsail get-container-services` using an IAM profile with access to all Lightsail resources. This command is dangerous as it exposes the service's environment variables in console.)

## Long-Term Access Keys for Programmatic Access

IAM users can authenticate themselves in three ways:
- By using the IAM Identity Management Center. This is irrelevant to our use case.
- By using short-term credentials. [AWS's documentation](https://docs.aws.amazon.com/sdkref/latest/guide/access-temp-idc.html) is available here. Short-term credentials are also meant for users created in the Identity Management Center, and are also irrelevant to our use case.
- By using long-term credentials.

Long-term credentials are also known as **access key pairs**, and appear in the following format:
```
[user-name]
aws_access_key_id = AKIA<rest of key here>
aws_secret_access_key = <secret key here>
```

For our use case, we need to generate an access key pair for each IAM user *in the AWS IAM console.* These key pairs should be kept safe and **not hard-coded into our application**, as anyone with the access keys can view and access our AWS resources through the CLI.

## Configuring User Profiles in AWS CLI and SDKs

We can configure the AWS CLI to use our IAM user profiles, using the command
```sh
aws configure <options>
```

To add a new user with a specific name, we use the following command, and *key in the access keys previously generated to us from the AWS IAM console:*
```sh
aws configure --profile <name>
AWS Access Key ID [None]: 
AWS Secret Access Key [None]: 
Default region name [None]:
Default output format [None]:
```

To list the names of all profiles, we use
```sh
aws configure list-profiles
```

The access and secret keys of all profiles can be viewed and modified under `~/.aws/credentials`.

## Using User Profiles Programmatically

We can then use the AWS CLI to run commands using our configured profiles, by adding the option `--profile <name>` to our commands. This requires the configured profiles to be stored locally.
- For more details regarding the specific commands being run by the S3 and Lightsail CLIs, refer to their respective documentations.

We can also use the profiles in the AWS SDK by directly supplying the profile's access keys to the SDK. This allows our app's native code to interact with our AWS resources directly. 
- Every AWS SDK rovides a `credential-providers` package which looks for AWS credentials from a variety of sources. The documentation for the `fromEnv()` credential provider is [here](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-credential-providers/#fromenv), and loads the following two variables automatically into the SDK.
```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
```

[AWS SDK(JS) Guide: How to set credentials](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/setting-credentials-node.html)
