import React, { useEffect, useState } from 'react'
import './AddStory.css'
import Modal from 'react-modal';
import CloseIcon from '../../assets/icons/modal-close-icon.jpg'
import SlideCloseIcon from '../../assets/icons/slide-button-close-icon.png'
import toastr from 'toastr';
import 'toastr/build/toastr.css';
import { addStory } from '../../apis/storyApis';

const AddStory = () => {

    const user_Id = localStorage.getItem('userId')
    const [slides, setSlides] = useState([
        { id: 1, heading: '', description: '', image: '', category: '' },
        { id: 2, heading: '', description: '', image: '', category: '' },
        { id: 3, heading: '', description: '', image: '', category: '' }
    ]);
    const [currentSlide, setCurrentSlide] = useState(1);
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
            backgroundColor: '#ffffff',
            width: '45%',
            borderRadius: '19px',
            fontFamily: 'Inter',
            overflow: 'hidden',
            zIndex: 1001,
        },
    })

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    const handleAddSlide = () => {
        if (slides.length < 6) {
            const newSlideId = slides.length + 1;
            setSlides([...slides, { id: newSlideId, heading: '', description: '', image: '', category: '' }]);
            setCurrentSlide(newSlideId);
        }
    };

    const handleInputChange = (id, field, value) => {

        const updatedSlides = slides.map(slide => {
            if (slide.id === id) {
                return { ...slide, [field]: value };
            }
            return slide;
        });
        setSlides(updatedSlides);
    };

    const handleCategoryChange = (id, value) => {

        const updatedSlides = slides.map(slide => {
            return { ...slide, category: value };
        });
        setSlides(updatedSlides);
    };

    const handleRemoveSlide = (id) => {
        const updatedSlides = slides.filter(slide => slide.id !== id);
        setSlides(updatedSlides);
        const shiftedSlides = updatedSlides.map(slide => {
            if (slide.id > id) {
                return { ...slide, id: slide.id - 1 };
            }
            return slide;
        });
        const newCurrentSlide = Math.max(1, currentSlide - 1);
        setSlides(shiftedSlides);
        setCurrentSlide(newCurrentSlide);
    };

    const handlePreviousSlide = () => {
        setCurrentSlide(prev => Math.max(prev - 1, 1));
    };

    const handleNextSlide = () => {
        setCurrentSlide(prev => Math.min(prev + 1, slides.length));
    };

    const handleStoryPost = async () => {

        let isAllSlidesFilled = true;

        for (const slide of slides) {
            if (!slide.heading || !slide.description || !slide.image) {
                isAllSlidesFilled = false;
                toastr.error("Please fill all fields for all slides.");
                break;
            }

            if (!slide.category) {
                isAllSlidesFilled = false;
                toastr.info("Please reselect category if new slides are added.");
                break;
            }
        }

        let payload = {
            userId: user_Id,
            slides: [...slides]
        }

        try {
            const response = await addStory(payload)
            toastr.success(response.message);

            setTimeout(() => {
                window.location.reload()
            }, 1200)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Add Story Modal"
            >
                <div className='addstoryCloseContainer '>
                    <button className='addstoryCloseBtn' onClick={closeModal}>
                        <img src={CloseIcon} alt="close modal" />
                    </button>
                </div>
                <div className='addstorySlideText'>
                    <p className='dmsans-medium'>Add upto 6 slides </p>
                </div>

                <div className='addstorySlideButtons'>
                    {slides.map(slide => (
                        <div className='allSlideContainer'>
                            <button className={`slideButtonId dmsans-bold ${slide.id === currentSlide ? 'currentSlideButton' : ''}`} key={slide.id} onClick={() => setCurrentSlide(slide.id)}>
                                Slide {slide.id}
                            </button>

                            <div className='slideButtonCloseContainer'>
                                {slide.id > 3 && (
                                    <button className='slideButtonClose' onClick={() => handleRemoveSlide(slide.id)}>
                                        <img src={SlideCloseIcon} alt="slide close" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {slides.length < 6 && (
                        <button className='slideAddBtn' onClick={handleAddSlide}>
                            <h3 className='dmsans-bold'>Add +</h3>
                        </button>
                    )}
                </div>

                <div className='addstoryContentSection'>
                    {slides.map(slide => (
                        <div className='addstoryInfo' key={slide.id} style={{ display: currentSlide === slide.id ? 'flex' : 'none' }}>
                            <div className='addstoryLabelInput'>
                                <label>Heading :</label>
                                <div className='addstoryInputContainer'>
                                    <input type="text" placeholder='Your heading' value={slide.heading} onChange={e => handleInputChange(slide.id, 'heading', e.target.value)} />
                                </div>
                            </div>
                            <div className='addstoryLabelInput'>
                                <label>Description :</label>
                                <div className='addstoryInputContainer'>
                                    <textarea placeholder='Story Description' rows="3" value={slide.description} onChange={e => handleInputChange(slide.id, 'description', e.target.value)}></textarea>
                                </div>
                            </div>
                            <div className='addstoryLabelInput'>
                                <label>Image :</label>
                                <div className='addstoryInputContainer'>
                                    <input type="text" placeholder='Add Image url' value={slide.image} onChange={e => handleInputChange(slide.id, 'image', e.target.value)} />
                                </div>
                            </div>
                            <div className='addstoryLabelInput'>
                                <label>Category :</label>
                                <div className='addstoryInputContainer'>
                                    <select
                                        value={slide.id === 1 ? slide.category : slides[0].category}
                                        onChange={e => handleCategoryChange(slide.id, e.target.value)}
                                        disabled={slide.id !== 1}
                                    >
                                        <option disabled={!slide.category} value={slide.category}>
                                            {slide.category ? slide.category : "Select category"}
                                        </option>
                                        <option disabled={slide.id !== 1 || slides[0].category === 'food'}>food</option>
                                        <option disabled={slide.id !== 1 || slides[0].category === 'health and fitness'}>health and fitness</option>
                                        <option disabled={slide.id !== 1 || slides[0].category === 'travel'}>travel</option>
                                        <option disabled={slide.id !== 1 || slides[0].category === 'movies'}>movies</option>
                                        <option disabled={slide.id !== 1 || slides[0].category === 'education'}>education</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='addstoryFooterButtons'>
                    <div className='previousAndNextBtn'>
                        <button className='btnPrevNext dmsans-bold btnPrevious' onClick={handlePreviousSlide}>
                            Previous
                        </button>
                        <button className='btnPrevNext dmsans-bold btnNext' onClick={handleNextSlide}>
                            Next
                        </button>
                    </div>
                    <div>
                        <button onClick={handleStoryPost} className='btnPost dmsans-bold'>
                            Post
                        </button>
                    </div>
                </div>
            </Modal>

            <button onClick={openModal} className='addStoryMain'>
                <h3 className='dmsans-medium'>Add story</h3>
            </button>
        </div>
    )
}

export default AddStory