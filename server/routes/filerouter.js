var express = require('express')
var router = express.Router()
var path = require('path')

var sendFileOptions = {
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

router.get('/get/:fileName', function(req, res) {

    const fileName = req.params.fileName
    const filePath = `files/${fileName}/${fileName}.pdf`
    console.log(filePath)
    res.sendFile(filePath, sendFileOptions, function(err) {
        if (err) {
            next(err)
        }
    })
    // https://expressjs.com/en/api.html#res.sendFile

})

// Compile a build into a latex document

router.post('/build', function(req, res) {

})


module.exports = router