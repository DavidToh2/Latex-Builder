const cp = require('child_process')
const path = require('path')
const fs = require('fs')

const dbTemplate = require('./db/db-file')
const aux = require('./aux')

const { UserError, DatabaseError, ServerError, newError } = require('./express-classes/error')

const scriptroot = path.join(__dirname, 'scripts')
const fileroot = path.join(__dirname, '../public/files')

function folderCreate(uID, type) {
    var filePath = `${fileroot}/${uID}`
    switch(type) {
        case 'pdf':
            filePath = filePath + '/document'
        break
        case 'image':
            filePath = filePath + '/image'
        break
    }
    if (fs.existsSync(filePath)) {
        return filePath
    } else {
        try {
            fs.mkdirSync(filePath, { recursive: true })
            return filePath
        } catch(err) {
            newError(err, `Failed to create folder ${filePath}!`)
        }
    }
}

async function buildDocument(data, uID) {

    var filePath = ''
    var output = ''

    // Build document output text

    try {
        console.log("Attempting to build document...")
        output = await documentOutput(data)
    } catch(err) {
        newError(err, 'Failed to parse document data in build!')
    }

    // Write document into file

    try {
        filePath = folderCreate(uID, 'pdf')
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
        return 0
    } catch(err) {
        fileError(err)
        throw new UserError('Failed to compile latex!', err.stdout.toString())

    }
}

async function buildPreview(data, uID) {

    var filePath = ''
    var output = ''

    // Build document for outputting preview

    try {
        console.log('Attempting to build preview...')
        output = previewOutput(data)
        // console.log(output)
    } catch(err) {
        newError(err, 'Failed to parse document data in preview!')
    }

    // Write data into file

    try {
        filePath = folderCreate(uID, 'image')
        console.log('Attempting to write preview to file...')
        fs.writeFileSync(`${filePath}/preview.tex`, output)
    } catch(err) {
        newError(err, `Failed to write to preview file ${filePath}/preview.tex!`)
    }

    // Compile latex preview

    try {
        console.log('Attempting to compile preview...')
        const res1 = cp.execSync(`./compile_latex_display.sh preview.tex ${filePath}`, { cwd: scriptroot } )
        console.log(res1.toString())
        const res2 = cp.execSync(`./display_latex.sh ${filePath}`, { cwd: scriptroot } )
        console.log(res2.toString())
        return 0
    } catch(err) {
        fileError(err)
        throw new UserError('Failed to compile latex preview!', err.stdout.toString())
    }

}

const DEFAULT_PACKAGES = ["matholympiad", "amsmath", "enumitem", "geometry", "graphicx", "fancyhdr"]
const DEFAULT_PACKAGE_STRING = 
`\\usepackage\{matholympiad\}
\\usepackage\{amsmath\}
\\usepackage\{enumitem\}
\\usepackage\{fancyhdr\}
\\usepackage\{graphicx\}
`
const DEFAULT_IMAGE_STRING = 
`\\graphicspath\{\{./images\}\}
`
const BEGIN_DOCUMENT_STRING = 
`\\begin\{document\}
`
const TITLE_FANCYPAGE_STRING = 
`\\maketitle
\\thispagestyle\{fancy\}
`
const END_DOCUMENT_STRING = 
`\\end\{document\}
`

async function documentOutput(data) {

    // Parse document data
    const config = data['config']

        // Get template and populate template settings
    const templateName = config['template']
    aux.parseAlphanumericString(templateName)

    const template = await dbTemplate.getTemplate(templateName)
    const documentClass = template['documentClass']

        // Get additional packages
    const documentPackages = config['packages']
    const templatePackages = template['packages']
    const packages = Array.from(new Set([...templatePackages, ...documentPackages]))

        // Get page settings
    const documentPage = config['page']
    const templatePage = template['page']

        // Get text settings
    const documentText = config['text']
    const templateText = template['text']

        // Get document title 
    const documentTitle = config['title']

        // Get setup
    const documentSetup = config['setup']
    const templateSetup = template['setup']

        // Get preamble
    const templatePreamble = template['preamble']

        // Get worksheet elements
    const bodyElements = data['elements']

    const documentClassString = documentClassOutput(documentClass)
    const packageString = packageOutput(packages)
    const [dimensionString, hfString] = pageOutput(documentPage, templatePage)
    const textString = textOutput(documentText, templateText)
    const setupString = setupOutput(documentSetup, templateSetup)
    const titleString = titleOutput(documentTitle)

    const preambleString = preambleOutput(templatePreamble)
    const bodyString = bodyOutput(bodyElements)

    const s = documentClassString
    + DEFAULT_PACKAGE_STRING
    + packageString
    + dimensionString
    + DEFAULT_IMAGE_STRING
    + hfString
    + textString
    + setupString
    + titleString
    + BEGIN_DOCUMENT_STRING
    + TITLE_FANCYPAGE_STRING
    + preambleString
    + bodyString
    + END_DOCUMENT_STRING

    return s
}

