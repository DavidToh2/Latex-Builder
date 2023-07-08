const cp = require('child_process')
const path = require('path')
const fs = require('fs')

const { getTemplate } = require('./db-file')

const { UserError, DatabaseError, newError } = require('./express-classes/error')

const scriptroot = path.join(__dirname, 'scripts')
const fileroot = path.join(__dirname, 'public/files')

function folderCreate(uID) {
    const filePath = `${fileroot}/${uID}`
    if (fs.existsSync(filePath)) {
        return filePath
    } else {
        try {
            fs.mkdirSync(filePath)
            return filePath
        } catch(err) {
            newError(err, `Failed to create folder ${filePath}!`)
        }
    }
}

function packageOutput(packages) {
    packages.forEach(function(item, index, arr) {
        arr[index] = `\\usepackage\{${item}\}\n`
    })
    const packageString = packages.join('')
    return packageString
}

function bodyOutput(body) {
    body.forEach(function(item, index, arr) {

        // If item is question
        if (item.type == 'qn') {
            arr[index] = item.body.question
        }

        // If item is latex, TODO
        else {
            arr[index] = ''
        }
    })
    const bodyString = body.join('\n\n')
    return bodyString
}

function documentOutput(documentClass, packages, setup, title, author, date, body) {
    const packageString = packageOutput(packages)

    const s = documentClass + '\n\n' + packageString + '\n\n' + setup + '\n\n'
    + `\\title\{${title}\}` + `\\author\{${author}\}` + `\\date\{${date}\}` + '\n\n'
    + "\\begin\{document\}" + "\\maketitle" + '\n\n'
    + `${body}` + '\n\n'
    + `\\end\{document\}`

    return s
}
async function buildDocument(data, uID) {

    var filePath = ''
    var output = ''

    try {
        console.log("Attempting to build document...")

        // Create folder directory
        filePath = folderCreate(uID)

        // Parse document data
        const config = data['config']

        const templateName = config['template']
        const template = await getTemplate(templateName)
        const documentClass = template['documentClass']
        const packages = template['packages']

        const setup = config['setup']

        const documentTitle = config['title']
        const title = documentTitle['title']
        const author = documentTitle['author']
        const date = documentTitle['date']

        const bodyElements = data['elements']
        const body = bodyOutput(bodyElements)

        output = documentOutput(documentClass, packages, setup, title, author, date, body)

    } catch(err) {
        newError(err, 'Failed to parse document data in build!')
    }

        // Write document into file
    try {
        console.log("Attempting to write document to file...")
        fs.writeFileSync(`${filePath}/output.tex`, output)
    } catch(err) {
        newError(err, `Failed to write to build file ${filePath}/output.tex!`)
    }

        // Compile LaTeX document
    try {
        console.log("Attempting to compile document...")
        const res = cp.execSync(`./compile_latex.sh output.tex ${filePath}`, { cwd: scriptroot })
        console.log(res.toString())    // execSync returns stdout directly

        // https://stackoverflow.com/questions/32874316/node-js-accessing-the-exit-code-and-stderr-of-a-system-command 
        // If no err: status guaranteed to be 0

        return 0

    } catch(err) {
        fileError(err)
        throw new UserError('Failed to compile latex!', err.stdout.toString())

        /*
        Error output from bash cp.execSync() works as follows:

        err.message.toString(): 'Command failed'
        err.stdout.toString(): Returns the raw output to console. In this case, all LaTeX output goes here. (This is what we want.)
        err.stderr.toString(): Returns the NodeJS Error object. Note that this object also contains stdout as Error.cause.
        */ 
    }

}

function fileError(err) {

    console.log("Message output:")
    console.log(err.message.toString())
    console.log("stdout output:")       // LaTeX errors come out here
    console.log(err.stdout.toString())
    console.log("stderr output:")
    console.log(err.stderr.toString())
}

module.exports = {
    buildDocument
}
