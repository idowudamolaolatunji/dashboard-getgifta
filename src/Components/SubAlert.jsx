import React from 'react'
import { LuBadgeInfo } from 'react-icons/lu'
import { useAuthContext } from '../Auth/context/AuthContext'
import { IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

function SubAlert() {
    const navigate = useNavigate();
    const { activeReminder, handleActiveReminder } = useAuthContext();

    function removeGiftItem() {
        handleActiveReminder(null);
        setTimeout(() => {
            navigate('/dashboard/reminders');
        }, 1000);
    }

  return (
    <div className='sub-reminder-alert'>
        <LuBadgeInfo className='sub-reminder-icon' />
        <p>Adding gift to {activeReminder.purpose} reminder</p>
        <IoClose className='sub-reminder-icon' onClick={removeGiftItem} />
    </div>
  )
}

export default SubAlert
