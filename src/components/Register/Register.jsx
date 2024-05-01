import React, { useEffect, useState } from 'react'
import './Register.css'
import Modal from 'react-modal';
import CloseIcon from '../../assets/icons/modal-close-icon.jpg'
import PasswordShow from '../../assets/icons/password-eye-open.png'
import PasswordHide from '../../assets/icons/password-eye-close.png'
import toastr from 'toastr';
import 'toastr/build/toastr.css';
import { register } from '../../apis/authApis';

const Register = () => {

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

    useEffect(() => {
        const handleSize = () => {
            if (window.innerWidth <= 768) {
                setCustomStyles({
                    ...customStyles, content: {
                        ...customStyles.content,
                        width: '80%'
                    }
                })
            } else {
                setCustomStyles({
                    ...customStyles, content: {
                        ...customStyles.content,
                        width: '45%'
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

    const handlePasswordClick = () => {
        setShowPassword(!showPassword)
    }

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    const handleUserRegistration = async () => {
        if (!username || !password) {
            setErrorMsg('Please fill all input')
            return;
        }

        try {
            const payload = {
                username: username,
                password: password
            };

            const response = await register(payload);
            localStorage.setItem('token', response.token);
            localStorage.setItem('username', response.username);
            localStorage.setItem('userId', response.userId);
            toastr.success(response.message);

            setTimeout(() => {
                window.location.href = '/'
            }, 1200)

        } catch (error) {
            console.error("Error registering user:", error);
            toastr.error("Failed to register user. Please try again later.");
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
                contentLabel="Register Modal"
            >
                <div className='registerCloseContainer'>
                    <button className='registerCloseBtn' onClick={closeModal}>
                        <img src={CloseIcon} alt="close modal" />
                    </button>
                </div>

                <div className='registerBody'>
                    <div className='registerTitle'>
                        <h3 className='dmsans-bold' style={{ textAlign: 'center' }}>Register to SwipTory</h3>
                    </div>

                    <div className='registerFormContainer'>
                        <div className='regsiterLoginForm'>
                            <label>Username</label>
                            <input value={username} onChange={handleUsernameChange} className='dmsans-medium' type="text" placeholder='Enter username' />
                        </div>
                        <div className='regsiterLoginForm'>
                            <label>Password</label>
                            <div className='inpPasswordDiv'>
                                <input value={password} onChange={handlePasswordChange} className='dmsans-medium' type={
                                    showPassword ? "text" : "password"
                                } placeholder='Enter password' />
                                <div className='passwordShow'>
                                    <img className='registerPasswordImg' onClick={handlePasswordClick} src={showPassword ? PasswordShow : PasswordHide} alt="password" />
                                </div>
                            </div>
                        </div>
                        <div className='dmsans-medium' style={{ color: 'red' }}>{errorMsg}</div>
                        <div>
                            <button onClick={handleUserRegistration} className='btnRegister dmsans-bold'>
                                Register
                            </button>
                        </div>
                    </div>
                </div>

            </Modal>

            <button onClick={openModal} className='registerMain'>
                <h3 className='dmsans-medium'>Register Now</h3>
            </button>
        </div>
    )
}

export default Register