function previewOutput(data) {
    const documentClassString = documentClassOutput('article')

    if (!aux.parseStringBrackets(data)) {
        throw new UserError('Brackets do not match!')
    }

    const s = documentClassString 
    + DEFAULT_PACKAGE_STRING 
    + '\\pagestyle\{empty\}\n'
    + '\\setlength\\parskip\{0.8ex\}\n'
    + '\\setlength\\parindent\{0pt\}\n'
    + BEGIN_DOCUMENT_STRING
    + '\\rule\{\\textwidth\}\{0.1pt\}\n'
    + data 
    + END_DOCUMENT_STRING

    return s
}

function documentClassOutput(documentClass) {
    aux.parseAlphanumericString(documentClass)
    if (documentClass == 'article') {
        return '\\documentclass\[a4paper,twoside\]\{article\}\n\n'
    } else {
        return '\\documentclass\{' + documentClass + '\}\n\n'
    }
}

function packageOutput(packages) {
    var arr = []
    packages.forEach(function(item, index) {
        if (aux.parseAlphanumericString(item)) {
            if (!DEFAULT_PACKAGES.includes(item)) {
                arr.push(`\\usepackage\{${item}\}\n`)
            }
        }
    })
    const packageString = arr.join('')
    return packageString
}

function pageOutput(documentPage, templatePage) {

        // Page margins

    const documentDimensions = documentPage.dimensions
    const templateDimensions = templatePage.dimensions

    var darr = []
    if (aux.parseAlphanumericString(documentDimensions.top)) {
        darr.push(`top=${documentDimensions.top}`)
    } else if (aux.parseAlphanumericString(templateDimensions.top)) {
        darr.push(`top=${templateDimensions.top}`)
    }
    if (aux.parseAlphanumericString(documentDimensions.left)) {
        darr.push(`left=${documentDimensions.left}`)
    } else if (aux.parseAlphanumericString(templateDimensions.left)) {
        darr.push(`left=${templateDimensions.left}`)
    }
    if (aux.parseAlphanumericString(documentDimensions.bottom)) {
        darr.push(`bottom=${documentDimensions.bottom}`)
    } else if (aux.parseAlphanumericString(templateDimensions.bottom)) {
        darr.push(`bottom=${templateDimensions.bottom}`)
    }
    if (aux.parseAlphanumericString(documentDimensions.right)) {
        darr.push(`right=${documentDimensions.right}`)
    } else if (aux.parseAlphanumericString(templateDimensions.right)) {
        darr.push(`right=${templateDimensions.right}`)
    }
    const dstring = '\\usepackage\[' + darr.join(',') + '\]\{geometry\}\n'

        // Page headers and footers

    var hfarr = []

    hfarr.push('\\pagestyle\{fancy\}\n')
    hfarr.push('\\fancyhf\{\}\n')

    const documentHeader = documentPage.header
    const templateHeader = templatePage.header
    const documentFooter = documentPage.footer
    const templateFooter = templatePage.footer

    var hleft = templateHeader.left
    if (aux.parseString(documentHeader.left)) {
        hleft = documentHeader.left
    }
    var hmiddle = templateHeader.middle
    if (aux.parseString(documentHeader.middle)) {
        hmiddle = documentHeader.middle
    }
    var hright = templateHeader.right
    if (aux.parseString(documentHeader.right)) {
        hright = documentHeader.right
    }
    var hthickness = templateHeader.thickness
    if (aux.parseAlphanumericString(documentHeader.thickness)) {
        hthickness = documentHeader.thickness
    }

    var fleft = templateHeader.left
    if (aux.parseString(documentFooter.left)) {
        fleft = documentHeader.left
    }
    var fmiddle = templateHeader.middle
    if (aux.parseString(documentFooter.middle)) {
        fmiddle = documentHeader.middle
    }
    var fright = templateHeader.right
    if (aux.parseString(documentFooter.right)) {
        fright = documentHeader.right
    }
    var fthickness = templateFooter.thickness
    if (aux.parseAlphanumericString(documentFooter.thickness)) {
        fthickness = documentFooter.thickness
    }

    const pageno = documentPage.pageNumber
    const pdisplay = pageno.display
    const pposition = pageno.position
    if (!['header', 'footer', 'none'].includes(pdisplay)) {
        throw new ServerError(`Sanitisation check failed!`, `Illegal values detected!`)
    }
    if (!['LORE', 'middle', 'ROLE'].includes(pposition)) {
        throw new ServerError(`Sanitisation check failed!`, `Illegal values detected!`)
    }
    switch(pdisplay) {
        case 'header':
            switch(pposition) {
                case 'LORE':
                    hleft = '\\thepage'
                break
                case 'middle':
                    hmiddle = '\\thepage'
                break
                case 'ROLE':
                    hright = '\\thepage'
                break
                default:
                    throw new ServerError(`Sanitisation check failed!`, `Illegal values detected!`)
                break
            }
        break
        case 'footer':
            switch(pposition) {
                case 'LORE':
                    fleft = '\\thepage'
                break
                case 'middle':
                    fmiddle = '\\thepage'
                break
                case 'ROLE':
                    fright = '\\thepage'
                break
                default:
                    throw new ServerError(`Sanitisation check failed!`, `Illegal values detected!`)
                break
            }
        break
        case 'none':

        break
        default:
            throw new ServerError(`Sanitisation check failed!`, `Illegal values detected!`)
        break
    }
    
        // Header content

    if (aux.parseString(hleft)) {
        hfarr.push(`\\fancyhead\[LO, RE\]\{${hleft}\}\n`)
    }
    if (aux.parseString(hmiddle)) {
        hfarr.push(`\\fancyhead\[C\]\{${hmiddle}\}\n`)
    }
    if (aux.parseString(hright)) {
        hfarr.push(`\\fancyhead\[RO, LE\]\{${hright}\}\n`)
    }

        // Footer content

    if (aux.parseString(fleft)) {
        hfarr.push(`\\fancyfoot\[LO, RE\]\{${fleft}\}\n`)
    }
    if (aux.parseString(fmiddle)) {
        hfarr.push(`\\fancyfoot\[C\]\{${fmiddle}\}\n`)
    }
    if (aux.parseString(fright)) {
        hfarr.push(`\\fancyfoot\[RO, LE\]\{${fright}\}\n`)
    }

        // Header and footer thickness

    if (aux.parseAlphanumericString(fthickness)) {
        hfarr.push(`\\renewcommand\{\\footrulewidth\}\{${fthickness}\}\n`)
    }
    if (aux.parseAlphanumericString(hthickness)) {
        hfarr.push(`\\renewcommand\{\\headrulewidth\}\{${hthickness}\}\n`)
    }

    const hfstring = hfarr.join('')
    return [dstring, hfstring]
}

