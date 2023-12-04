const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')
const { buildDocument } = require('../src/file')
const { ResponseBody } = require('../src/express-classes/response')
const { ServerError } = require('../src/express-classes/error')

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

router.post('/get/pdf', isAuthenticated, function(req, res, next) {

    const sendFileOptions = {
        root: path.join(__dirname, '../public/files'),
        headers: {
            'x-timestamp': Date.now()
        }
    }

    try {
        var filePath = `welcome/welcome.pdf`
        if (req.body.name != 'welcome') {
            const uID = req.session.uID
            filePath = `${uID}/document/output.pdf`
        }
        // console.log(filePath)

        res.sendFile(filePath, sendFileOptions)

        // https://expressjs.com/en/api.html#res.sendFile
    } catch(err) {
        next(err)
    } 
})

router.post('/get/image', isAuthenticated, function(req, res, next) {

    const sendFileOptions = {
        root: path.join(__dirname, '../public/files'),
        headers: {
            'x-timestamp': Date.now()
        }
    }

    try {
        var filePath = 'welcome/welcome.pdf'
        if (req.body.name == 'preview') {
            const uID = req.session.uID
            filePath = `${uID}/image/preview.png`
        }
        // console.log(filePath)

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

module.exports = router