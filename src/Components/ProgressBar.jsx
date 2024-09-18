import React from 'react'
import { RiSafeLine } from 'react-icons/ri';
import { useLocation } from 'react-router-dom';


function ProgressBar({ progress, amountPaid, screen }) {
  const progessNum = Number(progress.slice(0, -1));
  const location = useLocation();

  return (
    <div className='progress--bar'>
      <div className='progress' style={{ width: progress}}>
        <div className="progress--text"  style={progessNum === 0 ? {transform: 'translateX(10%)', color: '#555'} : progessNum <= 12 ? {transform: 'translateX(120%)', color: '#555'} : {paddingRight: '5%', justifyContent: 'flex-end'}}>{progress}</div>
      </div>
      <>
        {(amountPaid && !location.pathname.includes('/dashboard/wishlists/')) && <div className="progress--figure">Accumulated: <p>{amountPaid}</p></div>}
        {(amountPaid && screen === 'desktop') && <div className="progress--figure">Accumulated: <p>{amountPaid}</p></div>}
        {/* {(amountPaid && location.pathname.includes('/dashboard/wishlists/')) && <div className="progress--figure"><p style={{ fontSize: '1.2rem'}}>{amountPaid}</p></div>} */}
        {!amountPaid && <div className="progress--figure">Accumulated: <p>{progress}</p></div>}
      </>
    </div>
  )
}

export default ProgressBar
