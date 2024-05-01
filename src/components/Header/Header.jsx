import React, { useEffect, useState } from 'react'
import './Header.css'
import Register from '../Register/Register'
import SignIn from '../SignIn/SignIn'
import BookmarkBtn from '../BookmarkBtn/BookmarkBtn'
import AddStory from '../AddStory/AddStory'
import UserMenu from '../UserMenu/UserMenu'
import UserIcon from '../../assets/icons/user-icon.jpg'
import MobileViewClose from '../../assets/icons/mobileview-close.png'
import MobileViewMenu from '../../assets/icons/mobileview-menu.png'
import { Link } from 'react-router-dom'

const Header = () => {

    const [detailsVisible, setDetailsVisible] = useState(false);
    const [mobileDetailsVisible, setMobileDetailsVisible] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        if (token && username) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', handleDocumentClick);
        return () => {
            document.removeEventListener('mousedown', handleDocumentClick);
        };
    }, [detailsVisible]);

    const openDetails = () => {
        setDetailsVisible(true);
    };

    const closeDetails = () => {
        setDetailsVisible(false);
    };

    const handleDivClick = () => {
        if (detailsVisible) {
            closeDetails();
        } else {
            openDetails();
        }
    }

    const openMobileDetails = () => {
        setMobileDetailsVisible(true);
    };

    const closeMobileDetails = () => {
        setMobileDetailsVisible(false);
    };

    const openMobileMenu = () => {
        if (mobileDetailsVisible) {
            closeMobileDetails();
        } else {
            openMobileDetails();
        }
    };

    const handleDocumentClick = (event) => {
        if (!event.target.closest('.userMenuContainer')) {
            closeDetails();
        }
    }

    const handleUserLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        if (confirmLogout) {
            localStorage.clear();
            window.location.reload();
        }
    }

    const handleYourStory = () => {
        window.location.reload()
        window.location.href = '/'
    }

    return (
        <div>
            <div className='headerMain'>
                <Link to='/' style={{ textDecoration: 'none', color: '#000000' }}>
                    <h1 className='dmsans-bold'>SwipTory</h1>
                </Link>
                <div className='headerAuth'>
                    {isLoggedIn ? (
                        <div>
                            <div className='headerAuthWeb'>
                                <BookmarkBtn />
                                <AddStory />
                                <div className='userIconContainer'>
                                    <img src={UserIcon} alt="user" />
                                </div>
                                <div className='userMenuContainer'>
                                    <div onClick={handleDivClick}>
                                        <UserMenu />
                                    </div>
                                    {detailsVisible && (
                                        <div className='userMenuOpenDetails'>
                                            <p className='userNameText dmsans-bold'>
                                                {localStorage.getItem('username') || 'Guest'}
                                            </p>
                                            <button onClick={handleUserLogout} className='userLogoutBtn dmsans-bold'>Logout</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className='headerAuth2'>
                                <img onClick={openMobileMenu} className='headerMobileMenuImg' src={MobileViewMenu} alt="mobile-menu" />

                                {mobileDetailsVisible && (
                                    <div className='headerMobileMenu'>
                                        <div onClick={closeMobileDetails} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', cursor: 'pointer' }}>
                                            <img src={MobileViewClose} alt="close" />
                                        </div>
                                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', justifyContent: 'center' }}>
                                            {isLoggedIn ? (
                                                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', justifyContent: 'center' }}>
                                                    <div className='userIconContainer'>
                                                        <img src={UserIcon} alt="user" />
                                                        <p className='userNameText dmsans-bold'>
                                                            {localStorage.getItem('username') || 'Guest'}
                                                        </p>
                                                    </div>
                                                    <button onClick={handleYourStory} className='userLogoutBtn dmsans-bold'>Your Story</button>
                                                    <AddStory />
                                                    <BookmarkBtn />
                                                    <button onClick={handleUserLogout} className='userLogoutBtn dmsans-bold'>Logout</button>
                                                </div>
                                            ) : (
                                                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Register />
                                                    <SignIn />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className='headerAuth'>
                            <div className='headerAuth1'>
                                <Register />
                                <SignIn />
                            </div>
                            <div className='headerAuth2'>
                                <img onClick={openMobileMenu} className='headerMobileMenuImg' src={MobileViewMenu} alt="mobile-menu" />

                                {mobileDetailsVisible && (
                                    <div className='headerMobileMenu'>
                                        <div onClick={closeMobileDetails} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', cursor: 'pointer' }}>
                                            <img src={MobileViewClose} alt="close" />
                                        </div>
                                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', justifyContent: 'center' }}>
                                            {isLoggedIn ? (
                                                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', justifyContent: 'center' }}>
                                                    <div className='userIconContainer'>
                                                        <img src={UserIcon} alt="user" />
                                                        <p className='userNameText dmsans-bold'>
                                                            {localStorage.getItem('username') || 'Guest'}
                                                        </p>
                                                    </div>
                                                    <button onClick={handleYourStory} className='userLogoutBtn dmsans-bold'>Your Story</button>
                                                    <AddStory />
                                                    <BookmarkBtn />
                                                    <button onClick={handleUserLogout} className='userLogoutBtn dmsans-bold'>Logout</button>
                                                </div>
                                            ) : (
                                                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Register />
                                                    <SignIn />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Header