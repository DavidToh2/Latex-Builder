# called by file.js/buildDocument()
pdflatex -file-line-error -interaction=nonstopmode -output-directory=$2 $1 # | egrep ".*:[0-9]*:.*|LaTeX Warning:"

# egrep: only output error messages and warnings
