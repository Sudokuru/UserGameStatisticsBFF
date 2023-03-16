
export async function sendRequestWithBody(url: string, token: string, method: string, body: string):Promise<Response> {
    return await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: body
    });
}

export async function sendRequestWithoutBody(url: string, token: string, method: string):Promise<Response> {
    return await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
    });
}