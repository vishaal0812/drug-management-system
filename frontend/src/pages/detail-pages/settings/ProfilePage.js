import React, {useEffect, useRef, useState} from "react";
import {Button, Col, Form, Image, Modal, Row} from "react-bootstrap";
import {createInputField} from "../../../helpers/InputFieldHelper";
import {COMMON_LABELS} from "../../../helpers/Labels";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import SweetAlert from "react-bootstrap-sweetalert";
import {MESSAGE} from "../../../helpers/Message";
import IconButton from "../../../components/IconButton";
import {checkIsValid, FORMAT, validateFields} from "../../../helpers/Validations";

export default function ProfilePage() {

    const navigate = useNavigate();
    const uploadRef = useRef();
    const LABEL = COMMON_LABELS;
    const [profileData, setProfileData] = useState({});
    const [cacheData, setCacheData] = useState({});
    const [alertMessage, setAlertMessage] = useState(null);
    const[errors, setErrors] = useState({});
    const[nonEditable, setNotEditable] = useState(true);
    const[showPassword, setShowPassword] = useState(false);
    const[resetPassword, setResetPassword] = useState(false);
    const[resetAccess, setResetAccess] = useState(false);
    const[changedProfile, setChangedProfile] = useState(false);
    const[checkPassword, setCheckPassword] = useState({});

    useEffect(() => {
        handleProfileData();
    }, []);

    function handleProfileData() {
        axios('/getCurrentUser').then((response) => {
            setProfileData(response.data);
            setCacheData(response.data);
        });
    }

    function handleInput(event) {
        setProfileData({...profileData, [event.target.name] : event.target.value})
    }

    function handleLogout() {
        axios.post('/logout').then(() => navigate('/login'))
    }

    function handleUpdate(data) {
        const formData = new FormData();
        formData.append('profile', profileData['profile']);
        const userDetails = data ? data : profileData;
        if (userDetails) {
            Object.keys(userDetails).forEach(key => {
                formData.append(key, userDetails[key]);
            });
        }
        axios.post('/createAndUpdateUser', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    }

    function handleResetPassword() {
        const emptyErrors = validateFields(checkPassword, ['password', 'newPassword']);
        const formatErrors = checkIsValid([FORMAT.PASSWORD], checkPassword);
        const errors = {...formatErrors, ...emptyErrors};
        setErrors(errors);
        if (Object.keys(errors).length === 0) {
            if (checkPassword.password !== checkPassword.newPassword) {
                setErrors({newPassword: 'Confirmation password is mismatched.'})
            }else {
                setProfileData({...profileData, password: checkPassword.password});
                handleUpdate({...profileData, password: checkPassword.password});
                setAlertMessage(MESSAGE.PASSWORD_CHANGE_SUCCESS);
            }
        }
    }

    function handleResetPasswordAccess() {
        if ((!checkPassword.password || checkPassword.password !== profileData.password) && !resetAccess) {
            setErrors({password: !checkPassword.password ? 'Enter the password is required.' :
                    'Invalid password, Password doesn\'t match.'});
        }else {
            setCheckPassword({});
            setResetAccess(true);
            setErrors({});
        }
    }

    function handleClosePasswordModal() {
        setResetPassword(false);
        setCheckPassword({});
        setErrors({});
        setResetAccess(false);
    }

    const passwordModal = (
        <Modal centered show={resetPassword} onHide={() => handleClosePasswordModal()}>
            <Modal.Header closeButton><Modal.Title>{LABEL.RESET_PASSWORD}</Modal.Title></Modal.Header>
            <Modal.Body>
                <Row className='d-flex'>
                    <Col md={5}>
                        <Form.Label>{resetAccess ? LABEL.NEW_PASSWORD : MESSAGE.ENTER_PASSWORD}</Form.Label>
                    </Col>
                    <Col md={7} className='mb-3'>
                        <div className='d-flex align-items-center'>
                            <Form.Control
                                name='password'
                                type={showPassword ? 'text' : 'password'}
                                value={checkPassword.password || ''}
                                placeholder='Password'
                                onChange={(event) => setCheckPassword({...checkPassword, password: event.target.value})}/>
                            <IconButton
                                className='btn-action-default'
                                icon={showPassword ? 'eye-slash' : 'eye'}
                                variant='falcon-secondary'
                                toolTip={(showPassword ? 'hide' : 'show') + ' password'}
                                onClick={() => setShowPassword(!showPassword)}/>
                        </div>
                        <span className='error-msg'>{errors['password']}</span>
                    </Col>
                    <Col md={5}>{resetAccess && <Form.Label>{LABEL.CONFIRM_PASSWORD}</Form.Label>}</Col>
                    <Col md={7} className='pe-5'>
                        {resetAccess &&
                            <Form.Control
                                name='password'
                                type={showPassword ? 'text' : 'password'}
                                value={checkPassword.newPassword || ''}
                                placeholder='Password'
                                onChange={(event) => setCheckPassword({
                                    ...checkPassword,
                                    newPassword: event.target.value
                                })}/>}
                        <span className='error-msg'>{errors['newPassword']}</span>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button size='sm' variant='danger' onClick={() => {
                    handleClosePasswordModal();
                    setProfileData(cacheData);
                }}>
                    <FontAwesomeIcon icon='times' className='me-1'/>{LABEL.CANCEL}
                </Button>
                <Button size='sm' variant='success' onClick={() => {
                    resetAccess ? handleResetPassword() : handleResetPasswordAccess()}}>
                    <FontAwesomeIcon icon='check' className='me-1'/>{resetAccess ? LABEL.RESET_PASSWORD : LABEL.OK}
                </Button>
            </Modal.Footer>
        </Modal>
    )

    return(
        <>
            {passwordModal}
            {alertMessage &&
                (resetPassword ?
                    <SweetAlert onConfirm={() => {
                        setResetPassword(false);
                        setAlertMessage(null);
                    }} title={alertMessage}/> :
                    <SweetAlert
                        title={alertMessage}
                        showCancel={true}
                        cancelBtnBsStyle='secondary'
                        confirmBtnBsStyle='secondary'
                        onCancel={() => setAlertMessage(null)}
                        onConfirm={() => handleLogout()}
                        confirmBtnText= {LABEL.YES}
                        cancelBtnText={LABEL.NO}/>
                )}
            <Row id='form-page'>
                <Col md={4}>
                    <Row className='mt-4'>
                        <Col>
                            <Image
                                src={changedProfile ? URL.createObjectURL(profileData['profile']) :
                                    `data:image/png;base64,${profileData['profile']}`}
                                style={{border: '2px solid grey'}}
                                height={250}
                                width={250}
                                disabled
                                roundedCircle aria-readonly={false}
                                onDoubleClick={() => uploadRef.current.click()}/>
                        </Col>
                    </Row>
                </Col>
                <Col md={8}>
                    <Row>
                        <Col>
                            <Button size='sm' variant={nonEditable ? 'secondary' : 'success'} className='float-end'
                                    onClick={() => {
                                        if (nonEditable) {
                                            setNotEditable(false);
                                        }else {
                                            setNotEditable(true);
                                            handleUpdate();
                                        }
                                    }}>
                                <FontAwesomeIcon icon={nonEditable ? 'edit' : 'check'} className='me-1'/>
                                {nonEditable ? LABEL.EDIT : LABEL.UPDATE}
                            </Button>
                            <Button size='sm' variant={nonEditable ? 'secondary' : 'danger'} className='float-end me-2'
                                    onClick={() => {
                                        if (nonEditable) {
                                            setAlertMessage(MESSAGE.LOG_OUT);
                                        }else {
                                            setNotEditable(true);
                                            handleProfileData();
                                        }
                                    }}>
                                <FontAwesomeIcon icon={nonEditable ? 'fa-sign-out' : 'times'} className='me-1'/>
                                {nonEditable ? LABEL.LOGOUT : LABEL.CANCEL}
                            </Button>
                            <Form.Control
                                type='file'
                                className='d-none'
                                ref={uploadRef}
                                onChange={(event) => {
                                    setChangedProfile(true);
                                    setProfileData({...profileData, profile: event.target.files[0]});
                                }}/>
                        </Col>
                    </Row>

                    {createInputField([
                        { label: LABEL.USER_NAME, name: 'userName' },
                        { label: LABEL.EMAIL, name: 'email'},
                    ], handleInput, profileData, errors, nonEditable)}
                    <Row>
                        <Col md={4}>
                            <Form.Label className='mt-1'>{LABEL.PASSWORD}</Form.Label>
                        </Col>
                        <Col>
                            <div className='d-flex'>
                                <Form.Control
                                    type={'password'}
                                    value={profileData['password'] || ''}
                                    style={{width: '19vw'}}
                                    className='me-2'
                                    disabled={true}/>
                                <Button variant='danger' size='sm' onClick={() => setResetPassword(true)}>
                                    <FontAwesomeIcon icon='lock' className='me-1'/>{LABEL.RESET_PASSWORD}
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    );
}