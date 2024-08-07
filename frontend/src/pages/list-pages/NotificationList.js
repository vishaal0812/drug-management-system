import { Card, Col, Dropdown, DropdownButton, Form, Overlay, OverlayTrigger, Row, Tooltip} from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

export default function NotificationList() {

    const listOptions = ['All', 'Unread', 'Readed'];
    const iconList = ['list', 'envelope', 'envelope-open']
    const [optionIndex, setOptionIndex] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [filterNotification, setFilterNotification] = useState([]);

    useEffect(() => {
        axios('/getAllNotifications').then((response) => {
            setNotifications(response.data);
            setFilterNotification(response.data);
        });
    },[])

    function handleDropDown(index) {
        if (Number(index) !== 0) {
            const unreadClicked = Number(index) === 1;
            const filteredNotifications = notifications.filter(item => item.isRead === unreadClicked);
            setFilterNotification(filteredNotifications);
        }else setFilterNotification(notifications);
    }

    function dateFormater(date) {
        const dateSplit = date.substring(0, 10).split('-');
        return dateSplit[2] + '-' + dateSplit[1] + '-' + dateSplit[0];
    }

    return(
        <>
            <Row className="pb-1">
                <Col>
                    <Form.Label>Notifications</Form.Label>
                </Col>
                <Col>
                    <DropdownButton className="float-end" variant="secondary" size='sm' 
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
            <div className="scrollbar" style={{height: '52vh'}}>
                {filterNotification.map((item) => (
                    <Card className='my-2' style={{backgroundColor: '#ffff'}} >
                        <Row className='d-flex align-items-center mx-1'>
                            <Col md={12}>
                                <Row className='d-flex align-items-center'>
                                    <Col md={10}>
                                        <Form.Check className="float-start pe-2 pt-1"/>
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