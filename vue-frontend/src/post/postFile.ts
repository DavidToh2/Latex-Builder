import { postJSON, postGetFile } from "./post"
import { BASE_URL } from "./post"
import type { ws } from "@/types/WorksheetTypes"

export async function buildWorksheet(w : ws) {
    const r = w as { [key: string]: any }
    r['fn'] = 'file-build'
    console.log("Building worksheet...")
    console.log(r)
    const response = await postJSON(r, `${BASE_URL}/file/build`)
    const responsejson = await response.json()
    return responsejson
}

export async function getPDF(n : string) {
    const r = {
        name: n,
        fn: 'file-get-pdf'
    } as { [key: string] : string }
    if (n == '') {
        r.name = 'welcome'
    }
    const response = await postGetFile(r, `${BASE_URL}/file/get/pdf`)
    const contentType = response.headers.get('Content-Type') as string
    if (contentType == 'application/json') {
        const responsejson = await response.json()
        return responsejson
    } else {
        const responseblob = await response.blob()
        return responseblob
    }
}