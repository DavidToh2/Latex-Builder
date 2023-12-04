#!/bin/sh
pdflatex -output-directory='/app/public/files/welcome' -file-line-error '/app/public/files/welcome/welcome.tex' | egrep -i ".*:[0-9]*:.*" || true