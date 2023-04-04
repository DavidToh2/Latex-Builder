import type { qn } from '@/types/Types'

export async function postJSON(j : {[key : string] : string | number | Date | null}, url : string) {

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(j)
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }
        return response
    })
    .catch((error) => console.log('post.ts returned error ', error))
    
    // console.log(response)
    
    return response
}

export async function postForm(f : HTMLFormElement, url : string, fn : string) {
    const formc = f.elements as HTMLFormControlsCollection
    const form = Array.from(formc) as HTMLTextAreaElement[]
    var reqBody = {} as { [key : string] : string | number | Date | null }

    for (const element of form) {

        const eName = element.name
        if (eName) {
            const eValue = element.value
            if (eValue) {
                reqBody[eName] = eValue
            } else {
                
            }
        }
    }

    if (fn == "setNew" || fn == "setUpdate") {
        var now = new Date()
        reqBody['lastModified'] = now
    
        reqBody['solution'] = ''        // Temporary patch
    }

    console.log("Sending...")
    
    const response = await postJSON(reqBody, url)
    return response
}


export async function submitSearch(f : HTMLFormElement) {         // Submits search query and uses it to populate store
    const response = await postForm(f, 'http://localhost:3000/database/get', 'get') as Response
    const responsejson = await response.json() as qn[]
    return responsejson
}

export async function submitDelete(f : HTMLFormElement, displayID : string) {
    const response = await postForm(f, `http://localhost:3000/database/delete/${displayID}`, 'delete') as Response
    const responsejson = await response.json()
    return responsejson
}

export async function submitSave(f : HTMLFormElement, displayID : string) {
    // If the question is a new question:
    if (displayID == '0') {
        const response = await postForm(f, 'http://localhost:3000/database/set/new', 'setNew') as Response
        const responsejson = await response.json()
        return responsejson
    // If the question is an existing question:
    } else {
        var response = await postForm(f, `http://localhost:3000/database/set/update/${displayID}`, 'setUpdate') as Response
        const responsejson = await response.json()
        return responsejson
    }
}