import axios from "axios";
const backendUrl = `https://swiptory-server-95r3.onrender.com/api`

export const register = async ({ username, password }) => {
    try {
        const reqUrl = `${backendUrl}/register`
        const reqPayload = { username, password }
        const response = await axios.post(reqUrl, reqPayload)
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const login = async ({ username, password }) => {
    try {
        const reqUrl = `${backendUrl}/login`
        const reqPayload = { username, password }
        const response = await axios.post(reqUrl, reqPayload)
        return response.data
    } catch (error) {
        console.log(error)
    }
}