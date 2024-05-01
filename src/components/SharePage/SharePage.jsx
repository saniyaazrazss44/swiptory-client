import React, { useEffect, useState } from 'react'
import Modal from 'react-modal';
import '../Home/Home.css'
import './SharePage.css'
import toastr from 'toastr';
import 'toastr/build/toastr.css';
import { shareStory } from '../../apis/shareApis'
import { viewStory } from '../../apis/shareApis'
import { useParams } from 'react-router-dom';
import storyCloseImg from '../../assets/icons/story-close-icon.png'
import storyShareImg from '../../assets/icons/share-icon.png'
import bookmarkStoryIcon from '../../assets/icons/story-bookmark-icon.png'
import likeStoryIcon from '../../assets/icons/like-icon.png'
import bookmarkStoryBlueIcon from '../../assets/icons/bookmark-blue-icon.png'
import likeStoryRedIcon from '../../assets/icons/like-red-icon.png'
import slideLeftIcon from '../../assets/icons/slide-left-icon.png'
import slideRightIcon from '../../assets/icons/slide-right-icon.png'
import SignInModalPage from '../SignInModalPage/SignInModalPage';
import LikesCount from '../LikesCount/LikesCount';
import { likeDislikeStory } from '../../apis/likesApis';
import { addRemoveBookmarks } from '../../apis/bookmarksApis';
import SignInModalPage2 from '../SignInModalPage/SignInModalPage2';

const SharePage = () => {

    const { storyId } = useParams();
    const user_Id = localStorage.getItem('userId')
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [modalIsOpen, setIsOpen] = useState(true);
    const [customStyles, setCustomStyles] = useState({
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            zIndex: 1000
        },
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'transparent',
            width: '50%',
            height: '90%',
            borderStyle: 'none',
            borderRadius: '10px',
            fontFamily: 'Inter',
            overflow: 'hidden',
            zIndex: 1001,
            color: '#ffffff',
            padding: '0'
        },
    })
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [storySlides, setStorySlides] = useState([])

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlideIndex(currentSlideIndex => (currentSlideIndex + 1) % storySlides.slides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [storySlides]);

    useEffect(() => {
        const handleSize = () => {
            if (window.innerWidth <= 768) {
                setCustomStyles({
                    ...customStyles, content: {
                        ...customStyles.content,
                        width: '100%',
                        height: '100vh'
                    }
                })
            } else {
                setCustomStyles({
                    ...customStyles, content: {
                        ...customStyles.content,
                        width: '50%',
                        height: '90%'
                    }
                })
            }

        }
        window.addEventListener('resize', handleSize);
        handleSize()

        return () => {
            window.removeEventListener('resize', handleSize);
        };
    }, [])

    useEffect(() => {

        async function fetchStoryData() {
            let storyPayload = {
                storyId: storyId
            }
            try {
                const response = await viewStory(storyPayload)
                const responseData = response.story
                setStorySlides(responseData)
            } catch (error) {
                console.log(error)
            }
        }
        fetchStoryData()
    }, [])

    function closeSlideModal() {
        setIsOpen(false);
        window.location.href = '/'
    }

    const nextSlide = () => {
        setCurrentSlideIndex(currentSlideIndex === storySlides.slides.length - 1 ? 0 : currentSlideIndex + 1);
    };

    const prevSlide = () => {
        setCurrentSlideIndex(currentSlideIndex === 0 ? storySlides.slides.length - 1 : currentSlideIndex - 1);
    };

    if (!storySlides || !storySlides.slides || storySlides.slides.length === 0) {
        return null;
    }

    const handleShareClick = async (storyId) => {
        try {
            let payload = {
                storyId: storyId
            }
            const response = await shareStory(payload)
            console.log(response)
            if (response) {
                let pageURL = `${window.location.origin}/view_story/${storyId}`;
                await navigator.clipboard.writeText(pageURL);
                toastr.success('Link copied to clipboard');
            } else {
                toastr.error('Unable to copy link to clipboard');
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleLikeDisLikeClick = async (storyId) => {
        try {
            let payload = {
                userId: user_Id,
                storyId: storyId
            }
            const response = await likeDislikeStory(payload)
            console.log(response.userId)
            if (user_Id === response.userId) {
                setLiked(true);
                toastr.success(response.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleAddRemoveBookmarkClick = async (storyId) => {
        try {
            let payload = {
                userId: user_Id,
                storyId: storyId
            }
            const response = await addRemoveBookmarks(payload)
            if (user_Id === response.userId) {
                setBookmarked(true);
                toastr.success(response.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <Modal
                isOpen={modalIsOpen}
                style={customStyles}
                contentLabel="Open slide Modal"
            >
                <div className='storyControl'>
                    <div className='storyLeftControl'>
                        <button onClick={prevSlide} className='btnSlideLeftControl'>
                            <img src={slideLeftIcon} alt="left" />
                        </button>
                    </div>
                    <div className='storyRightControl'>
                        <button onClick={nextSlide} className='btnSlideRightControl'>
                            <img src={slideRightIcon} alt="right" />
                        </button>
                    </div>
                </div>

                <div className='storyModalContainerMain'>
                    {storySlides.slides.map((slide, slideIndex) => {
                        return (
                            <div key={slideIndex} style={{ display: slideIndex === currentSlideIndex ? 'flex' : 'none', backgroundImage: `url(${slide.image})` }} className='storyModalContainer'>
                                <div className='storyModalHeader'>
                                    <div className="status-bar" style={{ '--num-status-lines': storySlides.slides.length }}>
                                    {storySlides.slides.map((_, slideIndex) => (
                                            <div key={slideIndex} className="status-line" style={{ '--animation-delay': `${(slideIndex * 5)}s` }}></div>
                                        ))}
                                    </div>
                                    <div className='btnStoryheader'>
                                        <button className='btnCloseStory' onClick={closeSlideModal}>
                                            <img src={storyCloseImg} alt="close" />
                                        </button>
                                        <button className='btnShareStory' onClick={() => handleShareClick(storyId)}>
                                            <img src={storyShareImg} alt="share" />
                                        </button>
                                    </div>
                                </div>
                                <div className='storyModalFooter'>
                                    <div className='storyTextContent dmsans-bold'>
                                        <h3>{slide.heading}</h3>
                                        <p>{slide.description}</p>
                                    </div>
                                    <div className='btnStoryFooter'>
                                        {user_Id ? (
                                            <button className='btnBookmarkStory' onClick={() => handleAddRemoveBookmarkClick(storyId)}>
                                                {bookmarked ? (
                                                    <img src={bookmarkStoryBlueIcon} alt="bookmark" />
                                                ) : (
                                                    <img src={bookmarkStoryIcon} alt="bookmark" />
                                                )}
                                            </button>
                                        ) : (
                                            <SignInModalPage2 />
                                        )}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            {user_Id ? (
                                                <button className='btnLikeStory' onClick={() => handleLikeDisLikeClick(storyId)}>
                                                    {liked ? (
                                                        <img src={likeStoryRedIcon} alt="like" />
                                                    ) : (
                                                        <img src={likeStoryIcon} alt="like" />
                                                    )}
                                                </button>
                                            ) : (
                                                <SignInModalPage />
                                            )}
                                            <div>
                                                <LikesCount storyId={storyId}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Modal>
        </div>
    )
}

export default SharePage