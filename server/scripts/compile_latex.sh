# called by file.js/compileLatex()
echo "Bash: Compiling latex file at $1 with output directory $2..."
pdflatex -output-directory=$2 $1