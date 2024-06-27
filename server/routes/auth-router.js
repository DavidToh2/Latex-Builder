const express = require('express');
const router = express.Router();
const dbAuth = require('../src/db/db-auth')
const dbToken = require('../src/db/db-token')
const { ResponseBody, ResponseError } = require('../src/express-classes/response')
const { UserError, DatabaseError, ServerError } = require('../src/express-classes/error')

router.post('/signup', async function(req, res, next) {

    // When a user signs up

    try {
        console.log('Signup parameters:')
        const userData = req.body
        console.log(userData)

        const response = new ResponseBody(userData['fn'])
        response.status = await dbAuth.newUser(userData)

        // Logs user out as well
        req.session.destroy(function(err) {
            if (err) next(err)
            res.json(response)
        })
    } catch(err) {
        next(err)
    }

})

router.get('/validate/:token', async function(req, res, next) {

    try {
        console.log("Validating token...")
        const t = req.params['token']

        const r = await dbToken.validateToken(t)    // Returns a response string
        res.send(r)
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
        const userData = req.body

        const nU = await dbAuth.authenticateUser(userData)
        const response = new ResponseBody(userData['fn'])

        response.status = 0
        req.session.regenerate(function(err) {

            if (err) next(err)

            req.session.uID = nU['id']
            delete nU['id']
            response.body = nU
            
            req.session.save(function(err) {
                if (err) next(err)
                res.json(response)
            })
        })
    } catch(err) {
        next(err)
    }

})

router.post('/logout', isAuthenticated, function(req, res, next) {

    try {
        const userID = req.session.uID
        console.log(`Logging out user ${userID}...`)
        const response = new ResponseBody(req.body['fn'])
        response.status = 0
        req.session.destroy(function(err) {
            if (err) next(err)
            res.json(response)
        })
    } catch(err) {
        next(err)
    }
})

router.post('/check', isAuthenticated, function(req, res, next) {
    const response = {
        isAuth: 1
    }
    res.json(response)
})
router.post('/check', function(req, res, next) {
    const response = {
        isAuth: 0
    }
    res.json(response)
})

router.post('/info/get', isAuthenticated, async function(req, res, next) {

    // Get user data based on session user ID.

    try {
        const uID = req.session.uID
        const u = await dbAuth.findUserInfoUsingID(uID)

        const response = new ResponseBody(req.body['fn'])
        response.status = 0
        response.body = u

        res.json(response)
    } catch(err) {
        next(err)
    }
})

router.post('/info/set', isAuthenticated, async function(req, res, next) {

    // Modify user data.

    try {
        const uID = req.session.uID
        const data = req.body

        const r = await dbAuth.modifyUser(uID, data)

        const response = new ResponseBody(data['fn'])
        response.status = 0
        response.body = r

        res.json(response)
    } catch(err) {
        next(err)
    }
})

router.post('/changepassword', isAuthenticated, async function(req, res, next) {

    // Change password.

    try {
        const uID = req.session.uID
        const data = req.body

        const response = new ResponseBody(data['fn'])
        response.status = await dbAuth.changePassword(uID, data)

        // Logs user out as well
        req.session.destroy(function(err) {
            if (err) next(err)
            res.json(response)
        })
    } catch(err) {
        next(err)
    }
})

router.post('/search/user', isAuthenticated, async function(req, res, next) {

    // Determine whether user with name is present.

    try {
        const data = req.body
        const u = data['username']

        const up = await dbAuth.findUserIDUsingUsername(u)

        const response = new ResponseBody(data['fn'])
        if (up) {
            response.status = 0
            response.body = {
                "userPresent": true
            }
        } else {
            response.status = 1
            response.body = {
                "userPresent": false
            }
        }
        res.json(response)
    } catch(err) {
        next(err)
    }
})
router.post('/search/group', isAuthenticated, async function(req, res, next) {

    // Determine whether group with name is present.

    try {
        const data = req.body
        const u = data['groupname']

        // PLACEHOLDER

        const up = await dbAuth.findGroupUsingName(u)

        const response = new ResponseBody(data['fn'])
        if (up) {
            response.status = 0
            response.body = {
                "groupPresent": true
            }
        } else {
            response.status = 1
            response.body = {
                "groupPresent": false
            }
        }
        res.json(response)
    } catch(err) {
        next(err)
    }
})

router.post('/delete', isAuthenticated, async function(req, res, next) {

    // Delete user

    try {
        const uID = req.session.uID
        const data = req.body

        const response = new ResponseBody(data['fn'])
        response.status = await dbAuth.deleteUser(uID)

        req.session.destroy(function(err) {
            if (err) next(err)
            res.json(response)
        })
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