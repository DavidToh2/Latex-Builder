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
        console.log("Email successfully sent!")
        return data
    } catch(err) {
        console.log("Email error occured:")
        console.log(err)
    }
}

async function sendWelcomeSignupEmail(username, email, userID) {

    emailContent = `
    <body>
        <div class="box">
            <h1>Welcome to Latex Builder!</h1>
            <p>Thank you for signing up, ${username}. To confirm your email address, click on the following link to activate your account:</p>
            <div style="display: flex; justify-content: center; width: 100%;">
                <div class="link">Hello there!</div>
            </div>
        </div>
    </body>
    `

    await sendEmail(email, "Latex Builder: Verify your Email", HTMLHead + emailContent + HTMLFoot)
}

module.exports = {
    sendWelcomeSignupEmail
}