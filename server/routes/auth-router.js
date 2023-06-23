const express = require('express');
const router = express.Router();
const { newUser, authenticateUser, isAuthenticated } = require('./../db-auth')

router.post('/signup', async function(req, res, next) {

    // When a user signs up

    try {
        console.log('Signup parameters:')
        const userData = req.body
        console.log(userData)

        const nU = await newUser(userData)

        var response = {
            returnCode: "success"
        }

        if (!nU) {
            response['returnCode'] = "failure_userExists"
        }

        req.session.regenerate()
        res.json(response)
    } catch(err) {
        next(err)
    }

})

router.post('/login', async function(req, res, next) {

    // When a user logs in
    // Sets session isAuthenticated = true, sets session userID
    // express-session will also set the session cookie
    // All data will be stored in our sessionStore.

    try {
        console.log('Login parameters:')
        const userData = req.body
        console.log(userData)

        const nU = await authenticateUser(userData)

        var response = {
            returnCode: "success"
        }

        if (!nU) {
            response['returnCode'] = "failure_authenticationFailure"
        } else {
            req.session.regenerate(function(err) {
                if (err) next(err)
            })
            req.session.uID = nU['id']
            response['username'] = nU['username']
            response['socialInfo'] = nU['socialInfo']
        }

        res.json(response)
    } catch(err) {
        next(err)
    }

})

router.post('/logout', isAuthenticated, function(req, res, next) {

    try {
        const userID = req.session.uID

        req.session.uID = null

        req.session.regenerate(function(err) {
            if (err) next(err)
        })
        
        var response = {
            returnCode: "success"
        }

        res.json(returnCode)
    } catch(err) {
        next(err)
    }
})

router.post('/check', isAuthenticated, function(req, res, next) {
    var response = {
        isAuth: "true"
    }
    res.json(response)
})
router.post('/check', function(req, res, next) {
    var response = {
        isAuth: "false"
    }
    res.json(response)
})

        // Local error handler

router.use(function(err) {
    
})

module.exports = router