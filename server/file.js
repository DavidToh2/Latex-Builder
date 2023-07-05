const cp = require('child_process')
const path = require('path')

const { existsSync } = require('fs')

const scriptroot = path.join(__dirname, 'scripts')
const fileroot = path.join(__dirname, 'public/files')

// Creates a new .tex file from a raw build.
function fileCreate() {

}

// Deletes an existing file.
function fileDelete() {

}

// Uploads a file.
function fileUpload() {

}

function documentOutput(documentClass, packages, setup, title, author, date, body) {
    const s = documentClass + '\n\n' + packages + '\n\n' + setup + '\n\n'
    + `\\title\{${title}\}` + `\\author\{${author}\}` + `\\date\{${date}\}` + '\n\n'
    + "\\begin\{document\}" + "\\maketitle" + '\n\n'
    + `${body}` + '\n\n'
    + `\\end\{document\}`

    return s
}

async function buildDocument(data, reqSource, templateName = "default") {

}

function latexCompile(fileName) {

    filePath = `${fileroot}/${fileName}`

    console.log(`Validating file at ${filePath}...`)
    if (!validateFilePresence(filePath)) {
        console.log(`File ${fileName} does not exist!`)
        return false
    }

    fileName = filePath + `/${fileName}.tex`

    console.log(`NodeJS: Executing compile_latex.sh on file ${fileName} with target location ${filePath}...`)

    try {
        const res = cp.execSync(`./compile_latex.sh ${fileName} ${filePath}`, { cwd: scriptroot })
        console.log(res.toString())    // execSync returns stdout directly

        return 0
        // https://stackoverflow.com/questions/32874316/node-js-accessing-the-exit-code-and-stderr-of-a-system-command If no err: status guaranteed to be 0

    } catch(err) {
        fileError(err)
    }
    
}

function validateFilePresence(filePath) {
    if (!existsSync(filePath)) {
        console.log(`File ${filePath} does not exist on the system!`)
        return false
    }
    return true
}

function fileError(err, msg) {

    console.log(err.message.toString())
    console.log("Terminal output:")
    console.log(err.stdout.toString())
    console.log(err.stderr.toString())

    throw new Error(msg, { cause: err.message.toString() })
}

module.exports = {
    fileCreate, fileDelete, fileUpload, latexCompile
}
