import React from 'react'
import { AiOutlineClose } from 'react-icons/ai';

function DeleteModalUi({title, setShowDeleteModal, children}) {

    function handleCloseDeleteModal() {
        setShowDeleteModal(false)
    }
    return (
        <>
            <div className='delete--overlay' onClick={handleCloseDeleteModal} />
            <div className='delete--modal'>
                <span className="modal--head">
					<p className="modal--heading">{title}</p>
					<AiOutlineClose className="modal--icon" onClick={handleCloseDeleteModal} />
				</span>
				<div className="modal__content">{children}</div>
            </div>
        </>
    )
}

export default DeleteModalUi
