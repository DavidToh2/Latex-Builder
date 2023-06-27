
const URL_DEV = 'localhost:3000'
const URL_PROD = import.meta.env.VUE_APP_URL_PRODUCTION as string
export var BASE_URL : string
if (import.meta.env.MODE == 'development') {
    BASE_URL = URL_DEV
} else {
    BASE_URL = URL_PROD
}

export async function post(s : string, url : string) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: s
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }
        return response as Response
    })
    .catch((error) => console.log('post.ts/post returned error ', error)) as Response

    return response
}

export async function postJSON(j : {[key : string] : string | number | Date | null}, url : string) {

    console.log(j)
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
        return response as Response
    })
    .catch((error) => console.log('post.ts/postJSON returned error ', error)) as Response
    
    return response
}

/*
        POSTFORM

        function postForm( HTML Form Element, Target URL, Descriptor of form data being posted )
*/

export async function postForm(f : HTMLFormElement, url : string, descriptor : string) {
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

    reqBody['fn'] = descriptor

    if (descriptor == "qn-setNew" || descriptor == "qn-setUpdate") {
        var now = new Date()
        reqBody['lastModified'] = now
    
        reqBody['solution'] = ''        // Temporary patch
    }

    console.log("Sending...")
    
    const response = await postJSON(reqBody, url)
    return response
}
