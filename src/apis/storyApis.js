import axios from "axios";
const backendUrl = `https://swiptory-server-95r3.onrender.com/api/story`

export const addStory = async ({ userId, slides }) => {
    try {
        const reqUrl = `${backendUrl}/addStory`
        const reqPayload = { userId, slides }
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

export const editStory = async ({ userId, storyId, slides }) => {
    try {
        const reqUrl = `${backendUrl}/editStory`
        const reqPayload = { userId, storyId, slides }
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

export const fetchStory = async ({ userId, storyId }) => {
    try {
        const reqUrl = `${backendUrl}/fetchStory`
        const reqPayload = { userId, storyId }
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

export const getAllStories = async () => {
    try {
        const reqUrl = `${backendUrl}/getAllStories`
        const response = await axios.post(reqUrl)
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const fetchStoryDetails = async ({ storyId }) => {
    try {
        const reqUrl = `${backendUrl}/fetchStoryDetails`
        const reqPayload = { storyId }
        const response = await axios.post(reqUrl, reqPayload)
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const getStoriesByCategory = async ({ category }) => {
    try {
        const reqUrl = `${backendUrl}/getStoriesByCategory`
        const reqPayload = { category }
        const response = await axios.post(reqUrl, reqPayload)
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const getYourStories = async ({ userId }) => {
    try {
        const reqUrl = `${backendUrl}/getYourStories`
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