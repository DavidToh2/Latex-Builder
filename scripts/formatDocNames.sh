#!/bin/bash
source $1/scripts/base.sh
source $1/scripts/format.sh
OIFS="$IFS"
IFS=$'\n'
folders=($vitepressPath/*/)
for folder in ${folders[@]}
do
    for f in `find $folder -type f -name "*.md"`
    do
        echo "file = $f"
        fname=$(basename "${f}" .md)
        f1=$(format $fname)
        mv -v "$f" "$folder$f1.md"
    done
done
IFS="$OIFS"