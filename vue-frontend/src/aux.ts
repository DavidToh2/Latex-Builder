function numberToPixels(n : number) {
    const s = n.toString()
    return s + "px"
}
function pixelsToNumber(s : string) {
    const t = s.substring(s.length - 2)
    if (t != "px") {
        return 0
    }
    const n = s.substring(0, s.length - 2)
    return parseInt(n)
}

export {numberToPixels, pixelsToNumber}