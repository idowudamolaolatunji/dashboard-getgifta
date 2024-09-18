import React from "react";
import { AiOutlineClose } from "react-icons/ai";

function DashboardModal({ setShowDashboardModal, title, customStyle, children, overLayZIndex, top }) {

	function handleModalClose() {
		setShowDashboardModal(false);
	}

	return (
		<>
			<div className="overlay" onClick={handleModalClose} style={overLayZIndex ? { zIndex: 3500 } : {}} />
			<div className="modal" style={customStyle}>
				<span className="modal--head">
					<p className="modal--heading">{title}</p>
					<AiOutlineClose className="modal--icon" onClick={handleModalClose} />
				</span>

				<div className="modal__content">{children}</div>
			</div>
		</>
	);
}

export default DashboardModal;
