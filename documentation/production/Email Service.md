# Introduction

This document describes the steps taken to set up an automated emailing service, using Cloudflare's email forwarding capability for email receipt, and Amazon Simple Email Service for email sending.

# Email Receipt using Cloudflare

# Email Sending using AWS SES

Note: The AWS SDK for Javascript is currently on v3. The SES client for the Javascript SDK is currently on v2, and uses "Command objects" such as `SendEmailCommand` rather than the old `SendEmail` from v1.

[AWS SES SDK(JS) Reference (SendEmailCommand)](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/sesv2/)

Installation is done using `npm install @aws-sdk/client-sesv2`.

[NPM Package Repo](https://www.npmjs.com/package/@aws-sdk/client-sesv2)

## Initialising the client

To initialise the client, the following commands are required:

```js
const { SESv2Client } = require('@aws-sdk/client-sesv2')
const client = new SESv2Client({ region: "ap-southeast-1" })
```

All commands have to be executed through the client.
- We first build a `Command` object.
- We then execute the `Command` usin `client.execute(Command)`, whatever the execution command is.

[Outdated Tutorial](https://betterprogramming.pub/how-to-send-emails-with-node-js-using-amazon-ses-8ae38f6312e4)