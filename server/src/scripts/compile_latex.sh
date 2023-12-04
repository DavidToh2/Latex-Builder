echo "Bash: Compiling latex file at $1 with output directory $2..."
latexfilename=$1
latexdirectory=$2
pdflatex -file-line-error -interaction=nonstopmode -output-directory=$latexdirectory $latexfilename | egrep ".*:[0-9]*:.*|LaTeX Warning:" || true

# egrep: only output error messages and warnings