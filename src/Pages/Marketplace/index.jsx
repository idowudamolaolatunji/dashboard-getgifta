import React, { useEffect } from "react";
import DashHeader from "../DashBoard/DashboardComponents/DashHeader";
import DashTabs from "../DashBoard/DashboardComponents/DashTabs";
import MarketProducts from "./MarketComponent/MarketProducts";
import Header from "./MarketComponent/Header";

function MarketPlace() {

	useEffect(function() {
		document.title = 'Gifta | Marketplace'
	}, [])

	return (
		<>
			<Header />
            
			<MarketProducts type={'gifting'} />
		</>
	);
}

export default MarketPlace;
