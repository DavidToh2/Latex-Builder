const express = require('express');
const router = express.Router();
const { newUser, authenticateUser, isAuthenticated } = require('./../db-auth')
const { ResponseBody, ResponseError } = require('../express-classes/response')

router.post('/signup', async function(req, res, next) {

    // When a user signs up

    try {
        console.log('Signup parameters:')
        const userData = req.body
        console.log(userData)

        const nU = await newUser(userData)
        const response = new ResponseBody(userData['fn'])
        response.status = 0

        req.session.regenerate((err) => {if(err) next(err)})
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
        const response = new ResponseBody(userData['fn'])
        if (!nU) {
            response.status = 1
            response.body = {}
        } else {
            response.status = 0
            req.session.regenerate((err) => {if(err) next(err)})
            req.session.uID = nU['id']
            response.body['username'] = nU['username']
            response.body['socialInfo'] = nU['socialInfo']
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
        req.session.regenerate((err) => {if(err) next(err)})
        const response = new ResponseBody(userData['fn'])
        response.status = 0

        res.json(returnCode)
    } catch(err) {
        next(err)
    }
})

router.post('/check', isAuthenticated, function(req, res, next) {
    const response = {
        isAuth: "true"
    }
    console.log(response)
    res.json(response)
})
router.post('/check', function(req, res, next) {
    const response = {
        isAuth: "false"
    }
    console.log(response)
    res.json(response)
})

        // Local error handler.
        // Catches all errors from auth-router and db-auth

router.use(function(err, req, res, next) {

    if (err instanceof UserError) {
        const response = new ResponseBody()
        response.status = 1
        response.fn = `${req.body['fn']}-UserError`
        response.body = err
        console.log(response)

        res.json(response)
    } else {
        const response = new ResponseError()
        response.status = -1
        response.fn = `${req.body['fn']}-Error`
        response.error = err
        console.log(response)

        res.status(502)
        res.json(response)
    }
})

module.exports = router