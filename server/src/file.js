const cp = require('child_process')
const path = require('path')
const fs = require('fs')

const dbTemplate = require('./db/db-file')
const aux = require('./aux')

const { UserError, DatabaseError, ServerError, newError } = require('./express-classes/error')

const DEFAULT_PACKAGES = ["matholympiad", "amsmath", "enumitem", "geometry", "graphicx", "fancyhdr"]

const scriptroot = path.join(__dirname, 'scripts')
const fileroot = path.join(__dirname, '../public/files')

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

async function buildDocument(data, uID) {

    var filePath = ''
    var output = ''

    try {
        console.log("Attempting to build document...")

        // Create folder directory
        filePath = folderCreate(uID)

        // Parse document data
        const config = data['config']

            // Get template and populate template settings
        const templateName = config['template']
        aux.parseAlphanumericString(templateName)

        const template = await dbTemplate.getTemplate(templateName)
        const documentClass = template['documentClass']
        const templatePackages = template['packages']

            // Get additional packages
        const documentPackages = config['packages']

        const packages = Array.from(new Set([...DEFAULT_PACKAGES, ...templatePackages, ...documentPackages]))

            // Get setup
        const setup = config['setup']

            // Get document title 
        const documentTitle = config['title']
        const title = documentTitle['title']
        aux.parseAlphanumericString(title)
        const author = documentTitle['author']
        aux.parseAlphanumericString(author)
        const date = documentTitle['date']
        aux.parseAlphanumericString(date)

            // Get page settings
        const page = config['page']

            // Get text settings
        const text = config['text']

            // Get worksheet elements
        const bodyElements = data['elements']

        output = documentOutput(documentClass, packages, setup, documentTitle, page, text, bodyElements)

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

function documentOutput(documentClass, packages, setup, documentTitle, page, text, bodyElements) {
    const documentClassString = documentClassOutput(documentClass)
    const packageString = packageOutput(packages)

    const s = documentClassString + packageString + '\n\n' + setup + '\n\n'
    + `\\title\{${title}\}` + `\\author\{${author}\}` + `\\date\{${date}\}` + '\n\n'
    + "\\begin\{document\}" + "\\maketitle" + '\n\n'
    + `${body}` + '\n\n'
    + `\\end\{document\}`

    return s
}

function documentClassOutput(documentClass) {
    aux.parseAlphanumericString(documentClass)
    return '\\documentClass\[a4paper,twoside\]\{' + documentClass + '\}\n\n'
}

function packageOutput(packages) {
    packages.forEach(function(item, index, arr) {
        aux.parseAlphanumericString(item)
        arr[index] = '\\usepackage\{' + item + '\}\n'
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