function textOutput(documentText, templateText) {
    var arr = []

    var pspacing = templateText.paragraphSpacing
    if (aux.parseAlphanumericString(documentText.paragraphSpacing)) {
        pspacing = documentText.paragraphSpacing
    }
    var pindent = templateText.paragraphIndent
    if (aux.parseAlphanumericString(documentText.paragraphIndent)) {
        pindent = documentText.paragraphIndent
    }

    if (aux.parseAlphanumericString(pspacing)) {
        arr.push(`\\setlength\\parskip\{${pspacing}\}\n`)
    }
    if (aux.parseAlphanumericString(pindent)) {
        arr.push(`\\setlength\\parindent\{${pindent}\}\n`)
    }

    const tstring = arr.join('')
    return tstring
}

function setupOutput(documentSetup, templateSetup) {
    var arr = []
    if (aux.parseStringBrackets(documentSetup)) {
        arr.push(documentSetup)
    }
    if (aux.parseStringBrackets(templateSetup)) {
        arr.push(templateSetup)
    }
    const setupString = arr.join('')
    return setupString
}

function titleOutput(t) {
    var arr = []
    const title = t.title
    const author = t.author
    const date = t.date
    if (aux.parseString(title)) {
        arr.push(`\\title\{${title}\}\n`)
    } else {
        arr.push(`\\title\{\}\n`)
    }
    if (aux.parseString(author)) {
        arr.push(`\\author\{${author}\}\n`)
    } else {
        arr.push(`\\author\{\}\n`)
    }
    if (aux.parseString(date)) {
        arr.push(`\\date\{${date}\}\n`)
    } else {
        arr.push(`\\date\{\}\n`)
    }

    const titleString = arr.join('')
    return titleString
}

