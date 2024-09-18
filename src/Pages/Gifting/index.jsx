import React, { useState, useEffect } from 'react';

import { TfiGift } from "react-icons/tfi";
import DashHeader from "../DashBoard/DashboardComponents/DashHeader";
import DashTabs from "../DashBoard/DashboardComponents/DashTabs";
import Categories from "./GiftingComponents/Categories";


function Gifting() {
	
	return (
		<>
			<DashHeader />
			<DashTabs />

			<section className="gifting__section section">
                <div className="section__container">

                    <h3 className="section__heading">Send gifts <span style={{ color: '#bb0505' }}><TfiGift /></span> to friends <span style={{ color: '#bb0505' }}>and loved ones!</span></h3>
                    <Categories />

                </div>
			</section>
		</>
	);
}

export default Gifting;
