# called by file.js/compileQuestion()
echo "Bash: Compiling latex file at $1 with output directory $2..."
latexfilename=$1
latexdirectory=$2
latex -file-line-error -interaction=errorstopmode -output-directory=$latexdirectory $latexfilename
dvipng -T tight -D 150 $latexdirectory"/preview.dvi" -o $latexdirectory"/preview.png"
echo "Done!" 