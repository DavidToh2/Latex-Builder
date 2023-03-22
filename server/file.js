var cp = require('child_processes')

const scriptroot = path.join(__dirname, 'scripts')

function createFile() {

}

function compileLatex() {
    cp.exec(`${scriptroot}/compile_latex.sh`, function(err, stdout, stderr) {

    })
}

function deleteFile() {

}
