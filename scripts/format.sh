format() {
    echo $1 | tr '[A-Z]' '[a-z]' | tr ' ' '-'
}