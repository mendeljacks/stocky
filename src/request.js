export const post = async (url, body, token) => {
    const options = {
        method: 'post', 
        payload: JSON.stringify(body), 
        contentType: 'application/json',
        // muteHttpExceptions: true,
        headers: {Authorization: `Bearer ${token}`}
    }
    const response = await UrlFetchApp.fetch(url, options).getContentText()
    return JSON.parse(response)
}
export const get = async (url, headers) => {
    const response = await UrlFetchApp.fetch(url, {headers}).getContentText()
    return JSON.parse(response)
}