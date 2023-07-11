const { convertUserIDsToUsernames, findUsernameUsingID } = require('../db-auth')
const { ServerError } = require('../express-classes/error')

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

module.exports = { parseID, parseUserPerms }


