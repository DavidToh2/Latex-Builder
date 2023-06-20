
import type { qn } from '@/types/Types'
import { postForm, postJSON } from '@/post/post'
import { BASE_URL } from '@/post/post'

/*
        DATABASE FUNCTIONS

        questionGet(): Searches the database for a question
            - Returns qn[]
        questionDelete(): Delete a question from the database
            - Returns 
        questionSave(): Save question edits to the database. This includes both new and existing questions
*/


export async function questionGet(f : HTMLFormElement) {         // Submits search query and uses it to populate store
    const response = await postForm(f, `http://${BASE_URL}/database/get`, 'qn-get') as Response
    const responsejson = await response.json() as qn[]
    return responsejson
}

export async function questionDelete(f : HTMLFormElement, displayID : string) {
    const response = await postForm(f, `http://${BASE_URL}/database/delete/${displayID}`, 'qn-delete') as Response
    const responsejson = await response.json()
    return responsejson
}

export async function questionSave(f : HTMLFormElement, displayID : string) {
    // If the question is a new question:
    if (displayID == '0') {
        const response = await postForm(f, `http://${BASE_URL}/database/set/new`, 'qn-setNew') as Response
        const responsejson = await response.json()
        return responsejson
    // If the question is an existing question:
    } else {
        var response = await postForm(f, `http://${BASE_URL}/database/set/update/${displayID}`, 'qn-setUpdate') as Response
        const responsejson = await response.json()
        return responsejson
    }
}