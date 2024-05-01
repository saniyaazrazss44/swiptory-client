import React, { useEffect, useState } from 'react'
import { viewLikeCount } from '../../apis/likesApis';

const LikesCount = ({ storyId }) => {

    const [likesCount, setLikesCount] = useState(0);

    useEffect(() => {
        async function fetchTotalLikes() {
            let payload = {
                storyId: storyId
            }
            try {
                const response = await viewLikeCount(payload)
                const responseData = response.likeCount
                setLikesCount(responseData)
            } catch (error) {
                console.log(error)
            }
        }
        fetchTotalLikes()
    }, [])

    return (
        <div>{likesCount}</div>
    )
}

export default LikesCount