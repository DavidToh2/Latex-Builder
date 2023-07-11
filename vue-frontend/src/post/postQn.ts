
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
    const response = await postForm(f, `${BASE_URL}/database/get`, 'qn-get') as Response
    const responsejson = await response.json()
    return responsejson
}

export async function questionDelete(f : HTMLFormElement, ID : string) {
    const response = await postForm(f, `${BASE_URL}/database/delete/${ID}`, 'qn-delete') as Response
    const responsejson = await response.json()
    return responsejson
}

export async function questionSave(f : HTMLFormElement, ID : string) {
    // If the question is a new question:
    if (ID == '0') {
        const response = await postForm(f, `${BASE_URL}/database/set/new`, 'qn-setNew') as Response
        const responsejson = await response.json()
        return responsejson
    // If the question is an existing question:
    } else {
        var response = await postForm(f, `${BASE_URL}/database/set/update/${ID}`, 'qn-setUpdate') as Response
        const responsejson = await response.json()
        return responsejson
    }
}

export async function questionGetPerms(ID : string) {
    const j = {
        fn: 'qn-getPerms'
    }
    const response = await postJSON(j, `${BASE_URL}/database/get/perms/${ID}`) as Response
    const responsejson = await response.json()
    return responsejson
}

export async function questionUpdatePerms(
    ID : string,
    type : 'modifyUsers' | 'modifyGroups' | 'readUsers' | 'readGroups' | 'public', 
    action : 'add' | 'remove', name : string | null
    ) {
    const j = {
        type: type,
        action: action,
        name: name,
        fn: 'qn-setPerms'
    }
    const response = await postJSON(j, `${BASE_URL}/database/set/perms/${ID}`) as Response
    const responsejson = await response.json()
    return responsejson
}