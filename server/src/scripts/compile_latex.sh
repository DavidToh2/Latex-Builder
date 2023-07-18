# called by file.js/buildDocument()
pdflatex -file-line-error -interaction=nonstopmode -output-directory=$2 $1 # | egrep ".*:[0-9]*:.*|LaTeX Warning:"

# -interaction=nonstopmode: minimises user interaction by continuing past any error messages (up to 100 errors). Useful for automation
# -file-line-error: indicates file name and line no. of errors
# egrep: only output error messages and warnings
# See https://tex.stackexchange.com/questions/27878/pdflatex-bash-script-to-supress-all-output-except-error-messages for more info.