import React, { useEffect, useState } from "react";
import DashHeader from "../DashBoard/DashboardComponents/DashHeader";
import DashTabs from "../DashBoard/DashboardComponents/DashTabs";

import ReminderImg from '../../Assets/images/props-loud-speaker.png';
import DashboardModal from "../../Components/Modal";
import ReminderModal from "./ReminderComponents/ReminderModal";
import { expectedDateFormatter, formatDate } from "../../utils/helper";
import { useAuthContext } from "../../Auth/context/AuthContext";
import SkelentonFour from "../../Components/SkelentonFour";
import { RiDeleteBin5Line } from "react-icons/ri";
import Alert from "../../Components/Alert";
import { AiFillCheckCircle, AiFillExclamationCircle } from "react-icons/ai";
import GiftLoader from '../../Assets/images/gifta-loader.gif';
import SkelentonOne from "../../Components/SkelentonOne";
import { FiPlus } from "react-icons/fi";
import { IoHeart } from "react-icons/io5";
import { TiSpanner } from "react-icons/ti";
import { useParams } from "react-router-dom";


const customStyle = {
	minHeight: "auto",
	maxWidth: "52rem",
	width: "52rem",
};

const customStyleOthers = {
	minHeight: "auto",
	maxWidth: "44rem",
	width: "44rem",
};

