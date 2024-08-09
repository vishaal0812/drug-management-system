import { Card, Col, Dropdown, DropdownButton, Form, Overlay, OverlayTrigger, Row, Tooltip} from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import IconButton from '../../components/IconButton';

export default function NotificationList() {

    const listOptions = ['All', 'Unread', 'Readed'];
    const iconList = ['list', 'envelope', 'envelope-open']
    const [optionIndex, setOptionIndex] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [filterNotification, setFilterNotification] = useState([]);
    const [checkedRow, setCheckedRows] = useState([]);

    useEffect(() => {
        getAllNotifications();
    },[])

    function getAllNotifications() {
        axios('/getAllNotifications').then((response) => {
            const unreadCount = response.data.filter(notification => !notification.isRead).length;
            const notifications = response.data.sort((a, b) => {
                if (a.isRead !== b.isRead) {
                    return a.isRead ? 1 : -1;
                }
                return b.id - a.id;
            })
            setNotifications(notifications);
            setFilterNotification(response.data);
        });
    }

    function handleCheckBox(item) {
        const isExist = checkedRow.some((notification) => notification.id === item.id);
        if (isExist) {
            const removeItem = checkedRow.filter(notification => notification.id !== item.id);
            setCheckedRows(removeItem);
        }else setCheckedRows([...checkedRow, item]);
    }

    function handleDropDown(index) {
        if (Number(index) > 0) {
            const unreadClicked = Number(index) !== 1;
            const filteredNotifications = notifications.filter(item => item.isRead === unreadClicked);
            setFilterNotification(filteredNotifications);
        }else setFilterNotification(notifications);
    }

    function dateFormater(date) {
        const dateSplit = date.substring(0, 10).split('-');
        return dateSplit[2] + '-' + dateSplit[1] + '-' + dateSplit[0];
    }

    function handleMarkAsReadOrUnRead() {
        const notificationIds = checkedRow.map(item => item.id);
        const markAsType = checkedRow.some(item => item.isRead === true);
        console.log(!markAsType)
        axios.post('/setMarkAsRead', {ids: notificationIds, markType: !markAsType})
            .then(() => {
                getAllNotifications();
                setCheckedRows([]);
            });
    }

    function handleDelete() {
        const notificationIds = checkedRow.map(item => item.id);
        axios.post('/deleteNotifications', {ids: notificationIds})
            .then(() => {
                getAllNotifications();
                setCheckedRows([]);
            });
    }

    return(
        <>
            <Row className="pb-1">
                <Col md={8}>
                    <Form.Label>Notifications</Form.Label>
                </Col>
                <Col md={4}>
                    {checkedRow[0] &&
                        <>
                            <IconButton
                                className='ms-7'
                                variant='secondary'
                                icon='envelope'
                                toolTip={checkedRow.some(item => item.isRead === true) ? 'Mark All As Unread' : 'Mark All As Read'}
                                onClick={()=> handleMarkAsReadOrUnRead()}/>
                            <IconButton
                                className='ms-1'
                                variant='secondary'
                                icon='trash'
                                toolTip='Delete All'
                                onClick={()=> handleDelete()}/>
                        </>}
                    <DropdownButton className="float-end me-2" variant="secondary" size='sm'
                        onSelect={(index) => {
                            setOptionIndex(index);
                            handleDropDown(index);
                        }}
                        title= {<>
                            <FontAwesomeIcon className="me-1" icon={iconList[optionIndex]}/>
                            {listOptions[optionIndex] + ' Notifications'}
                        </>}
                    >
                        {listOptions.map((option, index) => (
                            <Dropdown.Item key={option} eventKey={index}>
                                <FontAwesomeIcon className="me-1" icon={iconList[index]}/>{listOptions[index] + ' Notifications'}
                            </Dropdown.Item>
                        ))}
                    </DropdownButton>
                </Col>
            </Row>
            <div className="scrollbar" style={{height: '56vh'}}>
                {filterNotification.map((item) => (
                    <Card className='my-2' style={{backgroundColor: '#ffff'}} >
                        <Row className='d-flex align-items-center mx-1'>
                            <Col md={12}>
                                <Row className='d-flex align-items-center'>
                                    <Col md={10}>
                                        <Form.Check
                                            className="float-start pe-2 pt-1"
                                            checked={checkedRow.some(notification => notification.id === item.id)}
                                            onClick={() => handleCheckBox(item)}/>
                                        <Form.Label className={`py-1 fs-9 mb-0 ${!item.isRead && 'fw-bold'}`}>{item.subject}</Form.Label>
                                    </Col>
                                    <Col md={2}>
                                        <Form.Label className="fs-10 float-end pt-1">{dateFormater(item.time)}</Form.Label>
                                    </Col>
                                </Row>
                            </Col>
                            <Col md={12}>
                                <Form.Label className={`mx-4 fs-10 mb-1 ${!item.isRead && 'fw-bold'}`}>{item.content}</Form.Label>
                            </Col>
                        </Row>
                    </Card>
                ))}
            </div>
        </>
    );
};