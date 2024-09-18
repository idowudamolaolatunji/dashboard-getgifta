import React from 'react'

import DashboardModal from './Modal';

const customStyle = {
	minHeight: "auto",
	maxWidth: "25rem",
	width: "25rem",
};

function AreYouSure({ title, setShowDashboardModal }) {
  return (
    <DashboardModal customStyle={customStyle} title={title} setShowDashboardModal={setShowDashboardModal}>
        
    </DashboardModal>
  )
}

export default AreYouSure