function Reminders() {
	const [showDashboardModal, setShowDashboardModal] = useState(false);
	const [showCompleteModal, setShowCompleteModal] = useState(false);
	const [showPostponeModal, setShowPostponeModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false)
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [isLoadingImg, setIsLoadingImg] = useState(false);
	const [reminders, setReminders] = useState([]);
	const [helpReset, setHelpReset] = useState(false);
	const [reminderId, setReminderId] = useState(null);
	const [selectedReminder, setSelectedReminder] = useState({})
	// const [selectedReminder, setSelectedReminder] = useState({});

	const [isError, setIsError] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [message, setMessage] = useState('');

	const [date, setDate] = useState('');
	const [time, setTime] = useState('');

	const [activeTab, setActiveTab] = useState('pending')

	const { token } = useAuthContext();

	// const { category } = useParams();

	const remainingReminder = reminders.filter(reminder => !reminder.isCompleted);
	const completedReminder = reminders.filter(reminder => reminder.isCompleted);
	const mapReminder = activeTab === 'pending' ? remainingReminder : completedReminder


	function handleCreateReminder() {
		setShowDashboardModal(true)
		setSelectedReminder(null);
	}
	function handleResetId() {
		setReminderId(null)
	}
	function handleShowModal() {
		setShowDashboardModal(true);
	}
	function handleCloseModal(type) {
		handleResetId();
		// setSelectedReminder({})
		if(type === 'complete') {
			setShowCompleteModal(false);
		}
		if(type === 'postpone') {
			setShowPostponeModal(false)
		}
		if(type === 'delete') {
			setShowDeleteModal(false);
		}
	}

	function handleDeleteModal(id) {
		handleResetId();
		setShowDeleteModal(true);
		setReminderId(id);
	}
	function handlePostponeModal(item) {
		handleResetId();
		setShowPostponeModal(true);
		setReminderId(item._id);
	}
	function handleEditModal(item) {
		handleResetId();
		setShowEditModal(true);
		setReminderId(item._id);
		setSelectedReminder(item);
	}
	// console.log(selectedReminder, 'line 99');


	function handleCompleteModal(id) {
		handleResetId();
		setShowCompleteModal(true);
		setReminderId(id);
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

	async function handleCompleteReminder() {
		try {
			setIsLoadingImg(true);
			handleReset();
			setHelpReset(false)

			const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/reminders/mark-as-completed/${reminderId}`, {
				method: 'PATCH',
				headers: {
					"Comtent-Type": "application/json",
					Authorization: `Bearer ${token}`,
				}
			})
			console.log(res);
			if (!res.ok) throw new Error('Something went wrong!');
			const data = await res.json();
			if (data.status !== "success") {
				throw new Error(data.message)
			}
			setIsSuccess(true);
			setMessage(data.message)
			setTimeout(() => {
				setIsSuccess(false);
				setMessage('');
				setHelpReset(true);
				handleCloseModal('complete');
			}, 2000);
		} catch (err) {
			handleFailure(err.message);
		} finally {
			setIsLoadingImg(false);
		}
	}

	async function handleDeleteReminder() {
		try {
			setIsLoadingImg(true);
			handleReset();
			setHelpReset(false)

			const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/reminders/delete-my-reminder/${reminderId}`, {
				method: 'DELETE',
				headers: {
					"Comtent-Type": "application/json",
					Authorization: `Bearer ${token}`,
				}
			});
			console.log(res);
			if (!res.ok) throw new Error('Something went wrong!');

			const data = await res.json();
			if (data.status !== "success") {
				throw new Error(data.message)
			}

			setIsSuccess(true);
			setMessage('Reminder deleted!');
			setTimeout(() => {
				setIsSuccess(false);
				setMessage('');
				handleCloseModal('delete');
				setHelpReset(true);
			}, 1500);

		} catch (err) {
			handleFailure(err.message);
		} finally {
			setIsLoadingImg(false);
		}
	}

	async function handlePostponeReminder(e) {
		try {
			e.preventDefault();
			setIsLoadingImg(true);
			setHelpReset(false);
			handleReset();
			console.log(date, time)

			// const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/reminders/postpone-reminder/${reminderId}`, {
			const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/reminders/postpone-reminder/${date}/${time}/${reminderId}`, {
				method: 'PATCH',
				headers: {
					"Comtent-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				// body: JSON.stringify({
				// 	reminderDate: date,
                //     reminderTime: time
				// })
			});
			console.log(res);
			if (!res.ok) throw new Error('Something went wrong!');
			const data = await res.json();
			if (data.status !== "success") {
				throw new Error(data.message)
			}
			setIsSuccess(true);
			setMessage(data.message)
			setTimeout(() => {
				setIsSuccess(false);
				setMessage('');
				setHelpReset(true);
				handleCloseModal('postpone');
			}, 2000);
		} catch (err) {
			handleFailure(err.message);
		} finally {
			setIsLoadingImg(false);
		}
	}


	useEffect(function () {
		async function handleFetchReminders() {
			try {
				setIsLoading(true);
				const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/reminders/my-reminders`, {
					method: 'GET',
					headers: {
						"Content-Type": 'application/json',
						Authorization: `Bearer ${token}`
					}
				});
				if (!res.ok) {
					throw new Error('Something went wrong!');
				}
				const data = await res.json();
				if (data.status !== 'success') {
					throw new Error(data.message)
				}
				setReminders(data.data.reminders)
			} catch (err) {
				console.log(err.message)
			} finally {
				setIsLoading(false)
			}
		}
		handleFetchReminders();
	}, [helpReset]);


	useEffect(function() {
		document.title = 'Gifta | Reminder'
	}, []);


	return (
		<>
			{isLoadingImg && (
				<div className='gifting--loader'>
					<img src={GiftLoader} alt='loader' />
				</div>
			)}
			<DashHeader />
			<DashTabs />

			<section className="section reminder__section" style={{ position: 'relative' }}>
				<div className="section__container">
					{isLoading && (
						<>
							<div className='category--spinner-destop'>
								<SkelentonFour />
							</div>

							<div className='category--spinner-mobile'>
								<SkelentonOne height={'15rem'} />
								<SkelentonOne height={'15rem'} />
							</div>
						</>
					)}

					{(reminders.length > 0 && !isLoading) ? (
						<>
							<span className='section--flex' style={{ marginBottom: '2.6rem', }}>
								<h3 className="section__heading" style={{ marginTop: '-1rem',  fontSize: '2.2rem' }}>Set reminders for <span style={{ color: '#bb0505' }}>love ones</span> and special occations! <span style={{ color: '#bb0505', fontSize: '2.4rem' }}><IoHeart /></span></h3>
								<div className="wallet--tabs">
									<span className={`wallet--tab ${activeTab === "pending" && "tab--active"}`} onClick={() => { setActiveTab("pending") }}>Pending</span>
									<span className={`wallet--tab ${activeTab === "completed" && "tab--active"}`} onClick={() => { setActiveTab("completed") }}>Completed</span>
								</div>
							</span>
							{mapReminder.length === 0 && (
								<div className='note--box'>
									<p>No {activeTab} Gifting!</p>
								</div>
							)}
							<div className="reminder__grid">
								{/* <button className="w-figure--btn" onClick={handleShowModal}>Set Reminder</button> */}
								{mapReminder?.map(reminder => (
									<figure key={reminder._id} className="reminder--figure" style={{ backgroundImage: `linear-gradient(rgba(225, 225, 225, .8), rgba(225, 225, 225, 0.8)), url(${import.meta.env.VITE_SERVER_ASSET_URL}/others/${reminder?.image})`}} >
										<p className="reminder--text">{reminder.title}.</p>
										<span className="figure--bottom">
											<span className="reminder--others">
												<span className="reminder--date">
													<p>Date</p>
													{formatDate(reminder?.reminderDate)}{" "}
													({expectedDateFormatter(`${reminder.reminderDate}`)})
												</span>
												{(!reminder?.addedGift) && <RiDeleteBin5Line className="reminder--icon" onClick={() => handleDeleteModal(reminder._id)} />}
											</span>
											<span className="reminder--tasks">
												{!reminder.isCompleted ? (
													<>
														<span onClick={() => handleCompleteModal(reminder._id)}>Mark Complete</span>
														<TiSpanner style={{ fontSize: '2.6rem' }} className="reminder--icon" onClick={() => handleEditModal(reminder)} />
													</>
												) : (
													<span style={{ cursor: 'auto'}}>Reminder Completed!!</span>
												)}
											</span>
										</span>
									</figure>
								))}
							</div>
							<div className="dashboard--add-btn" onClick={() => handleCreateReminder()}><FiPlus /></div>
						</>
					) : (!isLoading) && (
						<div className="reminder--banner banner">
							<h3 className="section__heading">Lift us remind you of your <span style={{ color: '#bb0505' }}>special dates!</span></h3>

							<img src={ReminderImg} alt={ReminderImg} />
							<button type="button" onClick={handleCreateReminder}>Set a Reminder</button>
						</div>
					)}
				</div>
			</section>

			{(showDashboardModal || showEditModal) && (
				<DashboardModal title={`${showEditModal ? 'Edit' : 'New'} Reminder`} customStyle={customStyle} setShowDashboardModal={showDashboardModal ? setShowDashboardModal : setShowEditModal}>
					<ReminderModal setShowDashboardModal={showDashboardModal ? setShowDashboardModal : setShowEditModal} setHelpReset={setHelpReset} reminderItem={selectedReminder} />
				</DashboardModal>
			)}

			{showCompleteModal && (
				<DashboardModal customStyle={customStyleOthers} title={'Mark Reminder as Completed'} setShowDashboardModal={setShowCompleteModal}>
					<p className='modal--text-2'>You want to Complete this Reminder!</p>
					<span className='modal--info'>Note that everything relating data to this wish would also be deleted including transaction history!</span>
					<div className="reminder--actions" style={{ marginTop: '1.4rem' }}>
						<button type='button' className='cancel--btn' onClick={() => handleCloseModal('complete')}>Cancel</button>
						<button type='submit' className='set--btn' onClick={handleCompleteReminder}>Complete Reminder</button>
					</div>
				</DashboardModal>
			)}

			{showPostponeModal && (
				<DashboardModal customStyle={customStyleOthers} title={'Postpone Reminder'} setShowDashboardModal={setShowPostponeModal}>
					<p className='modal--text-2'>Are you sure you want to postpone this reminder?</p>
					<span className='modal--info'>Note that everything relating data to this wish would also be deleted including transaction history!</span>
					<form className="reminder--form" onSubmit={handlePostponeReminder}>
						<div className="reminder--flex-2 postpone--flex">
							<div className="form--item">
								<label htmlFor="form--date" className="form--label">Date</label>
								<input type="date" id="form--date" className='form--input' required placeholder={date ? '' : 'Reminder Date'} value={date} min={new Date().toISOString().split('T')[0]} onChange={e => setDate(e.target.value)} />
							</div>
							<div className="form--item">
								<label htmlFor="form--clock" className="form--label">Time</label>
								<input type="time" id="form--clock" className='form--input' value={time} placeholder={time ? '' : '00:00'} onChange={e => setTime(e.target.value)} required />
							</div>
						</div>
						<div className="reminder--actions" style={{ marginTop: '1.4rem' }}>
							<button type='button' className='cancel--btn' onClick={() => handleCloseModal('postpone')}>Cancel</button>
							<button type='submit' className='set--btn'>Postpone Reminder</button>
						</div>
					</form>
				</DashboardModal>
			)}

			{showDeleteModal && (
				<DashboardModal customStyle={customStyleOthers} title={'Delete This Reminder!'} setShowDashboardModal={setShowDeleteModal}>
					<p className='modal--text'>Are you sure you want to delete this Reminder?</p>
					<span className='modal--info'>Note that everything relating data to this reminder would also be deleted including transaction history!</span>
					<div className="reminder--actions" style={{ marginTop: '1.4rem' }}>
						<button type='button' className='cancel--btn' onClick={() => handleCloseModal('delete')}>Cancel</button>
						<button type='submit' className='set--btn' onClick={() => handleDeleteReminder(reminderId)}>Delete</button>
					</div>
				</DashboardModal>
			)}


			{(isSuccess || isError) && (
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

export default Reminders;