function preambleOutput(templatePreamble) {
    if (aux.parseStringBrackets(templatePreamble)) {
        return templatePreamble
    } else {
        return ''
    }
}

function bodyOutput(body) {
    var enumState = 'none'
    var arr = []
    body.forEach(function(item, index) {

        switch(item.type) {
            case 'qn':
                if (enumState == 'none') {
                    arr.push(item.body.question)
                } else {
                    arr.push('\\item ' + item.body.question)
                }
            break
            case 'latex':
                arr.push(latexOutput(item.body))
            break
            case 'latexHeading':
                arr.push(latexHeadingOutput(item.body))
            break
            case 'latexEnum':
                [nextEnum, newEnumStatus] = latexEnumOutput(item.body, enumState)
                enumState = newEnumStatus
                arr.push(nextEnum)
            break
        }
    })

    if (enumState != 'none') {
        arr.push(`\\end\{${enumState}\}`)
    }
    const bodyString = arr.join('\n\n')
    return bodyString
}

function latexOutput(latex) {
    if (aux.parseStringBrackets(latex.text)) {
        return latex.text
    } else {
        return ''
    }
}

function latexHeadingOutput(latexHeading) {
    var lhstring = ''
    if (!['section', 'subsection', 'subsubsection'].includes(latexHeading.type)) {
        throw new ServerError(`Sanitisation check failed!`, `Illegal values detected!`)
    }
    if (aux.parseStringBrackets(latexHeading.text)) {
        switch(latexHeading.type) {
            case 'section':
                lhstring = `\\section\{${latexHeading.text}\}`
            break
            case 'subsection':
                lhstring = `\\subsection\{${latexHeading.text}\}`
            break
            case 'subsubsection':
                lhstring = `\\subsubsection\{${latexHeading.text}\}`
            break
        }
    }
    return lhstring
}

function latexEnumOutput(latexEnum, oldEnumStatus) {
    var arr = []
    var newEnumStatus = 'none'
    if (!['start', 'startAt', 'resume', 'stop'].includes(latexEnum.behaviour)) {
        throw new ServerError(`Sanitisation check failed!`, `Illegal values detected!`)
    }
    if (!['numeric', 'alphabetic', 'roman', 'bullet', 'dash', 'arrow'].includes(latexEnum.type)) {
        throw new ServerError(`Sanitisation check failed!`, `Illegal values detected!`)
    }

    if (oldEnumStatus == 'itemize') {
        arr.push('\\end\{itemize\}\n')
    } else if (oldEnumStatus == 'enumerate') {
        arr.push('\\end\{enumerate\}\n')
    }

    if (latexEnum.behaviour == 'stop') {
        newEnumStatus = 'none'

    } else {
        var enumOptions = []

        // Set the label
        var enumLabel = ''
        switch(latexEnum.type) {
            case 'numeric':
                enumLabel = '\\arabic*'
                newEnumStatus = 'enumerate'
            break
            case 'alphabetic':
                enumLabel = '\\alph*'
                newEnumStatus = 'enumerate'
            break
            case 'roman':
                enumLabel = '\\roman*'
                newEnumStatus = 'enumerate'
            break
            case 'bullet':
                enumLabel = ''
                newEnumStatus = 'itemize'
            break
            case 'dash':
                enumLabel = '$-$'
                newEnumStatus = 'itemize'
            break
            case 'arrow':
                enumLabel = '$\\rightarrow$'
                newEnumStatus = 'itemize'
            break
        }

        const t = latexEnum.template
        var enumTemplate = ''
        if (t) {
            enumTemplate = t.replace('LABEL', enumLabel)
        }

        arr.push(`\\begin\{${newEnumStatus}\}\[`)

            // Enum options

        if (enumTemplate) {
            enumOptions.push(`label=${enumTemplate}`)
        }

        switch(latexEnum.behaviour) {
            case 'startAt':
                enumOptions.push(latexEnum.options)
            break
            case 'resume':
                enumOptions.push('resume')
            break
        }

        const enumOptionString = enumOptions.join(',')
        if (enumOptionString) {
            arr.push(enumOptionString)
        }

        arr.push('\]\n')
    }

    const lenumstring = arr.join('')

    return [lenumstring, newEnumStatus]
}

function fileError(err) {
    console.log("Message output:")
    console.log(err.message.toString())
    console.log("stdout output:")       // LaTeX errors come out here
    console.log(err.stdout.toString())
}

module.exports = {
    buildDocument, buildPreview
}
