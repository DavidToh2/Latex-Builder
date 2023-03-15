var fs = require('fs').promises

const dir = __dirname
const csv = `${dir}/list.csv`

async function newID() {
    try {
        const data = await fs.readFile(csv, 'utf-8') 
        var list = data.split(', ')
        var i = 1
        const l = list.length
        if (l > 1) {
            while (list[i] == i.toString() && i < l) {
                i += 1
            }                       // i is the smallest id index that doesn't exist as of now
                                    // 0 always exists and is not used as an ID
            list.splice(i, 0, i.toString())    // inserts 'i' into index i
        } else {
            list.push('1')
        }
        var newString = list.join(', ')
        console.log(newString)
        const newfile = await fs.writeFile(csv, newString, 'utf-8')
        return i
    }
    catch(err) {
        idError(err, "Failed to assign new ID!")
        return 0
    }
}

async function deleteID(x) {
    try {
        const data = await fs.readFile(csv, 'utf-8') 
        var list = data.split(', ')
        var i = 1
        const l = list.length
        if (l > 1) {
            while (list[i] != x.toString() && i < l) {
                i += 1
            }
            if (i == l) {       // ID x not found
                return -1
            }
            list.splice(i, 1)   // i = position of ID x                 
        } else {
            return -1
        }
        var newString = list.join(', ')
        console.log(newString)
        const newfile = await fs.writeFile(csv, newString, 'utf-8')
        return i
    }
    catch(err) {
        idError(err, `Failed to delete ID ${x}!`)
        return 0
    }
}

function parseID(data, source) {
    try {
        if (source == 'server') {       // Sending a question from server to frontend.
                                        // Convert ID to displayID.
            if (data['category'].length == 2) {
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
            console.log(data)
            console.log(data['displayID'])
        }
        else if (source == 'web') {     // Parsing search data from frontend, or
                                        // saving / inserting a new question.
                                        // Convert displayID to ID.
            const dispID = data['displayID']

            if (dispID.substring(0, 3) == 'MCS') {
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
        return data
    }
    catch(err) { 
        idError(err, `Failed to parse ID from ${source}!`)
        return 0
    }
}

function idError(err, errorMsg) {
    console.log(errorMsg)
    console.log(err)
}

module.exports = { newID, deleteID, parseID }

// ( async() => { console.log(await newID()) } )()


