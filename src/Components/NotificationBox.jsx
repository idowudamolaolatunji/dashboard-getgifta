import React, { useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { PiNotepadThin, PiNotificationDuotone } from "react-icons/pi";
import { useAuthContext } from '../Auth/context/AuthContext';
import { dateConverter } from '../utils/helper';


function NotificationBox({ showNotificationBox, setShowNotificationBox }) {
    const [tab, setTab] = useState('unread');
    const { token, notifications, notificationCount, handleSetNotification } = useAuthContext();

    const unreadNotification = notifications?.filter(notification => notification.status === 'unread');
    const readNotification = notifications?.filter(notification => notification.status === 'read');
    const notificationArr = tab === 'unread' ? unreadNotification : readNotification;

    async function handleSetReadNotifications() {
        try {
            if (notificationCount === 0) return;

            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/notifications/mark-as-read/my-notifications`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            });
            if (!res.ok) throw new Error('Something went wrong');
            const data = await res.json();
            if (data.status !== "success") throw new Error(data.message);
            
            const count = data?.data?.notifications?.filter(notification => notification.status === 'unread' );
			handleSetNotification(data.data.notifications, count.length);
        } catch (err) {
            console.log(err.message);
        }
    }

    function handleReadNotification() {
        handleSetReadNotifications();
        setShowNotificationBox(false)
    }

    

    return (
        <>
            <div className="notification--overlay" onClick={handleReadNotification}></div>
            <div className="notification--desktop">
                <p className='notification--title'>Notification.</p>
                <div className="notification--tabs">
                    <div className={`notification--tab ${tab === 'unread' ? 'tab--active' : ''}`} onClick={() => setTab('unread')}>Unread ({unreadNotification?.length >= 9 ? '9+' : unreadNotification?.length})</div>
                    <div className={`notification--tab ${tab === 'read' ? 'tab--active' : ''}`} onClick={() => setTab('read')}>Read ({readNotification?.length > 9 ? '9+' : readNotification?.length})</div>
                </div>
                {(notifications?.length > 0) ? (
                    <div className='notification--box'>
                        {notificationArr.length > 0 ? notificationArr?.map(notification => (
                            <div className="notification--figure" key={notification?._id} >
                                <p className='notification--topic'>{notification.title}</p>
                                <p className='notification--content'>{notification.content}</p>
                                <p className='notification--date'>{dateConverter(notification.date)}</p>
                            </div>
                        )) : (
                            <div className='notification-empty'>
                                <PiNotepadThin className='notification--icon' />
                                <p>You have ({notificationArr?.length}) {tab} notification!</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className='notification-empty'>
                        <PiNotepadThin className='notification--icon' />
                        <p>You have ({notifications?.length}) {tab} notification!</p>
                    </div>
                )}
            </div>


            <div className="notification--mobile">
                <p className='notification--title'>Notification.</p>
                <AiOutlineClose className='notification-close-icon' onClick={handleReadNotification} />


                <div className="notification--tabs">
                    <div className={`notification--tab ${tab === 'unread' ? 'tab--active' : ''}`} onClick={() => setTab('unread')}>Unread ({unreadNotification?.length >= 9 ? '9+' : unreadNotification?.length})</div>
                    <div className={`notification--tab ${tab === 'read' ? 'tab--active' : ''}`} onClick={() => setTab('read')}>Read ({readNotification?.length > 9 ? '9+' : readNotification?.length})</div>
                </div>
                {(notifications?.length > 0) ? (
                    <div className='notification--box'>
                        {notificationArr.length > 0 ? notificationArr?.map(notification => (
                            <div className="notification--figure" key={notification?._id} >
                                <div className='notification--top'>
                                    <PiNotificationDuotone className='note--icon' />
                                    <p className='notification--topic'>{notification.title}</p>
                                </div>
                                <p className='notification--content'>{notification.content}</p>
                                <p className='notification--date'>{dateConverter(notification.date)}</p>
                            </div>
                        )) : (
                            <div className='notification-empty'>
                                <PiNotepadThin className='notification--icon' />
                                <p>You have ({notificationArr?.length}) {tab} notification!</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className='notification-empty'>
                        <PiNotepadThin className='notification--icon' />
                        <p>You have no notification!</p>
                    </div>
                )}
            </div>


        </>
    )
}

export default NotificationBox
