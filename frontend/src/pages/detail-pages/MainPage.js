import React, {Suspense, useEffect, useState, useContext} from "react";
import {Card, Col, Image, Row, OverlayTrigger, Tooltip} from "react-bootstrap";
import { PAGE_HEADERS } from "../../helpers/Labels";
import GlobalSearch from "../../components/GlobalSearch";
import {Route, Routes, Link} from "react-router-dom";
import { applicationRoutes } from "../../routes/Route";
import DashBoard from "./DashBoard";
import axios from "axios";
import LoginPage from "./LoginPage";
import bell from '../../assets/img/notification-bell.svg';
import {UserContext, NotificationContext } from '../../helpers/Context';
import PageLoader from "../../components/PageLoader";

export default function MainPage() {

    const TITLE = PAGE_HEADERS;
    const navigationCards = [TITLE.DASHBOARD, TITLE.MANUFACTURER, TITLE.DRUG, TITLE.CUSTOMER, TITLE.ORDER, TITLE.SETTINGS];
    const color = [
        '#adadad',
        '#d6ff00',
        '#2fdf36',
        '#fb00ac',
        '#f70202',
        '#1e0dff'
    ];

    const [unreadContain, setUnreadContain] = useState(0);
    const [pageIndex, setPageIndex] = useState();
    const [loading, setLoading] = useState(true);
    const {currentUser} = useContext(UserContext);

    useEffect(() => {
        axios('/getAllNotifications').then((response) => {
            const unreadCount = response.data.filter(notification => !notification.isRead).length;
            setUnreadContain(unreadCount);
        });
    }, []);

    function renderRoutes(routes) {
        return routes.map((route, index) =>
            <Route key={index} path={route.path} element={route.element}/>
        );
    }

    return (
        <Suspense fallback={<PageLoader/>}>
            <NotificationContext.Provider value={{setUnreadContain}}>
                {!currentUser ? <LoginPage/> :
                    <>
                        <Row className='m-0' style={{height: '10vh', backgroundColor: 'black', color: 'white'}}>
                            <Col md={3} className='p-3 pt-4'>
                                <GlobalSearch/>
                            </Col>
                            <Col md={6} className='pt-2'><span className='title'>DRUGS MANAGEMENT</span></Col>
                            <Col md={3} className='d-flex align-items-center justify-content-end pe-5'>
                                <span className='user-name me-2'>{currentUser['userName']}</span>
                                <OverlayTrigger placement="bottom" overlay={<Tooltip >{`${unreadContain} notifications`}</Tooltip>}>
                                    <Link to='/settings/notifications'>
                                        <Image
                                            className={'me-2 ' + (unreadContain > 0 && 'bell') }
                                            src={bell}
                                            height={30}
                                            width={30}
                                            roundedCircle/>
                                    </Link>
                                </OverlayTrigger>
                                <Link to='/settings/profile'>
                                    <Image
                                        src={`data:image/png;base64,${currentUser['profile']}`}
                                        className='mb-1'
                                        height={50}
                                        width={50}
                                        style={{border: '2px solid #b1aea0'}}
                                        roundedCircle/>
                                </Link>
                            </Col>
                        </Row>
                        <Row className='m-0 scrollbar' style={{backgroundColor: 'black', height: '90vh', borderRadius:'0px'}}>
                            <Col md={2} className='pt- p-4 scrollbar' style={{width: '20%', height: '100%'}} >
                                {navigationCards.map((key, index) => (
                                    <Row key={index} className='px-2'>
                                        <Card className='my-2'
                                             style={{boxShadow: index === pageIndex ? '#ffffff 0px 0px 11px 2px'
                                                     : '', background: `linear-gradient(160deg, ${color[index]}, black)`}}>
                                            <Link to={`/${key.toLowerCase()}`} style={{textDecoration: 'none'}}>
                                                <Card.Body onClick={() => setPageIndex(index)} style={{color: 'white'}}>{key}</Card.Body>
                                            </Link>
                                        </Card>
                                    </Row>
                                ))}
                            </Col>
                            <Col md={10} style={{width: '80%'}}>
                                <Card className='mt-3 scrollbar' style={{height: '85vh'}}>
                                    <Card.Body className='pb-2 pt-2 scrollbar' style={{background: 'linear-gradient(256deg, #2e2e2e, #dbdbdb)'}}>
                                        <Routes>
                                            <Route path='/' element={<DashBoard/>}/>
                                            {renderRoutes(applicationRoutes)}
                                        </Routes>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </>
                }
            </NotificationContext.Provider>
        </Suspense>
    );
}
