import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { useParams } from 'react-router-dom';

function MobileFullScreenModal({ title, setCloseModal, isDifferent, children }) {

    function handleCloseModal() {
        setCloseModal(false);
        setSelected(null);
    }
    
    return (
        <>
        <div className='overlay' onClick={handleCloseModal} />
        <figure className='mobile-modal--figure'>

            {(title || setCloseModal) && (
                <div className="resuable-modal--head">
                    {title && (<p className='notification--title'>{title}</p>)}
                    {setCloseModal && (<AiOutlineClose className='notification-close-icon' onClick={handleCloseModal}  />)}
                </div>
            )}

            <div className="modal--content-box">
                {children}
            </div>
        </figure>

        </>
    )
}

export default MobileFullScreenModal
