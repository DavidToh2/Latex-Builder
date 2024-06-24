const { convertUserIDsToUsernames, findUsernameUsingID } = require('./db/db-auth')
const { ServerError, UserError } = require('./express-classes/error')

function parseID(data, source) {
    try {
        if (source == 'server') {       // Sending a question from server to frontend.
                                        // Convert ID to displayID.
            if (!data['id']) {
                return true
            } else if (data['category'].length == 2) {
                data['displayID'] = 'MCS' + data['id'].toString()
                delete data['id']
            } else {
                switch(data['category'][0]) {
                    case 'Mathematics':
                        data['displayID'] = 'M' + data['id'].toString()
                        delete data['id']
                    break
                    case 'Computer Science':
                        data['displayID'] = 'CS' + data['id'].toString()
                        delete data['id']
                    break
                }
            }
            console.log(data['displayID'])
        }
        else if (source == 'web') {     // Parsing search data from frontend, or
                                        // saving / inserting a new question.
                                        // Convert displayID to ID.
            const dispID = data['displayID']

            if (!dispID) {
                return true
            } else if (dispID.substring(0, 3) == 'MCS') {
                data['id'] = parseInt(dispID.substring(3))
                delete data['displayID']
            } else {
                if (dispID.substring(0, 1) == 'M') {
                    // data['category'] = [ 'Mathematics' ]
                    data['id'] = parseInt(dispID.substring(1))
                    delete data['displayID']
                }
                if (dispID.substring(0, 2) == 'CS') {
                    // data['category'] = [ 'Computer Science' ]
                    data['id'] = parseInt(dispID.substring(2))
                    delete data['displayID']
                }
            }
            
        }
    } catch(err) { 
        throw new ServerError(`Failed to parse ID from ${source}!`, err.message)
    }
}

async function parseUserPerms(userPerms) {

    // Converts all user IDs in qn.userPerms to usernames

    try {
        userPerms.owner = await findUsernameUsingID(userPerms.owner)

        const a = await convertUserIDsToUsernames(userPerms.canModifyUsers)
        // await convertUserIDsToUsernames(userPerms.canModifyGroups)
        const b = await convertUserIDsToUsernames(userPerms.canReadUsers)
        // await convertUserIDsToUsernames(userPerms.canReadGroups)
        if (a && b) {
            return true
        } else {
            return false
        }
    } catch(err) {
        throw new ServerError(`Failed to parse userIDs into usernames!`, err.message)
    }

}

function parseString(s) {
    if (typeof s != 'string') {
        throw new ServerError(`Sanitisation check failed!`, `Illegal object passed!`)
    }
    else if (/^[A-Za-z0-9,.-_:;'"*|\&\\\{\}\(\)\[\] ]*$/.test(s)) {
        if (s) {
            const l = s.length
            var c = 0
            for (var i=0; i<l; i++) {
                if (s[i] == '\{') {
                    c++
                } else if (s[i] == '\}') {
                    c--
                    if (c < 0) {
                        throw new UserError(`Sanitisation check failed!`, `Parenthesis do not match!`)
                    }
                }
            }
            if (c == 0) {
                return true
            } else {
                throw new UserError(`Sanitisation check failed!`, `Parenthesis do not match!`)
            }
        } else {
            return false
        }
    } else {
        throw new ServerError(`Sanitisation check failed!`, `Illegal characters detected in string!`)
    }
}

function parseStringBrackets(s) {
    if (typeof s != 'string') {
        throw new ServerError(`Sanitisation check failed!`, `Illegal object passed!`)
    } else {
        const l = s.length
        var c = [0, 0, 0]
        var good = true
        var i = 0
        for (var i=0; i<l; i++) {
            switch(s[i]) {
                case '\{':
                    c[0]++
                break
                case '\}':
                    c[0]--
                    if (c[0] < 0) {
                        good = false
                    }
                break
                case '\(':
                    c[1]++
                break
                case '\)':
                    c[1]--
                    if (c[1] < 0) {
                        good = false
                    }
                break
                case '\[':
                    c[2]++
                break
                case '\]':
                    c[2]--
                    if (c[2] < 0) {
                        good = false
                    }
                break
            }
            if (!good) {
                break
            }
        }
        if (!good) {
            return false
        } else {
            if (c[0] == 0 && c[1] == 0 && c[2] == 0) {
                return true
            } else {
                return false
            }
        }
    }
}

function parseAlphanumericString(s) {
    if (typeof s != 'string') {
        throw new ServerError(`Sanitisation check failed!`, `Illegal object passed!`)
    }
    else if (/^[A-Za-z0-9. ]*$/.test(s)) {
        if (s) {
            return true
        } else {
            return false
        }
    } else {
        throw new ServerError(`Sanitisation check failed!`, `Illegal characters detected in alphanumeric string!`)
    }
}

function validateQuestionInputs(question) {
    if (question['question'].length < 1) {
        throw new UserError("Empty question!")
    }
    if (question['category'].length < 1) {
        throw new UserError("Missing category!")
    }
    if (question['topic'].length < 1) {
        throw new UserError("Missing topic!")
    }
    if (question['sourceYear'] != "") {
        if (!(/^\d{4}$/.test(question['sourceYear']))) {
            throw new UserError("Source year improperly formatted!")
        }
    }
}

module.exports = { parseID, parseUserPerms, parseString, parseStringBrackets, parseAlphanumericString,
    validateQuestionInputs
}


