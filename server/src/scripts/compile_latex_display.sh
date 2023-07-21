# called by file.js/compileQuestion()
echo "Bash: Compiling latex file at $1 with output directory $2..."
pwd
latexfilename=$1
latexdirectory=$2
latex -file-line-error -interaction=errorstopmode -output-directory=$latexdirectory $latexfilename
pdfcrop $latexdirectory"/preview.dvi"
dvipng -T tight -D 150 $latexdirectory"/preview.dvi" -o $latexdirectory"/preview.png"
echo "Done!"