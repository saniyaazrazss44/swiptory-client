import axios from "axios";
const backendUrl = `http://localhost:3003/api/like`

export const likeDislikeStory = async ({ userId, storyId }) => {
    try {
        const reqUrl = `${backendUrl}/likeDislikeStory`
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

export const viewLikeCount = async ({ storyId }) => {
    try {
        const reqUrl = `${backendUrl}/viewLikeCount`
        const reqPayload = { storyId }
        const response = await axios.post(reqUrl, reqPayload)
        console.log(response)
        return response.data
    } catch (error) {
        console.log(error)
    }
}