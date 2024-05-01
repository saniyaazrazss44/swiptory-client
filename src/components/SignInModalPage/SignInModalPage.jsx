import React, { useState } from 'react'
import '../SignIn/SignIn.css'
import '../Home/Home.css'
import Modal from 'react-modal';
import likeStoryIcon from '../../assets/icons/like-icon.png'
import CloseIcon from '../../assets/icons/modal-close-icon.jpg'
import PasswordShow from '../../assets/icons/password-eye-open.png'
import PasswordHide from '../../assets/icons/password-eye-close.png'
import toastr from 'toastr';
import 'toastr/build/toastr.css';
import { login } from '../../apis/authApis';

const SignInModalPage = () => {

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
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [modalIsOpen, setIsOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handlePasswordClick = () => {
        setShowPassword(!showPassword)
    }

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    const handleUserSignIn = async () => {
        if (!username || !password) {
            setErrorMsg('Please fill all input')
            return;
        }

        try {
            const payload = {
                username: username,
                password: password
            };

            const response = await login(payload);
            toastr.success(response.message);

            localStorage.setItem('token', response.token);
            localStorage.setItem('username', response.username);
            localStorage.setItem('userId', response.userId);

            setTimeout(() => {
                window.location.href = '/'
            }, 1200)

        } catch (error) {
            console.error("Error signing in user:", error);
            toastr.error("Please enter valid details");
        }
    }

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    return (
        <div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Sign In Modal"
            >
                <div className='signinCloseContainer'>
                    <button className='signinCloseBtn' onClick={closeModal}>
                        <img src={CloseIcon} alt="close modal" />
                    </button>
                </div>

                <div className='signinBody'>
                    <div className='signinTitle'>
                        <h3 className='dmsans-bold'>Login to SwipTory</h3>
                    </div>

                    <div className='signinFormContainer'>
                        <div className='signinLoginForm'>
                            <label>Username</label>
                            <input value={username} onChange={handleUsernameChange} className='dmsans-medium' type="text" placeholder='Enter username' />
                        </div>
                        <div className='signinLoginForm'>
                            <label>Password</label>
                            <div className='inpPasswordDiv'>
                                <input value={password} onChange={handlePasswordChange} className='dmsans-medium' type={
                                    showPassword ? "text" : "password"
                                } placeholder='Enter password' />
                                <div className='passwordShow'>
                                    <img className='signinPasswordImg' onClick={handlePasswordClick} src={showPassword ? PasswordShow : PasswordHide} alt="password" />
                                </div>
                            </div>
                        </div>
                        <div className='dmsans-medium' style={{ color: 'red' }}>{errorMsg}</div>
                        <div>
                            <button onClick={handleUserSignIn} className='btnLogin dmsans-bold'>
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>

            <button className='btnLikeStory' onClick={openModal}>
                <img src={likeStoryIcon} alt="like" />
            </button>
        </div>
    )
}

export default SignInModalPage