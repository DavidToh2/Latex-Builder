import { postJSON } from "./post"
import { BASE_URL } from "./post"
import type { ws } from "@/types/WorksheetTypes"

export async function buildWorksheet(w : ws) {
    const response = await postJSON(w, `${BASE_URL}/file/`)
    const responsejson = await response.json()
    return responsejson
}