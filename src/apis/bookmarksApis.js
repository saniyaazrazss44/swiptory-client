import axios from "axios";
const backendUrl = `http://localhost:3003/api/bookmark`

export const addRemoveBookmarks = async ({ userId, storyId }) => {
    try {
        const reqUrl = `${backendUrl}/addRemoveBookmarks`
        const reqPayload = { userId, storyId }
        const token = localStorage.getItem('token');

        const config = {
            headers: {
                Authorization: token
            }
        };
        const response = await axios.post(reqUrl, reqPayload, config)
        console.log(response)
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const getBookmarks = async ({ userId }) => {
    try {
        const reqUrl = `${backendUrl}/getBookmarks`
        const reqPayload = { userId }
        const token = localStorage.getItem('token');

        const config = {
            headers: {
                Authorization: token
            }
        };
        const response = await axios.post(reqUrl, reqPayload, config)
        return response.data
    } catch (error) {
        console.log(error)
    }
}