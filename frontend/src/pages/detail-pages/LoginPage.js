import React, {useState} from 'react';
import {Button, Col, Form, Modal, Row} from "react-bootstrap";
import IconButton from "../../components/IconButton";
import axios from "axios";
import {checkIsValid, validateFields} from "../../helpers/Validations";
import {FORMAT} from "../../helpers/Validations";
import {useNavigate} from "react-router-dom";
import SweetAlert from "react-bootstrap-sweetalert";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {MESSAGE} from "../../helpers/Message";
import {COMMON_LABELS} from "../../helpers/Labels";
import PageLoader from "../../components/PageLoader";

export default function LoginPage({loginSuccess}) {

    const LABEL = COMMON_LABELS;
    const navigate = useNavigate();
    const [pageLoading, setPageLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [showLoginModal, setShowLoginModal] = useState(true);
    const [showSignInModal, setShowSignInModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);
    const [data, setData] = useState({});
    const [newPassword, setNewPassword] = useState(null);
    const PATTERNS = [FORMAT.USER_NAME, FORMAT.PASSWORD, FORMAT.EMAIL];

    function handleSignIn() {
        const emptyFieldErrors = validateFields(data, ['userName', 'email', 'password']);
        const formatErrors = checkIsValid(PATTERNS, data);
        const errors = {...formatErrors, ...emptyFieldErrors};
        setErrors(errors);
        if (Object.keys(errors).length === 0) {
            const formData = new FormData();
            formData.append('profile', 'frontend/src/assets/img/blank_profile.jpg');
                Object.keys(data).forEach(key => {
                    formData.append(key, data[key]);
                });
            axios.post('/createAndUpdateUser', formData, {
                headers: {'Content-Type': 'multipart/form-data'}
            }).then((error) => {
                if (error.data) {
                    setAlertMessage(error.data);
                }else {
                    navigate('/settings');
                    loginSuccess(true);
                }
            })
        }
    }

    function handleInput(event) {
        setData({...data, [event.target.name] : event.target.value});
    }
    
    function generatePassword() {
        const passwordMaterial = 'ABCDEFGHIKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxzy1234567890';
        let password = '';
        for (let index = 0; index < 6; index++) {
            password += passwordMaterial.charAt(Math.floor(Math.random() * passwordMaterial.length));
        }
        return password;
    }

    function handleLogin() {
        const emptyFieldErrors = validateFields(data, ['userName', 'password']);
        const formatError = checkIsValid([FORMAT.USER_NAME, FORMAT.PASSWORD], data);
        const errors = {...formatError, ...emptyFieldErrors};
        setErrors(errors);
        if (Object.keys(errors).length === 0) {
            if (data.newPassword && (newPassword !== data.password)) {
                setErrors({password: 'Incorrect password, Enter the correct password'})
            }else {
                axios.post('/userLogin', data).then((response) => {
                    if (!response.data) {
                        setAlertMessage(MESSAGE.USER_DOES_NOT_EXISTS);
                        setData({});
                    } else {
                        navigate('/dashboard');
                        loginSuccess(true);
                        setPageLoading(true);
                    }
                })
            }
        }
    }

    function handleSendEmail() {
        const generatedPassword = generatePassword();
        const emptyFieldError = validateFields(data, ['email']);
        const formatError = checkIsValid([FORMAT.EMAIL], data);
        const errors = {...formatError, ...emptyFieldError};
        setErrors(errors);
        if (Object.keys(errors).length === 0) {
            setPageLoading(true);
            axios.post('/sendEmailForResetPassword', {email: data['email'], password: generatedPassword})
                .then((response) => {
                    if (!response.data) {
                        setAlertMessage('User Email ' + data['email'] + ' Doesn\'t Exists');
                        setPageLoading(false);
                    }else {
                        setShowPasswordModal(false);
                        setShowLoginModal(true);
                        setData({...data, newPassword: true});
                        setNewPassword(generatedPassword);
                        setPageLoading(false);
                    }
                });
        }
    }

    const loginModal = (
        <Modal centered show={showLoginModal}>
            <Modal.Header>
                <Modal.Title>{LABEL.LOGIN}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {data.newPassword && <Form.Label className='fs-10 mb-2 ms-4'
                             style={{color: 'blue'}}>{MESSAGE.EMAIL_USERNAME_PASSWORD}</Form.Label>}
                <Row>
                    <Col md={3}>
                        <Form.Label className='ms-4 mt-1'>{LABEL.USER_NAME}</Form.Label>
                    </Col>
                    <Col className='me-5 mb-2'>
                        <Form.Control
                            name='userName'
                            value={data['userName'] || ''}
                            placeholder='User name'
                            onChange={(event) => handleInput(event)}/>
                        <span className='error-msg'>{errors['userName']}</span>
                    </Col>
                </Row>
                <Row>
                    <Col md={3}>
                        <Form.Label className='ms-4 mt-1'>{LABEL.PASSWORD}</Form.Label>
                    </Col>
                    <Col>
                        <div className='d-flex'>
                            <Form.Control
                                name='password'
                                type={showPassword ? 'text' : 'password'}
                                value={data['password'] || ''}
                                placeholder='* * * * * *'
                                style={{width: '27vw'}}
                                onChange={(event) => handleInput(event)}/>
                            <IconButton
                                className='btn-action-default'
                                icon={showPassword ? 'eye-slash' : 'eye'}
                                variant='falcon-secondary'
                                toolTip={(showPassword ? 'hide' : 'show') + ' password'}
                                onClick={() => setShowPassword(!showPassword)}/>
                        </div>
                        <span className='error-msg'>{errors['password']}</span>
                    </Col>
                </Row>
                <Row>
                <Col className='ms-8 text-center'>
                        <a className='fs-10 link cursor-pointer'
                           onClick={() => {
                               setShowLoginModal(false);
                               setShowPasswordModal(true);
                           }}>{MESSAGE.FORGOT_PASSWORD}</a>
                    </Col>
                </Row>
                <hr/>
                <Row>
                    <Col>
                        <Button className='w-100' variant='success' onClick={() => {
                            setShowLoginModal(false);
                            setShowSignInModal(true);
                            setData({});
                        }}><FontAwesomeIcon icon='user-circle' className='me-1'/>{LABEL.SIGN_IN}</Button>
                    </Col>
                    <Col>
                        <Button className='w-100' variant='primary' onClick={() => handleLogin()}>
                            <FontAwesomeIcon icon='sign-in' className='me-1'/>{LABEL.LOGIN}</Button>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    );

    const signInModal = (
        <Modal centered show={showSignInModal}>
            <Modal.Header>
                <Modal.Title>{LABEL.SIGN_IN}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col md={3}>
                        <Form.Label className='ms-4 mt-1'>{LABEL.USER_NAME}</Form.Label>
                    </Col>
                    <Col className='me-5 mb-2'>
                        <Form.Control
                            name='userName'
                            value={data['userName']}
                            placeholder='User name'
                            onChange={(event) => handleInput(event)}/>
                        <span className='error-msg'>{errors['userName']}</span>
                    </Col>
                </Row>
                <Row>
                <Col md={3}>
                        <Form.Label className='ms-4 mt-1'>{LABEL.EMAIL}</Form.Label>
                    </Col>
                    <Col className='me-5 mb-2'>
                        <Form.Control
                            name='email'
                            value={data['email']}
                            placeholder='Email'
                            onChange={(event) => handleInput(event)}/>
                        <span className='error-msg'>{errors['email']}</span>
                    </Col>
                </Row>
                <Row>
                <Col md={3}>
                        <Form.Label className='ms-4 mt-1'>{LABEL.PASSWORD}</Form.Label>
                    </Col>

                    <Col>
                        <div className='d-flex'>
                            <Form.Control
                                name='password'
                                type={showPassword ? 'text' : 'password'}
                                value={data['password'] || ''}
                                style={{width: '27vw'}}
                                placeholder='* * * * * *'
                                onChange={(event) => handleInput(event)}/>
                            <IconButton
                                className='btn-action-default'
                                icon={showPassword ? 'eye-slash' : 'eye'}
                                variant='falcon-secondary'
                                toolTip={(showPassword ? 'hide' : 'show') + ' password'}
                                onClick={() => setShowPassword(!showPassword)}/>
                        </div>
                        <span className='error-msg'>{errors['password']}</span>
                    </Col>
                </Row>
                <Row>
                <Col className='ms-8 text-center'>
                        <a className='fs-10 link cursor-pointer' onClick={() => {
                            const generatedPassword = generatePassword();
                            setData({...data, password: generatedPassword});
                            setShowPassword(true);
                        }}>{MESSAGE.SUGGEST_PASSWORD}</a>
                    </Col>
                </Row>
                <hr/>
                <Row>
                    <Col>
                        <Button className='w-100' variant='primary' onClick={() => {
                            setShowLoginModal(true);
                            setShowSignInModal(false);
                            setData({});
                        }}><FontAwesomeIcon icon='sign-in' className='me-1'/>{LABEL.LOGIN}</Button>
                    </Col>
                    <Col>
                        <Button className='w-100' onClick={() => handleSignIn()} variant='success'>
                            <FontAwesomeIcon icon='user-circle' className='me-1'/>{LABEL.SIGN_IN}</Button>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    );

    const forgotPasswordModal = (
        <Modal centered show={showPasswordModal} onHide={() => {
            setShowPasswordModal(false);
            setShowLoginModal(true);
        }}>
            <Modal.Header closeButton>
                <Modal.Title>{LABEL.RESET_PASSWORD}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Modal.Header>
                    {MESSAGE.PASSWORD_EMAIL}
                </Modal.Header>
                <Form.Control
                    name='email'
                    value={data['email']}
                    placeholder='example123@gmail.com'
                    onChange={(event) => handleInput(event)}/>
                <span className='error-msg'>{errors['email']}</span>
                <Modal.Footer>
                    <Button onClick={() => handleSendEmail()}>
                        <FontAwesomeIcon icon='paper-plane' className='me-1'/>{LABEL.SEND_EMAIL}
                    </Button>
                </Modal.Footer>
            </Modal.Body>
        </Modal>
    );

    return (
        <>
            {alertMessage && <SweetAlert onConfirm={() => setAlertMessage(null)} title={alertMessage}/>}
            <PageLoader loading={pageLoading}/>
            {loginModal}
            {signInModal}
            {forgotPasswordModal}
        </>
    );
}