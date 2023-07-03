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

function getFormData(f : HTMLFormElement) {
    const formc = f.elements as HTMLFormControlsCollection
    const form = Array.from(formc) as HTMLTextAreaElement[]
    var data = {} as { [key : string] : string | number | Date | null }

    for (const element of form) {

        const eName = element.name
        if (eName) {
            const eValue = element.value
            if (eValue) {
                data[eName] = eValue
            } else {
                
            }
        }
    }

    return data
}

export { 
    numberToPixels, pixelsToNumber,
    getFormData
}