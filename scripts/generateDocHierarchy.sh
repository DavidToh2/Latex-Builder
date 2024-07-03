#!/bin/bash
source $1/scripts/base.sh
source $1/scripts/format.sh
source $1/scripts/formatDocNames.sh
touch $docPath/docs-hierarchy.json
printf "[" >> $docPath/docs-hierarchy.json
folders=($docPath/*/)
for folder in ${folders[@]}
do
    foldername=$(basename $folder)
    printf "\n{\n\"text\": \"$foldername\",\n \"items\": [" >> $docPath/docs-hierarchy.json
    files=($folder/*.md)
    for f in "${files[@]::${#files[@]}-1}"
    do
        fname=$(basename "${f}" .md)
        flink=$(format "${fname}")
        printf "{ \"text\": \"$fname\", \"link\": \"/$foldername/$flink\" }\n," >> $docPath/docs-hierarchy.json
    done
    f=${files[-1]}
    fname=$(basename "${f}" .md)
    flink=$(format "${fname}")
    printf "{ \"text\": \"$fname\", \"link\": \"/$foldername/$flink\" }\n]\n}," >> $docPath/docs-hierarchy.json
done
sed -i '$ s/.$//' $docPath/docs-hierarchy.json
printf "]" >> $docPath/docs-hierarchy.json