
import { postForm, postJSON } from '@/post/post'
import { BASE_URL } from '@/post/post'
import type { pageData, qn, qnFilters } from '@/types/QuestionTypes'

/*
        DATABASE FUNCTIONS

        questionGet(): Searches the database for a question
            - Returns qn[]
        questionDelete(): Delete a question from the database
            - Returns 
        questionSave(): Save question edits to the database. This includes both new and existing questions
*/

export async function questionGet(filters : qnFilters, s : string, pageData: pageData, dir: string) {         // Submits search query and uses it to populate store
    const j = filters as {[key : string] : any}
    j['question'] = s
    const p = pageData as {[key: string] : any}
    p['direction'] = dir
    const req = { qns: j, page: p, fn: 'qn-get' }
    const response = await postJSON(req, `${BASE_URL}/database/get`) as Response
    const responsejson = await response.json()
    return responsejson
}

export async function questionDelete(ID : string) {
    const j = {
        fn: 'qn-delete'
    }
    const response = await postJSON(j, `${BASE_URL}/database/delete/${ID}`) as Response
    const responsejson = await response.json()
    return responsejson
}

export async function questionSave(q : qn, ID : string) {
    const q2 = q as {[key : string] : any}
    q2['fn'] = 'qn-save'
    // If the question is a new question:
    if (ID == '0') {
        const response = await postJSON(q2, `${BASE_URL}/database/set/new`) as Response
        const responsejson = await response.json()
        return responsejson
    // If the question is an existing question:
    } else {
        var response = await postJSON(q2, `${BASE_URL}/database/set/update/${ID}`) as Response
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