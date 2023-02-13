var fs = require('fs')

fs.readFile('./list.csv', 'utf-8', (err, data) => {
    if (err) throw err;
    var list = data.split(', ')
    var i = 1
    if (list.length > 1) {
        while (list[i] != i) {
            i += 1
        }                       // i is the smallest id index that doesn't exist as of now
        list.splice(i, 0, i)    // inserts i into index i
    }
})
