import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'

function PaymentLog({ setShowModal, title, id }) {
    return (
        <div className="notification--mobile">
            <p className='notification--title'>{`Wish Contributors Log`}</p>
            <AiOutlineClose className='notification-close-icon' onClick={() => setShowModal(false)} />


            {/* <div className="notification--tabs">
                <div className={`notification--tab ${tab === 'unread' ? 'tab--active' : ''}`} onClick={() => setTab('unread')}>Unread ({unreadNotification?.length})</div>
                <div className={`notification--tab ${tab === 'read' ? 'tab--active' : ''}`} onClick={() => setTab('read')}>Read ({readNotification?.length})</div>
            </div> */}

        <div className='notification--box'>
            <p>{title} Contributors Log</p>
        </div>


        </div>
    )
}

export default PaymentLog
