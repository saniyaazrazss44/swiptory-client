import React, { useEffect, useState } from 'react'
import './Header.css'
import Register from '../Register/Register'
import SignIn from '../SignIn/SignIn'
import BookmarkBtn from '../BookmarkBtn/BookmarkBtn'
import AddStory from '../AddStory/AddStory'
import UserMenu from '../UserMenu/UserMenu'
import UserIcon from '../../assets/icons/user-icon.jpg'
import { Link } from 'react-router-dom'

const Header = () => {

    const [detailsVisible, setDetailsVisible] = useState(false);
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
    };

    const handleDocumentClick = (event) => {
        if (!event.target.closest('.userMenuContainer')) {
            closeDetails();
        }
    };

    const handleUserLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        if (confirmLogout) {
            localStorage.clear();
            window.location.reload();
        }
    }

    return (
        <div>
            <div className='headerMain'>
                <Link to='/' style={{ textDecoration: 'none', color: '#000000' }}>
                    <h1 className='dmsans-bold'>SwipTory</h1>
                </Link>
                <div className='headerAuth'>
                    {isLoggedIn ? (
                        <div className='headerAuth'>
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
                    ) : (
                        <div className='headerAuth'>
                            <Register />
                            <SignIn />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Header