import React, { useEffect, useState } from 'react'
import Header from './Components/Header';
import GiftLoader from '../../Assets/images/gifta-loader.gif';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../Auth/context/AuthContext';
import { getInitials, truncate } from '../../utils/helper';
import { MdContentCopy, MdOutlineAddAPhoto, MdOutlineWorkspacePremium } from 'react-icons/md';
import { AiFillCheckCircle, AiFillExclamationCircle } from 'react-icons/ai';
import Alert from '../../Components/Alert';


function AccountProfile() {
    const { user, token, handleUser } = useAuthContext();

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const [fullName, setFullName] = useState(user?.fullName || '');
    const [location, setLocation] = useState(user?.location || '');

    const navigate = useNavigate();

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageFile(file);
            // setImageFile(prev => prev === file);
            const imageUrl = URL.createObjectURL(file);
            setImagePreview(imageUrl);
        }
    };

    function copyInput(url) {
        navigator.clipboard.writeText(`https://app.getgifta.com/invite/${url}`);
        setIsSuccess(true);
        setMessage('Referral Link Copied!')
        setTimeout(() => {
            setIsSuccess(false);
            setMessage('')
        }, 1500);
    }

    console.log(imageFile)

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

    async function handleProfileUpdate(e) {
        try {
            e.preventDefault();
            handleReset();
            setIsLoading(true)

            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/users/me/update-profile`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ fullName, location }),
            });
            if (!res.ok) throw new Error('Something went wrong!');
            const data = await res.json();
            if (data.status !== "success") throw new Error(data.message);

            // UPLOAD IMAGE
            const formData = new FormData();
            if (imageFile) {
                const result = await handleImageUpload(formData)
                handleUser(result);
            }else{
                handleUser(data?.data?.user);
            }

            setIsSuccess(true);
            setMessage("Profile Updated Successful!");
            //handleUser(data.data.user);
            setTimeout(function() {
                setIsSuccess(false);
                setMessage("");
            }, 2000);
        } catch (err) {
            handleFailure(err.message)
        } finally {
            setIsLoading(false);
        }
    }

    async function handleImageUpload(formData) {
        try {
            setIsLoading(true)
            formData.append('image', imageFile);
            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/users/me/update-profile-photo`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData,
            });
            if (!res.ok) throw new Error('Something went wrong!');
            const data = await res.json();
        //    handleUser(data?.data?.user);
            setImageFile(null)
            return data?.data?.user;
        } catch(err) {
            console.log(err.message);
        } finally {
            setIsLoading(false)
        }
    }

    // useEffect(function() {
    //     async function handleImageUpload(formData) {
    //         try {
    //             // setIsLoading(true)
    //             formData.append('image', imageFile);
    //             const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/users/me/update-profile-photo`, {
    //                 method: 'PATCH',
    //                 headers: {
    //                     // "Content-Type": 'application/json',
    //                     Authorization: `Bearer ${token}`
    //                 },
    //                 body: formData,
    //                 // mode: "no-cors"
    //             });
    //             if (!res.ok) throw new Error('Something went wrong!');
    //             const data = await res.json();
    //             handleUser(data.data.user);
    //         } catch(err) {
    //             console.log(err.message);
    //         } finally {
    //             // setIsLoading(false)
    //         }
    //     }

    //     const timeoutId = setTimeout(function() {
    //         const formData = new FormData();
    //         handleImageUpload(formData)
    //     }, 10000);

    //     return () => clearTimeout(timeoutId);
    // }, [imageFile]);

    useEffect(function() {
		document.title = 'Gifta | Account Profile';

        window.scrollTo(0, 0)
	}, [])

    return (
        <>
            {isLoading && (
                <div className='gifting--loader'>
                    <img src={GiftLoader} alt='loader' />
                </div>
            )}

            <Header />

            <section className="section account__section">
                <div className="section__container">
                    <span onClick={() => navigate(-1)} className='wishlist--back-btn'>Back</span>
                    <h3 className="settings--heading">Your Account Profile</h3>

                    <div className="account--container">
                        <div className="account--top">
                            <div className='form--item'>
                                <input type='file' id='profile-image-input' name='image' onChange={handleImageChange} accept="image/*" />
                                <label htmlFor='profile-image-input' className={`${imagePreview ? 'hoverable' : ''}`} id='profile-image-label'>
                                    <span className='image--label' style={{ zIndex: 100 }}>
                                        <MdOutlineAddAPhoto style={{ fontSize: '2.4rem' }} />
                                        <p>Add Image</p>
                                    </span>

                                    {(user?.image) ? (
                                        <img
                                            alt={user?.fullName + " 's image"}
                                            src={`${import.meta.env.VITE_SERVER_ASSET_URL}/users/${user?.image}`}
                                            style={imagePreview ? { display: 'none' } : {}}
                                        />
                                    ) : (!imagePreview || !user?.image) && (
                                        <span className="user__img-initials" style={imagePreview ? { display: 'none' } : {}}>
                                            {getInitials(user?.fullName || user.username)}
                                        </span>
                                    )}
                                    {(imagePreview) && (
                                        <img src={imagePreview} alt='Wishlist Preview' />
                                    )}

                                    {user?.isPremium && (
                                        <div className="premium--tag">
                                            <p style={{ display: 'flex', alignItems: 'center', gap: '.2rem' }}>Premium <MdOutlineWorkspacePremium style={{ fontSize: '1.6rem' }} /></p>
                                        </div>
                                    )}
                                </label>
                            </div>

                            <p className="wallet--user-name">{user.fullName || user.username}</p>
                        </div>

                        <form className="account--form" onSubmit={e => e.preventDefault()}>
                            <h3 className="setting-form--heading">Edit Profile</h3>

                            <div className="form--item">
                                <label className="form--label" htmlFor="fullName">
                                    Full name
                                </label>
                                <input className="form--input" id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} type="text" placeholder="Enter your full name" />
                            </div>
                            <div className="form--item">
                                <label className="form--label" htmlFor="email">
                                    Email address
                                </label>
                                <input
                                    className="form--input disable"
                                    id="email"
                                    type="email"
                                    readOnly="readonly"
                                    value={user?.email}
                                />
                            </div>
                            <div className="form--item">
                                <label className="form--label" htmlFor="username">
                                    Username
                                </label>
                                <input
                                    className="form--input disable"
                                    id="username"
                                    type="text"
                                    readOnly="readonly"
                                    value={user?.username}
                                />
                            </div>
                            <div className="form--item">
                                <label className="form--label" htmlFor="url">
                                    Referal URL
                                </label>
                                <div className="input--box">
                                    <input
                                        onClick={() => copyInput(user?.referralCode)}
                                        className="form--input disable"
                                        id="url"
                                        type="text"
                                        readOnly="readonly"
                                        value={truncate(`https://app.getgifta.com/invite/${user?.referralCode}`)}
                                    />
                                    <MdContentCopy className='input--icon' onClick={() => copyInput(user?.referralCode)} />
                                </div>
                            </div>

                            <div className="form--item">
                                <label className="form--label" htmlFor="address-location">
                                    Location
                                </label>
                                <input
                                    className="form--input"
                                    id="address-location"
                                    type="location"
                                    placeholder="Enter a location"
                                    value={location}
                                    onChange={e => setLocation(e.target.value)}
                                />
                            </div>


                            <div className="form--item">
                                <button className="btn form-btn" onClick={handleProfileUpdate}>
                                    Edit profile
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>


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
    )
}

export default AccountProfile
