import React from 'react'
import './UserMenu.css'
import UserMenuImg from '../../assets/icons/menu-icon.png'

const UserMenu = () => {
    return (
        <div className='userMenuImgContainer'>
            <img style={{ width: '1.5rem' }} src={UserMenuImg} alt="user menu" />
        </div>
    )
}

export default UserMenu