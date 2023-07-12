const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')
const { buildDocument } = require('../file')
const { ResponseBody } = require('../express-classes/response')
const { ServerError } = require('../express-classes/error')

// Compile a build into a latex document

router.post('/build/', isAuthenticated, async function(req, res, next) {
    try {    
        const ws = req.body
        const uID = req.session.uID
        console.log('Compiling worksheet...')
        console.log(ws)
        const compileres = await buildDocument(ws, uID)

        const response = new ResponseBody(ws['fn'])
        response.status = compileres

        res.json(response)
    } catch(err) {
        next(err) 
    }
})

router.post('/template/add/', function(req, res, next) {
    try {

    } catch(err) {
        next(err)
    }
})

router.post('/get', isAuthenticated, function(req, res, next) {

    // Note: the vue-pdf-embed component sends its own "GET" request that does not include session data.
    // Hence, authentication via this route is not possible.
    // Authenticate from the frontend instead.

    const sendFileOptions = {
        root: path.join(__dirname, '../public'),
        headers: {
            'x-timestamp': Date.now()
        }
    }

    try {
        var filePath
        if (req.body.name == 'preview') {
            filePath = `files/preview/preview.pdf`
        } else {
            const uID = req.session.uID
            filePath = `files/${uID}/output.pdf`
        }
        console.log(filePath)

        res.sendFile(filePath, sendFileOptions)

        // https://expressjs.com/en/api.html#res.sendFile
    } catch(err) {
        next(err)
    }
})

function isAuthenticated(req, res, next) {
    if (req.session.uID) {
        next()
    } else {
        next('route')
    }
    // next('route') tells the router to skip all the remaining route callbacks
}

function validateFilePresence(filePath) {
    if (!fs.existsSync(filePath)) {
        throw new ServerError("Failed to fetch PDF file!", `File ${filePath} does not exist on the system!`)
    } else {
        return true
    }
}

module.exports = router