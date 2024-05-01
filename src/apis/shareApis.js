import axios from "axios";
const backendUrl = `http://localhost:3003/api/share`

export const shareStory = async ({ storyId }) => {
    try {
        const reqUrl = `${backendUrl}/shareStory`
        const reqPayload = { storyId }
        const response = await axios.post(reqUrl, reqPayload)
        console.log(response)
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const viewStory = async ({ storyId }) => {
    try {
        const reqUrl = `${backendUrl}/viewStory/${storyId}`;
        const response = await axios.get(reqUrl);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};