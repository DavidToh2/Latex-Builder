echo "Bash: Compiling latex file at $1 with output directory $2..."
latexfilename=$1
latexdirectory=$2
latex -file-line-error -interaction=errorstopmode -output-directory=$latexdirectory $latexfilename