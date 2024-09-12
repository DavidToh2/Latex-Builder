const { SESv2Client, SendEmailCommand } = require('@aws-sdk/client-sesv2')

const client = new SESv2Client({ 
    region: "ap-southeast-1",
    credentials: {
        accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY
    }
})
const sourceEmail = process.env.AWS_SES_SOURCE_EMAIL

const HTMLHead = `
<!DOCTYPE html>
<html lang=3D"en" xmlns=3D"http://www.w3.org/1999/xhtml">
<head>
  <title></title>
  <style>
  body {
    font-family: Arial, Helvetica, sans-serif;
  }
  .box {
  	border: 2px solid black;
    padding: 30px;
  }
  .link {
  	background-color: #e6e6e6;
    padding: 10px;
    font-size: 1.2em;
    font-weight: bold;
  	width: fit-content;
    min-width: 40%;
    text-align: center;
  }
  </style>
</head>
`
const HTMLFoot = `
</html>
`

async function sendEmail(recipientEmail, emailSubject, emailContent) {

    const params = {
        FromEmailAddress: sourceEmail,
        Destination: {
            ToAddresses: [
                recipientEmail
            ],
        },
        ReplyToAddresses: [],
        Content: {
            Simple: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: emailContent
                    }
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: emailSubject
                }
            }
        } 
    }

    const emailToSend = new SendEmailCommand(params)
    
    try {
        const data = await client.send(emailToSend)
        console.log(`Email successfully sent to ${recipientEmail}!`)
        return data
    } catch(err) {
        console.log("Email error occured:")
        console.log(err)
    }
}

async function sendWelcomeSignupEmail(username, email, token) {

    emailContent = `
    <body>
        <div class="box">
            <h1>Welcome to Latex Builder!</h1>
            <p>Thank you for signing up, ${username}. To confirm your email address, click on the following link to activate your account:</p>
            <div style="display: flex; justify-content: center; width: 100%;">
                <a href="${formatLink(token)}">
                    <div class="link">Click Here</div>
                </a>
            </div>
            <p>Please note that this should be done within 30 minutes of receipt of this email, otherwise you will have to sign up again.</p>
            <p>You may ignore this email if you believe it was sent in error.</p>
        </div>
    </body>
    `

    await sendEmail(email, "Latex Builder: Verify your signup email", HTMLHead + emailContent + HTMLFoot)
}

async function sendChangePasswordEmail(username, email, token) {
    emailContent = `
    <body>
        <div class="box">
            <h1>Hello, ${username}.</h1>
            <p>You are receiving this email because we believe you requested a password change.</p>
            <p>To complete the change, click on the following link:</p>
            <div style="display: flex; justify-content: center; width: 100%;">
                <a href="${formatLink(token)}">
                    <div class="link">Click Here</div>
                </a>
            </div>
            <p>Please note that this should be done within 5 minutes of receipt of this email, otherwise you will have to perform the request again.</p>
            <p>You may ignore this email if you believe it was sent in error.</p>
        </div>
    </body>
    `

    await sendEmail(email, "Latex Builder: Verify your password change", HTMLHead + emailContent + HTMLFoot)
}

async function sendDeleteAccountEmail(username, email, token) {
    emailContent = `
    <body>
        <div class="box">
            <h1>Hello, ${username}.</h1>
            <p>You are receiving this email because we believe you requested to delete your account.</p>
            <p>To complete the account deletion, click on the following link:</p>
            <div style="display: flex; justify-content: center; width: 100%;">
                <a href="${formatLink(token)}">
                    <div class="link">Click Here</div>
                </a>
            </div>
            <p>Please note that this should be done within 5 minutes of receipt of this email, otherwise you will have to perform the request again.</p>
            <p>You may ignore this email if you believe it was sent in error.</p>
        </div>
    </body>
    `

    await sendEmail(email, "Latex Builder: Verify your password change", HTMLHead + emailContent + HTMLFoot)
}

function formatLink(token) {
    if (process.env.NODE_ENV.trim() == 'development') {
        return `localhost:3000/auth/validate/${token}`
    } else if (process.env.NODE_ENV.trim() == 'production') {
        return `https://server.towelet.app/auth/validate/${token}`
    }
}

module.exports = {
    sendWelcomeSignupEmail,
    sendChangePasswordEmail,
    sendDeleteAccountEmail
}