import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
// import GiftLogo from "../../../Assets/gifta-logo.png";
import GiftLogo from "../../../Assets/logo.png";
import { useAuthContext } from "../../../Auth/context/AuthContext";

// import '../../DashBoard/main.css';
import { LuMoon, LuSun, LuUserPlus } from "react-icons/lu";
import { IoNotifications, IoSettingsOutline, IoWalletOutline } from "react-icons/io5";
import Dropdown from "../../../Components/Dropdown";
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdKeyboardDoubleArrowRight, MdOutlineWorkspacePremium } from "react-icons/md";
import { getInitials } from "../../../utils/helper";
import NotificationBox from "../../../Components/NotificationBox";


function Header() {
    const [showDropdown, setShowDropdown] = useState(false);
    const [showNotificationBox, setShowNotificationBox] = useState(false);
    const { user, token, notificationCount } = useAuthContext();

    const location = useLocation();
    const isProfileOrWallet = (!location.pathname.includes('account-profile') && !location.pathname.includes('wallet'))



    return (
        <>
            <header className="dashboard__header" style={ (user?.role === 'vendor' && !user?.isKycVerified && !location.pathname.includes('/kyc-verification')) ? { marginBottom: '10rem' } : { marginBottom: '7.2rem' }}>
                <div className='main-header sticky'>
                    <Link to='/'>
                        <img src={GiftLogo} alt="logo" className="dashboard__logo" />
                    </Link>

                    <div className="dashboard__details">
                        <div className="dashboard__others">
                            
                            {(user && token) && (
                                <>
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
                                </>
                            )}
                        </div>
                        {(token && user) ? (
                            <div className="dashboard__user-profile" onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)} onClick={() => setShowDropdown(!showDropdown)}>
                                {showDropdown && <Dropdown addHomeLink={true} />}

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
                                    {(user?.isPremium && isProfileOrWallet) && (
                                        <div className="premium--tag nav-tag">
                                            <MdOutlineWorkspacePremium />
                                        </div>
                                    )}
                                </span>

                                <span className="profile__user">
                                    <p className="user-username" >{user?.fullName || user?.username}</p>

                                    <p className="user-email">{user?.email}</p>
                                </span>

                                <span>
                                    {!showDropdown && <MdKeyboardArrowDown />}
                                    {showDropdown && <MdKeyboardArrowUp />}
                                </span>
                            </div>
                        ) : (
                            <div className="dashboard__auth-buttons">
                                <Link to={'/login'}>
                                    <span className="dashboard--login-btn">Login</span>
                                </Link>
                                <Link to={'/signup'}>
                                    <span className="dashboard--signup-btn">Signup</span>
                                </Link>
                            </div>
                        )}
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

        </>
    )
}

export default Header
