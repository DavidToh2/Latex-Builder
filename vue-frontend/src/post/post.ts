import { getFormData } from "@/aux"
const URL_DEV = 'http://localhost:3000'
const URL_PROD = import.meta.env.VITE_URL_PRODUCTION as string
var BASE_URL : string = URL_PROD
if (import.meta.env.MODE == 'development') {
    BASE_URL = URL_DEV
}
export { BASE_URL }

export async function post(s : string, url : string) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: s,
        credentials: 'include'
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

export async function postJSON(j : {[key : string] : any}, url : string) {

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(j),
        credentials: 'include'
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

    var reqBody = getFormData(f) as { [key : string] : string | number | Date | null }

    console.log(reqBody)

    reqBody['fn'] = descriptor

    if (descriptor == "qn-setNew" || descriptor == "qn-setUpdate") {
        var now = new Date()
        reqBody['lastModified'] = now
    
        reqBody['solution'] = ''        // Temporary patch
    }
    
    const response = await postJSON(reqBody, url)
    return response
}

export async function postGetFile(data : { [key : string] : string}, url : string) {

    const response = await fetch(url, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/pdf, image/png, image/svg+xml'
        },
        body: JSON.stringify(data),
        credentials: 'include'
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }
        return response as Response
    })
    .catch((error) => console.log('post.ts/postGetFile returned error ', error)) as Response

    return response // Returns a blob
}
