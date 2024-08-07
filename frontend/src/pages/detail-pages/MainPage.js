import React, {useEffect, useState} from "react";
import {Card, Col, Image, Row} from "react-bootstrap";
import { PAGE_HEADERS } from "../../helpers/Labels";
import {Route, Routes, Link} from "react-router-dom";
import { applicationRoutes } from "../../routes/Route";
import DashBoard from "./DashBoard";
import axios from "axios";
import LoginPage from "./LoginPage";
import bell from '../../assets/img/notification-bell.svg'

export default function MainPage() {

    const TITLE = PAGE_HEADERS;
    const navigationCards = [TITLE.DASHBOARD, TITLE.MANUFACTURER, TITLE.DRUG, TITLE.CUSTOMER, TITLE.ORDER, TITLE.SETTINGS];
    const color = [
        '#fa5353',
        '#ffd86c',
        '#37d5a6',
        '#fb68ff',
        '#69fd75',
        '#5e8ed1'
    ];

    const [currentUser, setCurrentUser] = useState();
    const [pageIndex, setPageIndex] = useState();
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [unreadNotification, setUnreadNotification] = useState(false);

    useEffect(() => {
        axios('/getCurrentUser').then((response) => {
            if (Object.keys(response.data).length > 0) {
                setCurrentUser(response.data);
            }
        });
        checkUnreadNotification();
    }, [loginSuccess]);

    function checkUnreadNotification() {
        axios('/getAllNotifications').then((response) => {
            const unreadIsThere = response.data.some(notification => notification.isRead === false);
            setUnreadNotification(unreadIsThere);
        });
    }

    function renderRoutes(routes) {
        return routes.map((route, index) =>
            <Route key={index} path={route.path} element={route.element}/>
        );
    }

    return (
        <>
            {
                !currentUser ? <LoginPage loginSuccess={setLoginSuccess}/> :
                <Card className='m-3 mb-2 scrollbar' style={{backgroundColor: 'lightgray'}}>
                <Card.Body>
                    <Card className='mb-1'>
                        <Card.Body className='p-2'>
                            <Row>
                                <Col md={2}></Col>
                                <Col md={8} className='d-flex align-items-center justify-content-center'>
                                    <Card.Title>{TITLE.APPLICATION_TITLE}</Card.Title>
                                </Col>
                                <Col md={2} className='d-flex align-items-center justify-content-end pe-5'>
                                    <Link to='/settings/notifications'>
                                        <Image
                                            className={'me-2 ' + (unreadNotification && 'bell') }
                                            src={bell}
                                            height={30}
                                            width={30}
                                            roundedCircle/>
                                    </Link>
                                    <Link to='/settings/profile'>
                                        <Image
                                            src={`data:image/png;base64,${currentUser['profile']}`}
                                            height={40}
                                            width={40}
                                            roundedCircle/>
                                    </Link>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                    <Row>
                        <Col md={2} className='mt-3'>
                            {navigationCards.map((key, index) => (
                                <Row key={index}>
                                    <Card className='mx-3 my-2'
                                         style={{boxShadow: index === pageIndex ? 'rgb(255 255 255) 0px 0px 11px 2px'
                                                 : '',  backgroundColor: color[index]}}>
                                        <Link to={`/${key.toLowerCase()}`} style={{textDecoration: 'none'}}>
                                            <Card.Body onClick={() => setPageIndex(index)} style={{color: 'white'}}>{key}</Card.Body>
                                        </Link>
                                    </Card>
                                </Row>
                            ))}
                        </Col>
                        <Col md={10}>
                            <Card className='ms-3 mt-3 scrollbar' style={{height: '76vh'}}>
                                <Card.Body className='pb-2 pt-2'>
                                    <Routes>
                                        <Route path='/' element={<DashBoard/>}/>
                                        {renderRoutes(applicationRoutes)}
                                    </Routes>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>}
        </>
    );
}
