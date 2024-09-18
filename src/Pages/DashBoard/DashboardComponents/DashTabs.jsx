import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BsBell } from "react-icons/bs";
import { BsJournalBookmark } from "react-icons/bs";
import { TfiGift } from "react-icons/tfi";
import { BsShop } from "react-icons/bs";
import { LuLayoutDashboard } from "react-icons/lu";
import { HiOutlineLightBulb } from "react-icons/hi2";


import { useAuthContext } from "../../../Auth/context/AuthContext";
import { TbGiftCard } from "react-icons/tb";

const DashTabs = () => {
	const [stay, setStay] = useState(function () {
		return JSON.parse(localStorage.getItem('scrollY'))
	});
	let location = useLocation();
	const { user } = useAuthContext();

	useEffect(function () {
		function controlNavbar() {
			if (window.scrollY > 160) {
				setStay(true)
			} else {
				setStay(false)
			}
		}
		JSON.stringify(localStorage.setItem('scrollY', stay))
		window.addEventListener('scroll', controlNavbar)
		controlNavbar()
		return () => {
			window.removeEventListener('scroll', controlNavbar)
		}
	}, [stay])

	return (
		<section className={`${stay ? 'section--stay' : ''}`}>
			<div className="section__container">
				<div className="dashboard__tabs">
					<Link to="/dashboard" className={`tab ${location.pathname === '/dashboard/' || location.pathname === '/' || location.pathname === '/dashboard' ? 'active-tab' : ''}`}>
						<LuLayoutDashboard className="tab-icon" />
					</Link>

					<Link to="/dashboard/gifting" className={`tab ${location.pathname.includes('/dashboard/gifting') ? 'active-tab' : ''}`}>
						<TfiGift className="tab-icon" />
						<p>Gifting</p>
					</Link>

					<Link to="/dashboard/digital-gift/coupon" className={`tab ${location.pathname.includes('/dashboard/digital-gift') ? 'active-tab' : ''}`}>
						<TbGiftCard className="tab-icon" />
						<p className="tab-morre">Digital Giftings</p>
					</Link>

					<Link to="/dashboard/reminders" className={`tab ${location.pathname.includes('/dashboard/reminders') ? 'active-tab' : ''}`}>
						<BsBell className="tab-icon" />
						<p>Reminders</p>
					</Link>

					<Link to="/dashboard/wishlists" className={`tab ${location.pathname.includes('/dashboard/wishlists') ? 'active-tab' : ''}`}>
						<BsJournalBookmark className="tab-icon" />
						<p>Wishlists</p>
					</Link>

					<Link className={`tab ${location.pathname.includes('/dashboard/idea-box') ? 'active-tab' : ''}`} to="/dashboard/idea-box/her">
						<HiOutlineLightBulb className="tab-icon" />
						<p className="tab-morre">Idea Box</p>
					</Link>
				</div>
			</div>
		</section>
	);
};

export default DashTabs;
