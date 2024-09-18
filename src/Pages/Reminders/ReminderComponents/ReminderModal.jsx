import React, { useEffect, useState } from 'react';

import Switch from "react-switch";
import { IoIosCloudUpload } from "react-icons/io";
import { IoAdd, IoCheckmarkDone } from "react-icons/io5";

import GiftLoader from '../../../Assets/images/gifta-loader.gif';
import AnimatedLoader from '../../../Assets/images/animated-loader.gif';
import Alert from '../../../Components/Alert';
import { AiFillCheckCircle, AiFillExclamationCircle } from 'react-icons/ai';
import { useAuthContext } from '../../../Auth/context/AuthContext';
import { TfiGift } from 'react-icons/tfi';
import { useNavigate } from 'react-router-dom';


function ReminderModal({ setShowDashboardModal, setHelpReset, reminderItem }) {
    const [isLoadGift, setIsloadGift] = useState(false);
    const [giftItem, setGiftItem] = useState({});
    const [toggle, setToggle] = useState('just-remind');
    const [checkedEmail, setCheckedEmail] = useState(false);
    const [checkedSms, setCheckedSms] = useState(false);
    const [checkRepeat, setCheckRepeat] = useState(false);
    const [addedGift, setAddedGift] = useState(null);
    const [title, setTitle] = useState('');
    const [purpose, setPurpose] = useState('')
    const [imageFile, setImageFile] = useState(null);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('')
    const [contactInfo, setContactInfo] = useState('');
    const [reminderMessage, setReminderMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [message, setMessage] = useState('');
    const [shouldAddProduct, setShouldAddProduct] = useState(false);

	const { token, handleActiveReminder } = useAuthContext();
    const navigate = useNavigate();

    const Loading = () => {
        // return <p style={{ fontSize: '1.4rem', color: '#333' }}>Loading...</p>
        return <img style={{ width: '10rem' }} src={AnimatedLoader} />
    }

    useEffect(function() {
        if(reminderItem) {
            setTitle(reminderItem?.title);
            setPurpose(reminderItem?.purpose);
            setDate(reminderItem?.reminderDate?.split('T')[0]);
            setTime(reminderItem?.reminderTime);
            setCheckedSms(reminderItem?.sendMessage && reminderItem?.sendThrough === 'sms');
            setCheckedEmail(reminderItem?.sendMessage && reminderItem?.sendThrough === 'email');
            setAddedGift(reminderItem?.addedGift)
            setCheckRepeat(reminderItem?.RepeatAllDay);
            setContactInfo(reminderItem?.contactInfo);
            setReminderMessage(reminderItem?.reminderMessage);
        } else {
            setTitle('');
            setPurpose('');
            setDate('');
            setTime('');
            setCheckedSms(false);
            setCheckedEmail(false);
            setCheckRepeat(false);
            setAddedGift(false)
            setContactInfo('');
            setReminderMessage('');
        }
    }, [reminderItem]);


    useEffect(function() {
        async function fetchGiftingById() {
            try {
                setIsloadGift(true)
                const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/giftings/${reminderItem?.addedGift?._id}`, {
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
                setGiftItem(data?.data?.gifting);
            } catch(err) {
                console.error(err);
            } finally {
                setIsloadGift(false);
            }
        }

        if(reminderItem?.addedGift) {
            fetchGiftingById(); 
        }
    }, [reminderItem])


    // useEffect(function() {
    //     if(!title || !purpose || !date || !time) {
    //         setIsComplete(true);
    //     }
    // }, [setTitle, setPurpose, setDate, setTime]);

    function handleToggle(tab) {
        setToggle(tab);
        setCheckedEmail(false)
        setCheckedSms(false)
        setCheckRepeat(false)
    }

    function handleChangeType(next, type) {
        if(type === 'email') {
            setCheckedSms(false);
            setCheckedEmail(next);
        }
        if(type === 'sms') {
            setCheckedEmail(false);
            setCheckedSms(next);
        }
    }

    // function handleUploadImage(e) {
    //     const file = e.target.files[0];
    //     setImageFile(null);
    //     setTimeout(function() {
    //         if(file) {
    //             setImageFile(file);
    //         }
    //     }, 2000);
    // }

    function handleModalClose() {
		setShowDashboardModal(false);
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

    async function handleSetReminder(e) {
        let url, method;
        console.log(reminderItem)
        if(reminderItem) {
            url = `${import.meta.env.VITE_SERVER_URL}/reminders/update-my-reminder/${reminderItem?._id}`
            method = 'PATCH';
        } else {
            url = `${import.meta.env.VITE_SERVER_URL}/reminders/create-reminder`
            method = 'POST';
        }
        try {
            e.preventDefault();
            setIsLoading(true);
            handleReset();
            setHelpReset(false);

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    purpose,
                    reminderDate: date,
                    reminderTime: time,
                    RepeatAllDay: checkRepeat,
                    sendMessage: toggle === 'send-message' ? true : false,
                    sendThrough: checkedEmail && 'email' || checkedSms && 'sms' || "",
                    emailAddress: checkedEmail ? contactInfo : '',
                    phoneNumber: checkedSms ? contactInfo : '',
                    reminderMessage
                })
            });

            if(!res.ok) throw new Error('Something went wrong!');
            const data = await res.json();
            if(data.status !== 'success') {
                throw new Error(err.message);
            }

            // UPLOAD IMAGE
            // const formData = new FormData();
            // const id = data.data.reminder._id;
            // if(imageFile) {
            //     handleUploadImg(formData, id);
            // }

            setIsSuccess(true);
            setMessage(data.message);
            setTimeout(() => {
                setIsSuccess(false);
                setMessage('');
                setHelpReset(true);
                handleModalClose();

                if(shouldAddProduct) {
                    handleActiveReminder(data?.data?.reminder);
                    navigate('/dashboard/reminders/add-gift/birthday');
                }
            }, 2000);

        } catch(err) {
            handleFailure(err.message);
        } finally {
            setIsLoading(false)
        }
    }

  return (
    <>

        {isLoading && (
            <div className='gifting--loader'>
                <img src={GiftLoader} alt='loader' />
            </div>
        )}

        <form className='reminder--form' onSubmit={handleSetReminder}>
            <span className='modal--info' style={{ marginBottom: '.6rem' }}>Wow, you're really on top of your game! We love how organized and thoughtful 💭 you're being. Keep it up - your loved ones 💖 are going to feel so special when you remember all their important dates.</span>
            
            <div className="reminder--flex-2-1">
                <div className="form--item">
                    <label htmlFor="form--title" className="form--label">Title</label>
                    <input type="text" id='form--title' className="form--input" placeholder='Reminder title' value={title} onChange={e => setTitle(e.target.value)} required />
                </div>

                <div className="form--item">
                    <label htmlFor="form--select" className="form--label">Purpose</label>
                    <select id='form--select' className='form--input' value={purpose} required onChange={(e) => setPurpose(e.target.value)}>
                        <option hidden>- Select a Purpose -</option>
                        <option value='birthday'>Birthday</option>
                        <option value='anniversary'>Anniversary</option>
                        <option value='wedding'>Wedding</option>
                        <option value='events'>Other Events</option>
                    </select>
                </div>
            </div>
            
            <div className="reminder--flex-3" style={toggle === 'just-remind' ? { alignItems: 'center'} : {}}>
                <div className="form--item">
                    <label htmlFor="form--date" className="form--label">Date</label>
                    <input type="date" id="form--date" className='form--input' placeholder={date ? '' : 'Reminder Date'} required value={date} min={new Date().toISOString().split('T')[0]} onChange={e => setDate(e.target.value)} />
                </div>
                <div className="form--item">
                    <label htmlFor="form--clock" className="form--label">Time</label>
                    <input type="time" id="form--clock" className='form--input' placeholder={time ? '' : '00:00'} value={time} onChange={e => setTime(e.target.value)} required />
                </div>


                {toggle === 'send-message' && (
                    <div className="form--item form--switches" style={{ marginTop: '1rem' }}>
                   
                        <div className="form--flexy">
                            <Switch
                                onChange={next => handleChangeType(next, 'email')}
                                checked={checkedEmail}
                                className="form--switch"
                                onColor="#bb0505"
                                handleDiameter={18}
                                height={25}
                            />
                            <label htmlFor="form--mail" className="form--label">Email</label>
                        </div>
                        <div className="form--flexy">
                            <Switch
                                onChange={next => handleChangeType(next, 'sms')}
                                checked={checkedSms}
                                className="form--switch"
                                onColor="#bb0505"
                                handleDiameter={18}
                                height={25}
                            />
                            <label htmlFor="form--sms" className="form--label">sms</label>
                        </div>
                    </div>
                    
                )}
            </div>
            <div className="form--item reminder--flex-2" style={{ marginBottom: '1rem' }}>
                <span className='form--toggle'>
                    <span className={`${toggle === 'just-remind' ? 'active' : ''}`} onClick={() => handleToggle('just-remind')}>Just Remind</span>
                    <span className={`${toggle === 'send-message' ? 'active' : ''}`} onClick={() => handleToggle('send-message')}>Send Message</span>
                </span>
                <div className="form--item">
                    {/* <label htmlFor="image" className='form--label-img form--label'><IoIosCloudUpload className='form--label-icon' style={ imageFile ? { color: '#bb0505' } : {}} /> Upload Reminder Image {imageFile ? (<IoCheckmarkDone className="form--label-icon" style={{ color: '#bb0505' }} />) : ''}</label>
                    <input type="file" id='image' className='form--input-img' name='image' accept='image/*' onChange={e => handleUploadImage(e)} /> */}

                    {(!reminderItem?.addedGift) && (
                        <button type='submit' className='form--item-add' onClick={() => setShouldAddProduct(true)}>
                            <span className='form--icon-box'><IoAdd className='icon' /></span>
                            <label className='form--label' style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>Add Gift <TfiGift style={{ color: '#bb0505', fontSize: '1.4rem' }} /></label>
                        </button>
                    )}
                    {(isLoadGift) ? (
                        <Loading />
                    ) : (!isLoadGift && reminderItem?.addedGift) && (
                        <span className="form-added-item">
                            <img src={`${import.meta.env.VITE_SERVER_ASSET_URL}/products/${giftItem?.gift?.images[0]}`} alt={giftItem?._id} />
                            <span>
                                <p>For {giftItem?.celebrant}</p>
                                <p>{giftItem?.address}</p>
                            </span>
                        </span>
                    )}
                </div>
            </div>
            {(toggle === 'send-message' && (checkedEmail || checkedSms)) && (
                <>
                    <div className="form--item">
                        <label htmlFor="form--contact" className='form--label'>{checkedEmail ? 'Recipient Email Address' : checkedSms && 'Recipient Phone Number'}</label>
                        <input type={checkedEmail ? 'text' : 'number'} required id="form--contact" className='form--input' placeholder={checkedEmail ? 'Enter Recipient Email' : checkedSms && 'Enter Recipient Phone'} value={contactInfo} onChange={e =>setContactInfo(e.target.value)} />
                    </div>

                    <div className="form--item">
                        <label htmlFor="form--textare" className="form--label">Reminder Message</label>
                        <textarea id="form--textare" value={reminderMessage} onChange={e => setReminderMessage(e.target.value)} required className="form--input form--textarea" placeholder='Reminder message'></textarea>
                    </div>
                </>
            )}
            <div className="reminder--actions">
                <button type='button' className='cancel--btn' onClick={handleModalClose}>Cancel</button>
                {console.log(!reminderItem)}
                {/* <button type={isCompleted ? 'submit' : ''} className={`set--btn ${!isCompleted ? 'btn-incomplete' : ''}`}>Set Reminder</button> */}
                <button type='submit' className='set--btn'>{reminderItem ? 'Edit' : 'Create'} Reminder</button>
            </div>
        </form> 

        {(isSuccess || isError) && (
            <Alert alertType={`${isSuccess ? "success" : isError ? "error" : ""}`} others={true}>
                {isSuccess ? (
                    <AiFillCheckCircle className="alert--icon" />
                ) : isError && (
                    <AiFillExclamationCircle className="alert--icon" />
                )}
                <p>{message}</p>
            </Alert>
        )}
    </>
  )
}

export default ReminderModal
