import React, { useEffect, useState } from 'react'
import './Home.css'
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
import { fetchStoryDetails, getStoriesByCategory, getYourStories } from '../../apis/storyApis';
import { shareStory } from '../../apis/shareApis';
import { likeDislikeStory } from '../../apis/likesApis';
import { addRemoveBookmarks } from '../../apis/bookmarksApis';
import toastr from 'toastr';
import 'toastr/build/toastr.css';
import SignInModalPage from '../SignInModalPage/SignInModalPage';
import LikesCount from '../LikesCount/LikesCount';
import SignInModalPage2 from '../SignInModalPage/SignInModalPage2';

const Home = () => {

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
    const [stories, setStories] = useState([])
    const [yourStories, setYourStories] = useState([])
    const [storySlides, setStorySlides] = useState([])
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [storyId, setStoryId] = useState('662ff42a1ec4c3d990eea48a');
    const [visibleItems, setVisibleItems] = useState(4);

    useEffect(() => {
        async function fetchYourStories() {

            try {
                const payload = {
                    userId: user_Id
                }
                const response = await getYourStories(payload)
                const responseData = response.stories
                setYourStories(responseData)
            } catch (error) {
                console.error('Error fetching stories:', error);
            }
        }
        fetchYourStories()
    }, [])

    useEffect(() => {
        async function fetchAllStories() {

            try {
                const categoryPayload = {
                    category: selectedCategory || 'all'
                };
                const response = await getStoriesByCategory(categoryPayload);
                const responseData = response.stories;
                setStories(responseData);
            } catch (error) {
                console.error('Error fetching stories:', error);
            }
        }

        fetchAllStories();
    }, [selectedCategory]);

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

    const handleCategoryClick = (category) => {
        
        setSelectedCategory(category);
    };

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
            <div>
                <div className='filterByCategory'>
                    <button className={`allCategory ${selectedCategory === 'all' ? 'thisIsSelected' : ''}`} onClick={() => handleCategoryClick('all')}>
                        <h1>
                            All
                        </h1>
                    </button>
                    <button className={`foodCategory ${selectedCategory === 'food' ? 'thisIsSelected' : ''}`} onClick={() => handleCategoryClick('food')}>
                        <h1>
                            Food
                        </h1>
                    </button>
                    <button className={`healthCategory ${selectedCategory === 'health and fitness' ? 'thisIsSelected' : ''}`} onClick={() => handleCategoryClick('health and fitness')}>
                        <h1>
                            Health and Fitness
                        </h1>
                    </button>
                    <button className={`travelCategory ${selectedCategory === 'travel' ? 'thisIsSelected' : ''}`} onClick={() => handleCategoryClick('travel')}>
                        <h1>
                            Travel
                        </h1>
                    </button>
                    <button className={`moviesCategory ${selectedCategory === 'movies' ? 'thisIsSelected' : ''}`} onClick={() => handleCategoryClick('movies')}>
                        <h1>
                            Movies
                        </h1>
                    </button>
                    <button className={`educationCategory ${selectedCategory === 'education' ? 'thisIsSelected' : ''}`} onClick={() => handleCategoryClick('education')}>
                        <h1>
                            Education
                        </h1>
                    </button>
                </div>

                <div className='allCategoriesList'>
                    {selectedCategory !== 'food' && selectedCategory !== 'health and fitness' && selectedCategory !== 'travel' && selectedCategory !== 'movies' && selectedCategory !== 'education' && user_Id && (
                        <div className='storiesContainer'>
                            <h1 className='dmsans-bold'>Your Stories</h1>
                            <div className='storiesImgAndBtnDiv'>
                                <div className='storiesImg'>
                                    {yourStories.slice(0, visibleItems).map((story, index) => (
                                        <div className='storiesImgAndEditDiv'>
                                            {story.length === 0 ? (
                                                <h6 className='dmsans-medium'>No stories Available</h6>
                                            ) : (
                                                <div key={index}>
                                                    {story.slides.length > 0 && (
                                                        <div onClick={openSlideModal} className='imageView' style={{ backgroundImage: `url(${story.slides[0].image})` }} key={story.slides[0]._id}>
                                                            <div className='imageText'>
                                                                <h5>{story.slides[0].heading}</h5>
                                                                <p>{story.slides[0].description}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            {user_Id === story.userId ? (
                                                <div className='storyEditBtn'>
                                                    <EditStory storyId={story._id} />
                                                </div>
                                            ) : (
                                                <div></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {yourStories.length > visibleItems && (
                                    <button className='btnSeeMore dmsans-black' onClick={handleSeeMore}>See more</button>
                                )}
                            </div>
                        </div>
                    )}

                    {stories.map((story, index) => (
                        <div className='storiesContainer' key={index}>
                            <h1 style={{ paddingTop: '2rem' }} className='dmsans-bold'>{story.category}</h1>
                            {story.stories.length === 0 ? (
                                <h6 className='dmsans-medium'>No stories Available</h6>
                            ) : (
                                <div className='storiesImgAndBtnDiv'>
                                    <div className='storiesImg'>
                                        {story.stories.slice(0, visibleItems).map((item, index) => (

                                            <div key={index} className='storiesImgAndEditDiv'>
                                                {item.slides.length > 0 && (
                                                    <div onClick={openSlideModal} className='imageView' style={{ backgroundImage: `url(${item.slides[0].image})` }} key={item.slides[0].id}>
                                                        <div className='imageText'>
                                                            <h5>{item.slides[0].heading}</h5>
                                                            <p>{item.slides[0].description}</p>
                                                        </div>
                                                    </div>
                                                )}
                                                {user_Id === item.userId ? (
                                                    <div className='storyEditBtn'>
                                                        <EditStory storyId={item._id} />
                                                    </div>
                                                ) : (
                                                    <div></div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    {story.stories.length > visibleItems && (
                                        <button className='btnSeeMore dmsans-black' onClick={handleSeeMore}>See more</button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div >
    )
}

export default Home