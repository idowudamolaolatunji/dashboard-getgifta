import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import GiftLogo from "../../../Assets/gifta-logo.png";
import GiftLogo from "../../../Assets/logo.png";
import { useAuthContext } from "../../../Auth/context/AuthContext";

import { IoNotifications, IoSettingsOutline, IoWalletOutline } from "react-icons/io5";
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdKeyboardDoubleArrowRight, MdOutlineWorkspacePremium } from "react-icons/md";
import Dropdown from "../../../Components/Dropdown";
import { LuSun, LuMoon, LuLayoutDashboard, LuUserPlus } from "react-icons/lu";
import { TfiGift } from "react-icons/tfi";
import { BsBell, BsJournalBookmark, BsShop } from "react-icons/bs";
import { getInitials } from "../../../utils/helper";
import NotificationBox from "../../../Components/NotificationBox";
import { PiHandbagSimple } from "react-icons/pi";
import { TbGiftCard } from "react-icons/tb";
import { HiOutlineLightBulb } from "react-icons/hi2";


function WishListDashHeader() {
	const [showDropdown, setShowDropdown] = useState(false);
	// const [mode, setMode] = useState('light');
	const [showNotificationBox, setShowNotificationBox] = useState(false);
	const { user, notificationCount } = useAuthContext();

	return (
		<>
			<header className="dashboard__header" style={{ marginBottom: '12rem' }}>
				<div className='main-header sticky'>
					<Link to='/'>
						<img src={GiftLogo} alt="logo" className="dashboard__logo" />
					</Link>

					<div className="dashboard__details">
						<div className="dashboard__others">

							<span className="dashboard__icon-box" style={{ cursor: 'pointer' }} onClick={() => setShowNotificationBox(!showNotificationBox)}>
								<IoNotifications className="dashboard__icon" style={{ fontSize: '2.8rem' }} />
								{notificationCount > 0 && (<span>{notificationCount >= 9 ? '9+' : notificationCount}</span>)}
							</span>
							{showNotificationBox && (
								<NotificationBox showNotificationBox={showNotificationBox} setShowNotificationBox={setShowNotificationBox} />
							)}


							{user.role !== 'vendor' && (
								<Link to="/vendor">
									<span className="dashboard__icon-box dashboard-vendor">
										<LuUserPlus className="dashboard__icon" />
									</span>
								</Link>
							)}

							<Link to="/settings">
								<span className="dashboard__icon-box">
									<IoSettingsOutline className="dashboard__icon" />
								</span>
							</Link>

							<Link to="/wallet">
								<span className="dashboard__icon-box">
									<IoWalletOutline className="dashboard__icon" />
								</span>
							</Link>
						</div>

						<div className="dashboard__user-profile" onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)} onClick={() => setShowDropdown(!showDropdown)} >
							{showDropdown && <Dropdown />}

							<span style={{ position: 'relative' }}>
								{(user?.image !== "") ? (
									<img
										alt={user?.fullName + " 's image"}
										src={`${import.meta.env.VITE_SERVER_ASSET_URL}/users/${user?.image}`}
										className='profile__img'
									/>
								) : (
									<span className="profile__img-initials">
										{getInitials(user?.fullName || user?.username)}
									</span>
								)}
								{user?.isPremium && (
									<div className="premium--tag nav-tag">
										<MdOutlineWorkspacePremium />
									</div>
								)}
							</span>

							<span className="profile__user">
								<p className="user-username" >{user.fullName || user.username}</p>
								<p className="user-email">{user.email}</p>
							</span>

							<span>
								{!showDropdown && <MdKeyboardArrowDown />}
								{showDropdown && <MdKeyboardArrowUp />}
							</span>
						</div>
					</div>
				</div>
			</header>

			{(user?.role === 'vendor' && !user?.isKycVerified) && (
                <div className="subscribe--header">
                    <p>Compulsory that vendors completes</p>
                    <Link to={'/kyc-verification'}>
                        Kyc Verification
                        <MdKeyboardDoubleArrowRight />
                    </Link>
                </div>
            )}

			<section className='section--tab' style={(user?.role === 'vendor' && !user?.isKycVerified) ? { top: '10.4rem' } : {}} >
				<div className="section__container">
					<div className="dashboard__tabs">
						<Link className="tab" to="/dashboard">
							<LuLayoutDashboard className="tab-icon" />
						</Link>

						<Link className="tab" to="/dashboard/gifting">
							<TfiGift className="tab-icon" />
							<p>Gifting</p>
						</Link>
						
						<Link className="tab" to="/dashboard/digital-gift/coupon">
							<TbGiftCard className="tab-icon" />
							<p className="tab-morre">Digital Giftingss</p>
						</Link>

						<Link className="tab" to="/dashboard/reminders">
							<BsBell className="tab-icon" />
							<p>Reminders</p>
						</Link>

						<Link className="tab active-tab" to="/dashboard/wishlists">
							<BsJournalBookmark className="tab-icon" />
							<p>Wishlists</p>
						</Link>

						<Link className="tab" to="/dashboard/idea-box/her">
							<HiOutlineLightBulb className="tab-icon" />
							<p className="tab-morre">Idea Box</p>
						</Link>
					</div>
				</div>
			</section>

		</>
	);
};

export default WishListDashHeader;
