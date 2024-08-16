import React, {useEffect, useState} from 'react';
import {Tabs, Tab, Card} from "react-bootstrap";
import {SETTINGS} from "../../../helpers/Labels";
import {useParams} from "react-router-dom";
import ProfilePage from "./ProfilePage";
import NotificationList from "../../list-pages/NotificationList";
import NotesList from "../../list-pages/NotesList";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default function Settings() {

    const params = useParams();
    const [subPage, setSubPage] = useState('profile');
    const cards = [SETTINGS.PROFILE, SETTINGS.NOTIFICATIONS, SETTINGS.NOTES];
    const pages = {profile: <ProfilePage/>, notifications: <NotificationList/>,notes: <NotesList/>};
    const icons = ['circle-user', 'bell', 'book']

    useEffect(() => {
        if (params.subPage) 
            setSubPage(params.subPage);
    }, []);

    return(
        <>
            <Tabs className='border-bottom-none' activeKey={subPage} onSelect={(page) => setSubPage(page.toLowerCase())}>
                {cards.map((card, index) => (
                   <Tab key={index} eventKey={card.toLowerCase()} title={<>{card}<FontAwesomeIcon className='ms-1' icon={icons[index]}/></>}/>
                ))}
            </Tabs>
            <div className='scrollbar' style={{height: '68vh'}}>
                {pages[subPage]}
            </div>
        </>
    );
}