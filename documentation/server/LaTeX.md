# Introduction

This file serves to document the LaTeX functions for the backend server.

Following the `latexbase` installation, 
- Texlive 2023 is now installed at `/usr/local/texlive/2023`;
- Local Texlive settings, as well as custom classes and stylesheets, can be configured at `/usr/local/texlive/texmf-local`.

For more details, refer to the [Containers](./Containers.md) documentation.

- [Introduction](#introduction)
- [LaTeX Packages](#latex-packages)
  - [Installed packages](#installed-packages)
  - [Custom packages](#custom-packages)
- [Building LaTeX code](#building-latex-code)
  - [Document structure](#document-structure)
  - [Script execution](#script-execution)
  - [LaTeX sanitisation](#latex-sanitisation)
  - [Error outputs](#error-outputs)
- [LaTeX Compilation Script](#latex-compilation-script)
  - [Generating images](#generating-images)

# LaTeX Packages

The list of latex packages contained in the **basic scheme** can be found [here](https://gist.github.com/zr-tex8r/86b3b28f6bf21e0c24b151ce10840387).

We run the following code to install packages, then link executable packages (such as dvipng and pdfcrop) to our system path. (Note that without the second step, `bash` will not be able to find the location of dvipng.)
```
RUN tlmgr install <package>

RUN tlmgr path add
```

`tlmgr info` can also be used to generate a list of all available packages:
```sh
tlmgr info --only-installed --data name > latex-packages.txt
```

## Installed packages

The following packages are included in every LaTeX compilation:

- matholympiad (custom)
- amsmath
- enumitem (installed)
- geometry
- graphicx
- fancyhdr

The following additional packages were installed to facilitate common use cases in document editing.

- gensymb
- multirow
- caption
- mathtools

The following packages were installed to facilitate compilation of LaTeX into images, to serve as previews. (Note that testing has determined that `png` images seem to display a lot more accurately, compared to their `svg` counterparts.) Usage is detailed below.

- dvisvgm
- dvipng
- pdfcrop

## Custom packages

Our custom package, `matholympiad.sty`, is transferred from `/app/public/packages` in our build context into the `texmf-local` package directory on container build.

```
RUN mv /app/public/packages/* /usr/local/texlive/texmf-local/tex/latex/local
```

# Building LaTeX code

## Document structure

All LaTeX documents can roughly be divided into the following segments:

| Section         | Function                                                                                                                                                   |
|-----------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| documentClass   | General template dependent on the type of document generated.<br />In most cases, this is just `\documentclass[a4paper,twoside]{article}`.                 |
| Packages        | List of packages to be used. Usually consists of three parts:<li>Default packages;</li> <li>Template packages;</li> <li>User-added packages.</li>|
| Page settings   | Settings for page dimensions, including:<li>Settings for the `geometry` package dictating page size;</li> <li>Header and footer settings and content.</li> |
| Text settings   | Settings for text. For now, this is just paragraph indentation and spacing.                                                                                |
| Setup           | Additional setup commands, including image directory.                                                                                                      |
| Title           | Title, author and date.                                                                                                                                    |
| beginDocument   | Begin document, set the first page as fancy, and generate the title.                                                                                       |
| Preamble        | Template preamble (e.g. cover page).                                                                                                                       |
| Body            | User-generated content.                                                                                                                                    |
| endDocument     | End of document.                                                                                                                                           |

All user inputs are parsed by `file.js` from JSON into LaTeX code.

## Script execution

Only registered users can use the LaTeX compiler. LaTeX compilation will occur in the folder `/app/public/files/<user ID>`. All script execution is handled by `file.js`.

Parsed user inputs are first concatenated and piped into a `.tex` file:
```js
const fs = require('fs')
fs.writeFileSync(`${filePath}/output.tex`, output)
```

The LaTeX compilation script is then run synchronously:
```js
const cp = require('cp')
const res = cp.execSync(`./compile_latex.sh output.tex ${filePath}`, { cwd: scriptroot })
```

The output file can then be fetched from the server via a separate API call.

## LaTeX sanitisation

We implement a few basic input parsers in `aux.js` to check through our user's inputted LaTeX code. Due to the type-unsafeness of Javascript, all parsers check that the parsed user inputs are strings, to ensure that the request data received by the server is genuine.
- `parseStrings()` is used to check that inputs which should only contain text, such as headers and footers, only contain text.
- `parseAlphanumericstrings()` is used to check that settings which should normally only allow alphanumeric characters, such as size, only contain alphanumeric characters.
- `parseStringBrackets()` is used to check that brackets in raw LaTeX are correctly matched, to prevent attempts at code injection.

## Error outputs

Error output from bash `cp.execSync()` works as follows:

- `err.message.toString()`: 'Command failed'
- `err.stdout.toString()`: Returns the raw output to console. In this case, all LaTeX output goes here. (This is what we want.)
- `err.stderr.toString()`: Returns the NodeJS Error object. Note that this object also contains stdout as `Error.cause`.

Note that, if no error occurs, `cp.execSync()` is guaranteed to exit with status 0.

[Reference](https://stackoverflow.com/questions/32874316/node-js-accessing-the-exit-code-and-stderr-of-a-system-command)

In the event of a script error, we catch it and pass the `stdout.toString()` as a `UserError` back to the router:
```js
catch(err) {
    throw new UserError('Failed to compile latex!', err.stdout.toString())
}
```

# LaTeX Compilation Script

We may simply use the **latex** or **pdflatex** command-line tools to compile `.tex` documents into either `.dvi` or `.pdf` format, respectively:
```sh
pdflatex -file-line-error -interaction=nonstopmode -output-directory=$2 $1
```
- `-file-line-error` displays file names and line numbers for all errors
- `-interaction=nonstopmode`: minimises user interaction by continuing past any error messages (up to 100 errors). Useful for automation.

[Reference](https://tex.stackexchange.com/questions/27878/pdflatex-bash-script-to-supress-all-output-except-error-messages)

The document compilation script is found in `compile_latex.sh`.

The image compilation script is found in `compile_latex_display.sh`.

## Generating images

Our LaTeX content is first piped into a blank document template, with no headers, footers nor title.
- Document class: Article
- Packages: All default packages
- `\pagestyle{empty}` (disables titles)

We use **latex** to generate a `.dvi` file in a similar manner to above.

Next, we use **dvipng** to convert the `.dvi` file into a `.png` file.
```sh
dvipng -T tight -D 150 $latexdirectory"/preview.dvi" -o $latexdirectory"/preview.png"
```
- Note that absolute paths are required for the input and output files, as the script runs in the `/app/src/scripts` folder.
- The `-T tight` option crops the `.dvi` file to be as small as possible.
- The `-D 150` option allows us to set the resolution of the file.

Documentation can be found [here](https://mirror.kku.ac.th/CTAN/systems/doc/dvipng/dvipng.pdf) or at the CTAN page.

Alternatives include using **dvisvgm** to convert the `.dvi` file into a `.svg` file, as well as using **pdfcrop**.