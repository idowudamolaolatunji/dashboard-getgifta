import { useEffect, useRef, useState } from "react";
// import GiftLogo from "../../../Assets/gifta-logo.png";
import GiftLogo from "../../../Assets/logo.png";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../../Auth/context/AuthContext";

import { IoSettingsOutline, IoSearchOutline, IoWalletOutline, IoNotifications } from "react-icons/io5";
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdOutlineWorkspacePremium } from "react-icons/md";
import Dropdown from "../../../Components/Dropdown";
import { LuSun, LuMoon, LuUserPlus } from "react-icons/lu";
import { getInitials } from "../../../utils/helper";
import SearchModal from "../../../Components/SearchModal";
import { AiOutlineClose } from "react-icons/ai";
import { IoIosNotificationsOutline } from "react-icons/io";
import NotificationBox from "../../../Components/NotificationBox";



const DashHeader = ({ isDasboard }) => {
	const [show, setShow] = useState(false);
	const [showDropdown, setShowDropdown] = useState(false);
	// const [mode, setMode] = useState('light');

	const [searchQuery, setSearchQuery] = useState('');
	const [showSearchModal, setShowSearchModal] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState('');
	const [results, setResults] = useState({});
	const [clicked, setClicked] = useState(false);
	const [showNotificationBox, setShowNotificationBox] = useState(false);

	const { user, token, handleSetNotification, notificationCount  } = useAuthContext();

	function handleCloseSearch() {
		setSearchQuery('');
		setClicked(false);
	}

	useEffect(function () {
		function controlNavbar() {
			if (window.scrollY > 150) {
				setShow(true)
			} else {
				setShow(false)
			}
		}
		window.addEventListener('scroll', controlNavbar)
		controlNavbar()
		return () => {
			window.removeEventListener('scroll', controlNavbar)
		}
	}, []);

	console.log(showNotificationBox)


	useEffect(function () {
		const fetchSearch = setTimeout(async function () {
			try {
				if (searchQuery.trim() === '' || !setSearchQuery) {
					setShowSearchModal(false)
					setResults({});
					return;
				}

				setMessage('');
				setIsLoading(true);
				setShowSearchModal(true);

				const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/search?query=${searchQuery}`
					, {
						method: 'GET',
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`
						},
					});

				if (!res.ok) throw new Error('Something went wrong!');
				setIsLoading(true)

				const data = await res.json();
				setShowSearchModal(true);
				setResults(data.data.results);

			} catch (err) {
				if (err.name !== "AbortError") {
					setMessage(err.message)
					setShowSearchModal(false)
				}
			} finally {
				setIsLoading(false);
			}
		}, 350)

		return function () {
			clearTimeout(fetchSearch)
		};

	}, [searchQuery]);


	

	return (
		<header className="dashboard__header">
			<div className={`main-header ${(show || (!show && showNotificationBox)) ? 'sticky' : ''}`}>
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

					<div className="dashboard__user-profile" onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)} onClick={() => setShowDropdown(!showDropdown)}>
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
							{showDropdown && <MdKeyboardArrowUp/>}
						</span>
					</div>
				</div>
			</div>

			<section className="hero__section">
				<div className="section__container">
					<div className="header__box">
						<h1>Welcome Back, {user.fullName?.split(" ")[0] || user.username}!</h1>

						<p>What will you do on Gifta today?</p>
					</div>

					{isDasboard && <div className='input-box'>
						<input className="header__input" id="search" type="search" placeholder="Search Gifta..." onChange={e => setSearchQuery(e.target.value)} value={searchQuery} onClick={() => setClicked(true)} />

						<IoSearchOutline className="header__icon" />

						{showSearchModal && <SearchModal showSearchModal={showSearchModal} setShowSearchModal={setShowSearchModal} isLoading={isLoading} message={message} results={results} closeIcon={true} />}
					</div>}



					{(isDasboard && clicked) && (
						<div className={'input--box-modal input__isClick'}>
							<span>
								<input className="search--input" id="search" type="search" placeholder="Search Gifta..." onChange={e => setSearchQuery(e.target.value)} value={searchQuery} />

								<AiOutlineClose className="search--input-icon" onClick={handleCloseSearch} />
							</span>

							{showSearchModal && <SearchModal showSearchModal={showSearchModal} setShowSearchModal={setShowSearchModal} isLoading={isLoading} message={message} results={results} closeIcon={false} />}
						</div>
					)}


				</div>
			</section>
		</header>
	);
};

export default DashHeader;
