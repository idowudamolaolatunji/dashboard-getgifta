import React, { useEffect, useState } from "react";
import DashHeader from "./DashboardComponents/DashHeader";
import DashTabs from "./DashboardComponents/DashTabs";

// import "./main.css";
import { TfiGift } from "react-icons/tfi";
import GiftImg from '../../Assets/images/casual-life-3d-pink-gift-box.png';
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../../Auth/context/AuthContext";
import SkeletonLoader from '../../Components/SkeletonLoader';
import { dateConverter, expectedDateFormatter, numberConverter, truncate } from "../../utils/helper";
import SkelentonFour from "../../Components/SkelentonFour";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

import { Swiper, SwiperSlide } from 'swiper/react';
// import required modules
import { FreeMode, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { FiPlus } from "react-icons/fi";
import SkelentonOne from "../../Components/SkelentonOne";
import MobileFullScreenModal from "../../Components/MobileFullScreenModal";
import { MdArrowBackIos } from "react-icons/md";
import { IoLocationSharp, IoPricetagOutline } from "react-icons/io5";
import { CiCalendar } from "react-icons/ci";
import TawkToSupport from "../../Components/TawkToSupport";
import { AiFillCheckCircle, AiFillExclamationCircle } from "react-icons/ai";



const DashBoard = () => {
	// const [isLoading, setIsLoading] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [giftings, setGiftings] = useState([]);

	const [selectedGift, setSelectedGift] = useState(null);
	const [showGiftingModal, setShowGiftingModal] = useState(false);

	const [activeTab, setActiveTab] = useState('active');
	const { user, token, notificationCount } = useAuthContext();

	const activeGiftings = giftings?.filter(gifts => !gifts?.isDelivered && !gifts?.isRejected);
	const compltedGiftings = giftings?.filter(gifts => gifts?.isDelivered);
	const RejectedGiftings = giftings?.filter(gifts => !gifts?.isDelivered && gifts?.isRejected);
	const mapGiftings = activeTab === 'active' ? activeGiftings : activeTab === 'completed' ? compltedGiftings : RejectedGiftings;

	const navigate = useNavigate();
	const paramsId = useParams().id;

	function handleGiftPackage(gift) {
		setShowGiftingModal(true);
		setSelectedGift(gift);
	}

	useEffect(function() {
		if(paramsId) {
			const selectedGifting = giftings?.find(gifting => gifting?._id === paramsId)
			handleGiftPackage(selectedGifting);
			navigate('/')
		}
	}, [paramsId])

	
	useEffect(() => {
		async function fetchGiftings() {
			try {
				setIsLoading(true);
				const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/giftings/my-giftings/bought`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
				});
				if(!res.ok) throw new Error('SOmething went wrong!');
				const data = await res.json();
				if(data.status !== 'success') {
					throw new Error(data.message);
				}
				setGiftings(data.data.giftings)
			} catch (err) {
				console.log(err.message)
			} finally {
				setIsLoading(false)
			}
		}
		fetchGiftings();
	}, [notificationCount]);

	useEffect(function() {
		document.title = 'Gifta | User Dashboard'
	}, []);

	console.log(selectedGift)

	return (
		<>
			<DashHeader isDasboard={true} />
			<DashTabs /> 

			<section className="main__section section">
				<div className="section__container">
					{isLoading && ( 
						<>
							<div className='category--spinner-destop'>
								<SkelentonFour />
							</div>

							<div className='category--spinner-mobile'>
								<SkelentonOne height={'18rem'} />
								<SkelentonOne height={'18rem'} />
							</div>
						</>
					)}
					{/* {isLoading && (<SkelentonFour />)} */}
					{giftings?.length > 0 ? (
						<div className="dashboard--gifting">
							<span className='section--flex' style={{ marginBottom: '3.2rem', justifyContent: 'space-between' }}>
								<h3 className="section__heading" style={{ color: '#bb0505', margin: '0' }}>Gifts bought by you!</h3>
								<div className="wallet--tabs">
									<span className={`wallet--tab ${activeTab === "active" && "tab--active"}`} onClick={() => { setActiveTab("active") }}>Active</span>
									<span className={`wallet--tab ${activeTab === "completed" && "tab--active"}`} onClick={() => { setActiveTab("completed") }}>Completed</span>
									<span className={`wallet--tab ${activeTab === "rejected" && "tab--active"}`} onClick={() => { setActiveTab("rejected") }}>Rejected</span>
								</div>
							</span>
								
							<>
								{mapGiftings?.length === 0 && (
									<div className='note--box' style={{ backgroundColor: 'transparent', padding: '0', height: 'auto' }}>
										<p>No {activeTab} Gifting!</p>
									</div>
								)}
							
								<div className="giftPackage__cards">
									{mapGiftings.map(gifting => {
										return (
											<div className='giftPackage--figure' key={gifting._id} onClick={() => handleGiftPackage(gifting)}>
												<img src={gifting ? `${import.meta.env.VITE_SERVER_ASSET_URL}/others/${gifting?.celebrantImage}` : ''} />
												<span className="package--category">{gifting.purpose}</span>
												<figcaption className="giftPackage--details">
													<p className="package--celebrant">For{' '}{gifting.celebrant}</p>
													<p className="package--date">
														{expectedDateFormatter(gifting.date)}
													</p>
													{/* <p className="package--description">{gifting.description}</p> */}
													{/* <span className="package--info"></span> */}
												</figcaption>
											</div>
										)
									})}
								</div> 
							</>

							<Link to={'/dashboard/gifting'}>
								<div className="dashboard--add-btn" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><FiPlus /></div>
							</Link>
						</div>
					) : (!isLoading && giftings?.length === 0) && (
						<div className="gifting--banner banner">
							<h3 className="section__heading">Lift Someone's Spirit With a <span style={{ color: '#bb0505' }}>Gift <TfiGift /></span></h3>
							<img src={GiftImg} alt={GiftImg}  />
							<Link to={'/dashboard/gifting'}>
								<button type="button">Create Gifting</button>
							</Link>
						</div>
					)}
				</div>
			</section>



			{showGiftingModal && (
				<MobileFullScreenModal key={selectedGift?._id}>
					<div className="gift--preview-figure">
						
						<div className="gift--preview-top">
							<img src={selectedGift?.celebrantImage ? `${import.meta.env.VITE_SERVER_ASSET_URL}/others/${selectedGift?.celebrantImage}` : GiftImg} alt={selectedGift?.celebrant} />
							<div className="gift--preview-details">
								<span onClick={() => setShowGiftingModal(false)}><MdArrowBackIos /></span>
								<p className="gift--preview-name">For {selectedGift?.celebrant}</p>
								<p className="gift--preview-date">
									<CiCalendar />
									{expectedDateFormatter(selectedGift?.date)}
								</p>
							</div>
						</div>

						<div className="gift--preview-bottom">
							<span className="gift--preview-title"> Purchased Gift <TfiGift style={{ color: '#bb0505' }} /></span>
							<Link to={`dashboard/gifting/${selectedGift?.gift?.category}`}>
								<div className="gift--preview-flex">
									<img src={`${import.meta.env.VITE_SERVER_ASSET_URL}/products/${selectedGift?.gift?.images[0]}`} />
									<div>
									<p>{truncate(selectedGift?.gift?.name, 30)}</p>
									<span className="gift--preview-price"><IoPricetagOutline /><p>₦{numberConverter(selectedGift?.amount)}</p></span>
									</div>
								</div>
							</Link>
							<span className="gift--preview-title"> Delivery Location <IoLocationSharp style={{ color: '#bb0505' }} /></span>
							<p style={{ fontSize: '1.4rem' }}>{selectedGift?.address}</p>


							{(selectedGift?.isAccepted && !selectedGift?.isDelivered) && (
								<div className='order--code-box'>
									<span className='order-stat accepted-stat'>
										<AiFillCheckCircle className='order--icon' />
										Your Gifting Order Was Approved!
									</span>

									<p className="modal--info" style={{ fontSize: '1.3rem', padding: 0, }}><strong>Note</strong>: <span style={{ color: '#333' }}>Please do not share this code with anyone as it determines you order completion. When gifting order is recieved only should you give vendor access to this code</span></p>

									<span className="order--code">{selectedGift?.deliveryCode}</span>
								</div>
							)}

							{selectedGift?.isDelivered && (
								<div className='order--code-box'>
									<span className='order-stat delivered-stat'>
										<AiFillCheckCircle className='order--icon' />
										Your Gifting Order is Completed.
									</span>
								</div>
							)}

							{selectedGift?.isRejected && (
								<div className='order--code-box'>
									<span className='order-stat rejected-stat'>
										<AiFillExclamationCircle className='order--icon' />
										Your Gifting Order Was Rejected!
									</span>
								</div>
							)}

							{selectedGift?.isAccepted && expectedDateFormatter(selectedGift?.date) === "Date Passed" && (
								<div className='order--code-box'>
									<p className="modal--info" style={{ fontSize: '1.2rem', padding: 0, }}>We understand that your delivery date you request this gifting for has passed, Feel free to request a refund whenever you want.</p>

									<button type='button' className='order--code-btn' style={{ backgroundColor: '#bb0505' }}>Request Refund</button>
								</div>
							)}
						</div>

						
					</div>
				</MobileFullScreenModal>
			)}

			<TawkToSupport />
		</>
	);
};

export default DashBoard;

