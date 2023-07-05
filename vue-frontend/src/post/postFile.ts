import { postJSON } from "./post"
import { BASE_URL } from "./post"
import type { ws } from "@/types/WorksheetTypes"

export async function buildWorksheet(w : ws) {
    const r = w as { [key: string]: any }
    r['fn'] = 'file-build'
    const response = await postJSON(r, `${BASE_URL}/file/compile`)
    const responsejson = await response.json()
    return responsejson
}