export async function postForm(f : HTMLFormElement, url : string) {
    const formc = f.elements as HTMLFormControlsCollection
    const form = Array.from(formc) as HTMLTextAreaElement[]
    var reqBody = {} as { [key : string] : string | number | null }

    for (const element of form) {

        const eName = element.name
        if (eName) {
            const eValue = element.value
            if (eValue) {
                reqBody[eName] = eValue
            }
        }
    }

    console.log("Sending...")
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqBody)
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }
        return response
    })
    .catch((error) => console.log('post.ts returned error ', error))
    
    console.log(response)
    
    return response
}