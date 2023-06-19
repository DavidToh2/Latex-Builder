const express = require('express')
const router = express.Router()
const path = require('path')
const { latexCompile } = require('../file')

const sendFileOptions = {
    root: path.join(__dirname, '../public'),
    headers: {
        'x-timestamp': Date.now()
    }
}


router.use((req, res, next) => {                        // MIDDLEWARE FUNCTION GETS CALLED ON EVERY QUERY
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "*")
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE")
    next()
})

// Upload a file

router.post('/upload', function(req, res, next) {
    
})

// Get the PDF file with "filename"

router.get('/get/:fileName', function(req, res, next) {

    try {
        const fileName = req.params.fileName
        const filePath = `files/${fileName}/${fileName}.pdf`
        console.log(filePath)
        res.sendFile(filePath, sendFileOptions)
    } catch(err) {
        next(err)
    }
    // https://expressjs.com/en/api.html#res.sendFile

})

// Compile a build into a latex document

router.get('/compile/:fileName', function(req, res, next) {
    try {    
        const fileName = req.params.fileName
        console.log(`Compiling file ${fileName}...`)
        const compileres = latexCompile(fileName)

        if (compileres == 0) {
            const filePath = `files/${fileName}/${fileName}.pdf`
            console.log(`Sending file at ${filePath} to front-end...`)
            res.sendFile(filePath, sendFileOptions)
        } else {
            throw new Error(`Invalid compile response: code ${compileres}`)
        }
    } catch(err) {
        next(err)
    }
})


module.exports = router