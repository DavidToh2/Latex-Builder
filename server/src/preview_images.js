const { S3Client, DeleteObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3")
const fs = require('fs')

const client = new S3Client({ 
    region: "ap-southeast-1",
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
    }
})
const previewBucket = process.env.AWS_S3_BUCKET

async function uploadPreview(filePath, qID) {
    imagePath = `${filePath}/preview.png`
    imageName = `${qID}.png`
    image = fs.createReadStream(imagePath)
    image.on('error', (err) => { if (err) throw err })

    const params = {
        "Body": image,
        "Bucket": previewBucket,
        "Key": imageName,
        "ContentType": "image/png"
    }

    const previewToUpload = new PutObjectCommand(params)

    try {
        const data = await client.send(previewToUpload)
        console.log("Uploaded preview!")
        return data
    } catch(err) {
        console.log("Preview uploading error occured:")
        console.log(err)
    }
}

async function deletePreview(qID) {
    imageName = `${qID}.png`

    const params = {
        "Bucket": previewBucket,
        "Key": imageName
    }

    const previewToDelete = new DeleteObjectCommand(params)

    try {
        const data = await client.send(previewToDelete)
        console.log("Preview successfully deleted!")
        return data
    } catch(err) {
        console.log("Preview deletion error occured:")
        console.log(err)
    }
}

module.exports = {
    uploadPreview, deletePreview
}