import React, { useEffect, useState } from 'react'
import '../Home/Home.css'
import Header from '../Header/Header'
import Modal from 'react-modal';
import EditStory from '../EditStory/EditStory'
import storyCloseImg from '../../assets/icons/story-close-icon.png'
import storyShareImg from '../../assets/icons/share-icon.png'
import bookmarkStoryIcon from '../../assets/icons/story-bookmark-icon.png'
import likeStoryIcon from '../../assets/icons/like-icon.png'
import bookmarkStoryBlueIcon from '../../assets/icons/bookmark-blue-icon.png'
import likeStoryRedIcon from '../../assets/icons/like-red-icon.png'
import slideLeftIcon from '../../assets/icons/slide-left-icon.png'
import slideRightIcon from '../../assets/icons/slide-right-icon.png'
import { fetchStoryDetails } from '../../apis/storyApis';
import { shareStory } from '../../apis/shareApis';
import { likeDislikeStory } from '../../apis/likesApis';
import { addRemoveBookmarks, getBookmarks } from '../../apis/bookmarksApis';
import toastr from 'toastr';
import 'toastr/build/toastr.css';
import SignInModalPage from '../SignInModalPage/SignInModalPage';
import LikesCount from '../LikesCount/LikesCount';
import SignInModalPage2 from '../SignInModalPage/SignInModalPage2';

const Bookmarks = () => {

    const user_Id = localStorage.getItem('userId')
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [modalIsOpen, setIsOpen] = useState(false);
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
    const [bookmarkStories, setBookmarkStories] = useState([])
    const [storySlides, setStorySlides] = useState([])
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [storyId, setStoryId] = useState('662ff42a1ec4c3d990eea48a');
    const [visibleItems, setVisibleItems] = useState(4);

    useEffect(() => {
        const fetchAllBookmarks = async () => {
            try {
                let payload = {
                    userId: user_Id
                }
                const response = await getBookmarks(payload)
                const responseData = response.bookmarks
                setBookmarkStories(responseData)
            } catch (error) {
                console.log(error)
            }
        }
        fetchAllBookmarks()
    }, [])

    useEffect(() => {

        async function fetchStoryData() {
            let storyPayload = {
                storyId: storyId
            }
            try {
                const response = await fetchStoryDetails(storyPayload)
                const responseData = response.data
                setStorySlides(responseData)
            } catch (error) {
                console.log(error)
            }
        }
        fetchStoryData()
    }, [storyId])

    function openSlideModal() {
        setIsOpen(true);
    }

    function closeSlideModal() {
        setIsOpen(false);
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
            if (user_Id === response.userId) {
                setLiked(true);
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

    const handleSeeMore = () => {
        setVisibleItems(prev => prev + 4);
    };

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
                                        {[...Array(storySlides.slides.length)].map((_, lineIndex) => (
                                            <div key={lineIndex} className="status-line" style={{ animationDelay: `${lineIndex * 5}s` }}></div>
                                        ))}
                                    </div>
                                    <div className='btnStoryheader'>
                                        <button className='btnCloseStory' onClick={closeSlideModal}>
                                            <img src={storyCloseImg} alt="close" />
                                        </button>
                                        <button className='btnShareStory' onClick={() => handleShareClick('662ff42a1ec4c3d990eea48a')}>
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
                                            <button className='btnBookmarkStory' onClick={() => handleAddRemoveBookmarkClick('662ff42a1ec4c3d990eea48a')}>
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
                                                <button className='btnLikeStory' onClick={() => handleLikeDisLikeClick('662ff42a1ec4c3d990eea48a')}>
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
                                                <LikesCount />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Modal>

            <Header />
            <div className='allCategoriesList'>
                {bookmarkStories.length === 0 ? (
                    <h1 className='dmsans-medium'>You have no Bookmarks</h1>
                ) : (
                    <div className='storiesContainer'>
                        <h1 className='dmsans-bold'>Your Bookmarks</h1>
                        <div className='storiesImgAndBtnDiv' >
                            <div className='storiesImg' >
                                {bookmarkStories.slice(0, visibleItems).map((bookmark, index) => (
                                    <div key={index} className='storiesImgAndEditDiv'>
                                        {bookmark.slides.length > 0 && (
                                            <div onClick={openSlideModal} className='imageView' style={{ backgroundImage: `url(${bookmark.slides[0].image})` }}>
                                                <div className='imageText'>
                                                    <h5>{bookmark.slides[0].heading}</h5>
                                                    <p>{bookmark.slides[0].description}</p>
                                                </div>
                                            </div>
                                        )}
                                        {user_Id === bookmark.userId ? (
                                            <div className='storyEditBtn'>
                                                <EditStory storyId={bookmark._id} />
                                            </div>
                                        ) : (
                                            <div></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {bookmarkStories.length > visibleItems && (
                                <button className='btnSeeMore dmsans-black' onClick={handleSeeMore}>See more</button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Bookmarks