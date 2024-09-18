import React,{ useEffect, useState } from "react";
import DashHeader from "../DashBoard/DashboardComponents/DashHeader";
import DashTabs from "../DashBoard/DashboardComponents/DashTabs";

import WishlistImg from "../../Assets/images/3d-plastilina-adding-bookmark-symbol.png";
import { BsBookmarkCheck } from "react-icons/bs";
import DashboardModal from "../../Components/Modal";
import WishlistForm from "./WishlistsComponents/WishlistForm";
import GiftLoader from '../../Assets/images/gifta-loader.gif';
import { useAuthContext } from "../../Auth/context/AuthContext";
import { dateConverter } from "../../utils/helper";
import { PiPlusBold, PiShareFatFill } from "react-icons/pi";
import { ShareSocial } from 'react-share-social';
import { AiFillCheckCircle, AiFillExclamationCircle } from "react-icons/ai";
import Alert from "../../Components/Alert";
import { Link, useNavigate } from "react-router-dom";
import SkelentonTwo from "../../Components/SkelentonTwo";
import SkelentonOne from "../../Components/SkelentonOne";
import SkelentonCard from "../../Components/SkelentonCard";
import { IoEllipsisVerticalSharp } from "react-icons/io5";
import DeleteModalUi from './WishlistsComponents/DeleteModalUi'
import { FiPlus } from "react-icons/fi";
import { TbJewishStarFilled } from "react-icons/tb";
import { CiViewList } from "react-icons/ci";


const customStyle = {
	minHeight: "auto",
	maxWidth: "48rem",
	width: "48rem",
};

const shareCustomStyle = {
	root: {
		padding: 0,
		marginTop: '-1.2rem',
	},
	copyContainer: {
		fontWeight: 600,
		fontSize: '1.6rem',
		padding: '1rem',
	},
}

function Wishlists() {
	const [share, setShare] = useState(false);
	const [url, setUrl] = useState('')
	const [showDashboardModal, setShowDashboardModal] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [wishLists, setWishLists] = useState([]);
	const [selectedWishList, setSelectedWishList] = useState({});

	const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
	const [isLoadingDel, setIsLoadingDel] = useState(false);

	const [helpReset, setHelpReset] = useState(false);
	const [showActionInfo, setShowActionInfo] = useState(false);
	const [selectedId, setSelectedId] = useState(null);
	const [showDeleteModal, setShowDeleteModal] = useState(false)
	const [showWishListEditModal, setShowWishListEditModal] = useState(false);

	const [activeTab, setActiveTab] = useState('')

	const { user, token } = useAuthContext();
	const navigate = useNavigate();

	function handleActionInfo(id) {
		setSelectedId(id);
		setShowActionInfo(true);
	}

	function handleActionInfoLeave() {
		setShowActionInfo(false);
	}

	function handleSelectedWishList(data) {
		setSelectedWishList(data);
		setShowWishListEditModal(!showWishListEditModal)
	}

	function handleSelectedDeleteWishList(id) {
		setSelectedId(id);
		setShowDeleteModal(true);
	}

	function handleModal() {
		setShowDashboardModal(true);
	}

	function handleShare(link, hasWish) {
		if(hasWish) {
			setShare(true);
			setUrl(link);
		} else {
			handleFailure('No wish to share!');
			setShare(false);
			setUrl('');
		}
	}

	 // HANDLE FETCH STATE RESET
	function handleReset() {
        setIsError(false);
        setMessage('')
        setIsSuccess(false);
    }

	// HANDLE ON FETCH FAILURE
    function handleFailure(mess) {
        setIsError(true);
        setMessage(mess)
        setTimeout(() => {
            setIsError(false);
            setMessage('')
        }, 3000);
    }

	async function handleDeleteWishlist() {
		try {
			setIsLoadingDel(true);
            handleReset();
            setHelpReset(false);
            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/wishlists/delete-my-wishlist/${selectedId}`, {
                method: "DELETE",
                headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
            });
            if(!res.ok) {
				throw new Error('Something went wrong!');
			}

            const data = await res.json();
			if(data?.message === "You cannot perfom this task, Upgrade Account!") {
				setTimeout(() => {
					navigate('/plans');
				}, 1500);
				throw new Error(data.message);
			}
            if(data.status !== "success") {
				throw new Error(data.message);
            }

            setIsSuccess(true);
			setMessage('Wishlist deleted successfully!');
			setTimeout(() => {
				setShowDeleteModal(false);
				setIsSuccess(false);
				setMessage("");
				setHelpReset(true);
			}, 1500);

        } catch (err) {
            handleFailure(err.message);
			console.error(err)
        } finally {
            setIsLoadingDel(false);
        }
	}

	

	useEffect(function () {
		async function fetchWishlists() {
			try {
				setIsLoading(true);
				const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/wishlists/user-wishlists/wishlists`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
				});
				
				if (!res.ok) throw new Error('Something went wrong!');
				const data = await res.json();
				if (data.status !== 'success') {
					throw new Error(data.message);
				}
				setIsLoading(false)
				setWishLists(data.data.wishLists);
				console.log(data)
			} catch (err) {
				console.log(err);
				setIsLoading(false)
			}
		}
		fetchWishlists();
	}, [helpReset]);


	useEffect(function() {
		document.title = 'Gifta | Wishlists'
	}, [])


	return (
		<>
			<DashHeader />
			<DashTabs />
			<section className="wishlist__section section">
				<div className="section__container" style={{ position: 'relative' }}>

					<>
						{isLoadingDel && (
							<div className='gifting--loader'>
								<img src={GiftLoader} alt='loader' />
							</div>
						)}
					</>

					{/* {isLoading && (<SkelentonTwo />)} */}
					{isLoading &&  (
							
					<>
						<div className='category--spinner-destop'>
							<div className='wishlist--grid' style={{ columnGap: '8rem' }}>
								<SkelentonCard />
								<SkelentonCard />
								<SkelentonCard />
							</div>
						</div>

						<div className='category--spinner-mobile'>
							<SkelentonOne height={'12.4rem'} />
							<SkelentonOne height={'12.4rem'} />
						</div>
					</>
					)}

					{(wishLists && wishLists.length > 0) ? (
						<>
							<span className='section--flex'>
								<h3 className="section__heading heading--flex" style={{ fontSize: '2.2rem', lineHeight: '1' }}>My wishlists <span style={{ color: '#bb0505', fontSize: '2.4rem' }}><CiViewList /></span></h3>
								{/* <select className="wallet--tabs-mobile" value={activeTab} onChange={(e) => { setActiveTab(e.target.value) }}>
									// loop categories here 
                                    <option value="subscription">Subscription</option>
                                </select> */}
							</span>
							<div className='wishlist--grid'>
								{/* <button className="w-figure--btn" onClick={handleModal}>Create Wishlist</button> */}
								{wishLists.map(wishList => (
									<>
										<figure key={wishList._id} className="wishlist--figure w-figure-action" onMouseLeave={() => handleActionInfoLeave()} >
											<span className="w-figure-category">{wishList.category}</span>
											<a target='_blank' href={`${import.meta.env.VITE_SERVER_ASSET_URL}/others/${wishList.image}`}>
												<img className="w-figure--image" src={`${import.meta.env.VITE_SERVER_ASSET_URL}/others/${wishList.image}`} alt={wishList.image} />
											</a>
											<figcaption className="w-figure--details">
												<div className="w-figure--head">
													<span className="w-figure--title">{wishList.name}</span>
													<div className="w-figure--icons">
														{(user.isPremium || (!user.isPremium && wishList?.wishes.length < 10)) && (
															<Link to={`/dashboard/wishlists/${wishList?.slug}`}>
																<PiPlusBold className='figure--icon' onClick={() => localStorage.setItem('wishNewModal', JSON.stringify(true)) }/>
															</Link>
														)}
														<PiShareFatFill className='figure--icon' onClick={() => handleShare(`https://app.getgifta.com/shared/${wishList.shortSharableUrl}`, wishList.wishes.length > 0)}  />
														<IoEllipsisVerticalSharp className="figure--icon" onClick={() => handleActionInfo(wishList._id)} />
														{(showActionInfo && selectedId === wishList._id) && (
															<ul className="w-figure--action-list">
																<li onClick={() => handleSelectedWishList(wishList)}>Edit</li>
																<li onClick={() => handleSelectedDeleteWishList(wishList._id)}>Delete</li>
															</ul>
														)}
													</div>
												</div>
												{wishList.wishes.length === 0 ? (
													<p className="no-wish-item">You've no wish yet!</p>
												) : (
													<ul className="wish--list">
														{wishList.wishes.slice(0, 5).map(wishItem => (
															<li className="wish--item">{wishItem.wish}</li>
														))}
													</ul>
												)}
												<div className="w-figure--info">
													{wishList?.wishes.length >= 1 && (
														<Link to={`/dashboard/wishlists/${wishList?.slug}`}>
															<span className="w-figure--view-more">View All ({wishList.wishes.length})</span>
														</Link>
													)}
													<span className="wish--date">{dateConverter(wishList.updatedAt)}</span>
												</div>
											</figcaption>
										</figure>


										{/*  */}
										<Link className="wishlist--figure-m" to={`/dashboard/wishlists/${wishList?.slug}`}>
											<figure key={wishList._id} className="wishlist--figure w-figure-action w-figure--mobile">
												<a target='_blank' href={`${import.meta.env.VITE_SERVER_ASSET_URL}/others/${wishList.image}`}>
													<img className="w-figure--image" src={`${import.meta.env.VITE_SERVER_ASSET_URL}/others/${wishList.image}`} alt={wishList.image} />
												</a>
												<figcaption className="w-figure--details">
													<div className="w-figure--head">
														<span className="w-figure--title">{wishList.name}</span>
													</div>
													<li className="w-figure-category">{wishList.category}</li>
												</figcaption>
											</figure>
										</Link>
									</>
								))}
							</div>

							<div className="dashboard--add-btn" onClick={() => setShowDashboardModal(true)}><FiPlus /></div>

						</>
					) : (wishLists && wishLists.length === 0 && !isLoading) && (
						<div className="wishlist--banner banner">
							<h3 className="section__heading">
								Make yourself a wishlist and
								<span style={{ color: "#bb0505" }}>
									{' '}share with friends <BsBookmarkCheck />
								</span>
							</h3>
							<img src={WishlistImg} alt={WishlistImg} />
							<button type="button" onClick={handleModal}>
								Create Wishlist
							</button>
						</div>
					)}
				</div>
			</section>


			{showDashboardModal && (
				<DashboardModal
					title={'Create your Wishlist'}
					customStyle={customStyle}
					setShowDashboardModal={setShowDashboardModal}
				>
					<WishlistForm setShowDashboardModal={setShowDashboardModal} setHelpReset={setHelpReset} />
				</DashboardModal>
			)}

			{showWishListEditModal && (
				<DashboardModal
					title={'Update your Wishlist'}
					customStyle={customStyle}
					setShowDashboardModal={setShowWishListEditModal}
				>
					<WishlistForm itemData={selectedWishList} setShowDashboardModal={setShowWishListEditModal} setHelpReset={setHelpReset} />
				</DashboardModal>
			)}

			{share && (
				<DashboardModal
					title={'Make your wish come true! Share Link'}
					setShowDashboardModal={setShare}
					customStyle={customStyle}
					>
					<ShareSocial  
						url={url}
						socialTypes= {['facebook','twitter', 'whatsapp', 'telegram', 'linkedin']}
						onSocialButtonClicked={ (data) => console.log(data)}  
						style={shareCustomStyle}
					/>
				</DashboardModal>
			)}

			{(showDeleteModal) && (
				<DeleteModalUi title={`Delete WishList!`} setShowDeleteModal={setShowDeleteModal}>
					<p className='modal--text'>Are you sure you want to delete this WishList?</p>
					<span className='modal--info'>Note that everything relating data to this WishList would also be deleted including transaction history!</span>
					<div className="modal--actions">
						{console.log(selectedId)}
						<span type="submit" className='delete--cancel' onClick={() => setShowDeleteModal(false)}>Cancel</span>
						<span type="button" className='delete--submit' onClick={handleDeleteWishlist}>Delete WishList</span>
					</div>
				</DeleteModalUi>
			)}

			{(isError || isSuccess) && (
                <Alert alertType={`${isSuccess ? "success" : isError ? "error" : ""}`}>
                    {isSuccess ? (
                        <AiFillCheckCircle className="alert--icon" />
                    ) : isError && (
                        <AiFillExclamationCircle className="alert--icon" />
                    )}
                    <p>{message}</p>
                </Alert>
            )}
		</>
	);
}

export default Wishlists;
