import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../Auth/context/AuthContext';

import Header from './Components/Header'

import VerifiedImg from '../../Assets/images/verified-grunge-stamp-white-background-verified-stamp-106024310-removebg.png';
import PendingImg from '../../Assets/images/pending-stamp-pending-round-grunge-sign-pending-W3CAH8-removebg.png';
import GiftLoader from '../../Assets/images/gifta-loader.gif';
import Alert from '../../Components/Alert';
import { FiUploadCloud } from 'react-icons/fi';
import { MdOutlineAddPhotoAlternate } from 'react-icons/md';
import { SlCloudUpload } from "react-icons/sl";

import { AiFillCheckCircle, AiFillExclamationCircle } from 'react-icons/ai';

import fileImage from '../../Assets/3d-fluency-add-file.png'
import { FaFile } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';


function KycVer() {
    const [kyc, setKyc] = useState({});

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [message, setMessage] = useState('');
    const [helpReset, setHelpReset] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const [docType, setDocType] = useState('');
    const [docNumber, setDocNumber] = useState(null);
    const [frontImage, setFrontImage] = useState(null);
    const [backImage, setBackImage] = useState(null);

    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [dob, setDob] = useState('');
    const [cac, setCac] = useState('');
    const [country, setCountry] = useState('');
    const [checked, setChecked] = useState(false);

    const [formTab, setFormTab] = useState(1);
    const [utilityBill, setUtilityBill] = useState(null);
    const [acctStatement, setAcctStatement] = useState(null);

    const navigate = useNavigate();
    const { user, token, handleUser } = useAuthContext();


    // IMAGE PREVIEW FUNCTION
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageFile(file)
            const imageUrl = URL.createObjectURL(file);
            setImagePreview(imageUrl);
        }
    };

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
            setMessage('');
        }, 3000);
    }

    async function handleSubmitKyc(e) {
        try {
            e.preventDefault();
            handleReset();
            setIsLoading(true);
            setHelpReset(false)

            if(!imageFile) throw new Error('A image of yourself is required');
            if(!frontImage || !backImage) throw new Error(`Both front and back image of your ${docType} is required`);
            if(!utilityBill || !acctStatement) throw new Error(`Utility bill or Account Statement is required`);
            if(!checked) throw new Error('Agree to the condition below!');

            console.log(imageFile, frontImage, backImage, utilityBill, acctStatement);

            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/kycs/upload-kyc-docs`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ documentType: docType, documentNumber: docNumber, address, phoneNumber: phone, dob, country, cac }),
            });
            console.log(res)
            if(!res.ok) throw new Error('Something went wrong!');
            const data = await res.json();
            if (data?.status !== "success") throw new Error(data?.message);
            console.log(data)
            
            // UPLOAD IMAGE
            const formData = new FormData();
            const id = data?.data?.kyc._id
            if(imageFile || frontImage || backImage) {
                console.log('nice')
                handleUploadDocImgs(formData, id);
            }
            setIsSuccess(true);
            setMessage(data.message)
            setTimeout(() => {
                setIsSuccess(false);
                setMessage('');
                setHelpReset(true);
            }, 2000);
        } catch(err) {
            handleFailure(err.message);
        } finally {
            setIsLoading(false)
        }
    }


    async function handleUploadDocImgs(formData, id) {
        try {
            setIsLoading(true);
            formData.append('image', imageFile);
            formData.append('frontimage', frontImage);
            formData.append('backimage', backImage);
            formData.append('utilityBill', utilityBill);
            formData.append('acctStatement', acctStatement);

            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/kycs/upload-kyc-img/${id}`, {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: formData,
                mode: "no-cors"
            });
            if(!res.ok) throw new Error('Something went wrong!');            
        } catch(err) {
            console.log(err.message);
        } finally {
            setIsLoading(false);
        }
    }


    useEffect(function () {
        async function fetchKycDoc() {
            try {
                setIsLoading(true)

                const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/kycs/user/my-kyc`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                if (!res.ok) throw new Error('Something went wrong!');
                const data = await res.json();
                setKyc(data?.data?.kyc[0]);
                handleUser(data?.data?.user);
            } catch (err) {
                console.log(err.message);
            } finally {
                setIsLoading(false);
            }
        }
        fetchKycDoc();
    }, [helpReset]);

    

    useEffect(function() {
		document.title = 'Gifta | KYC Verification';

        window.scrollTo(0, 0)
	}, [])


    return (
        <>
            <Header />

            <section className="product__section section" style={{ marginTop: '10rem'}}>
                <div className="section__container">
                    <span onClick={() => navigate(-1)} className='wishlist--back-btn'>Back</span>

                    <div className="terms--container">
                        <h3 className="terms--heading">KYC Verification</h3>


                        <div className="modal--info">To ensure the security and integrity of our platform, we require all users to undergo a Know Your Customer (KYC) verification process. KYC verification is a crucial step in preventing fraudulent activities and maintaining a safe environment for all participants.</div>


                        {isLoading && (
                            <div className='gifting--loader'>
                                <img src={GiftLoader} alt='loader' />
                            </div>
                        )}

                        {(kyc?.status === 'approved' && user?.isKycVerified) && (
                            <img src={VerifiedImg} style={{ width: '28rem', margin: 'auto' }} />
                        )}

                        {(kyc?.status === 'pending' && !user?.isKycVerified) && (
                            <img src={PendingImg} style={{ width: '28rem', margin: 'auto' }} />
                        )}


                        {((!user?.isKycVerified && kyc?.status !== 'pending') || kyc?.status === 'rejected') && (
                            <>
                                <div className='tab--identifier'>
                                    <span className={`${formTab === 1 ? 'active--tab-id' : '' }`}>Step 1</span>
                                    <span></span>
                                    <span className={`${formTab === 2 ? 'active--tab-id' : '' }`}>Step 2</span>
                                </div>

                                <form className='form kyc--form' onSubmit={handleSubmitKyc}>
                                    {formTab === 1 && (
                                        <>
                                            <p className='section__heading' style={{ margin: '0', marginBottom: '2rem', fontSize: '2.6rem', fontWeight: '500' }}>Start Filling Your Kyc Application Form</p>

                                            <div className="form--grid-kyc">
                                                <div className='form--item form-image-card'>
                                                    <input type='file' id='form-image-input' name='image' onChange={handleImageChange} accept="image/*" capture />
                                                    <label htmlFor='form-image-input' className={`${imagePreview ? 'hoverable' : ''}`} id='form-image-label' style={{ border: '1.8px dashed #ddd' }}>
                                                        <span className='text--box' style={{ display: 'flex', flexDirection: 'column' }}>
                                                            <MdOutlineAddPhotoAlternate style={{ fontSize: '2rem', color: '#555' }} />
                                                            <p>Upload A selfie</p>
                                                        </span>
                                                        {imagePreview && <img id='form-image' src={imagePreview} alt='Preview' />}
                                                    </label>
                                                </div>

                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                    <div className="form--item">
                                                        <label htmlFor="address" className="form--label">Home Address</label>
                                                        <input type="text" id="address" className='form--input' placeholder='5th street, Japan road' value={address} required onChange={e => setAddress(e.target.value)} />
                                                    </div>
                                                    <div className="form--item">
                                                        <label htmlFor="phone" className="form--label">Phone Number</label>
                                                        <input type="number" id="phone" className='form--input' placeholder='2349051623480' required value={phone} onChange={e => setPhone(e.target.value)} />
                                                    </div>
                                                    <div className="form--flex">
                                                        <div className="form--item">
                                                            <label htmlFor="dob" className="form--label">Date of Birth</label>
                                                            <input type="date" id="dob" style={{ width: '100%' }} className='form--input' placeholder='D-O-B' max={'2010-01-01'} required value={dob} onChange={e => setDob(e.target.value)} />
                                                        </div>
                                                        <div className="form--item">
                                                            <label htmlFor="country" className="form--label">Country</label>
                                                            <select className='form__select' id="country" value={country} onChange={e => setCountry(e.target.value)} >
                                                                <option hidden selected>--Select a Country--</option>
                                                                <option value='nigeria'>Nigeria</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form--flex">
                                                <div className="form--item">
                                                    <label htmlFor="doc-type" className="form--label">Document Type</label>
                                                    <select className='form__select' required value={docType} onChange={e => setDocType(e.target.value)} id="doc-type">
                                                        <option hidden selected>--Select a Document Type--</option>
                                                        <option value='id-card'>National ID Card</option>
                                                        <option value='driver-license'>Driver's License</option>
                                                    </select>
                                                </div>
                                                <div className="form--item">
                                                    <label htmlFor="doc-number" className="form--label">{docType === 'id-card' ? 'National Id Card Number' : docType === 'driver-license' ? 'Driver\'s License Number' : 'Document Number'}</label>
                                                    <input type={docType === 'driver-license' ? 'text' : 'number'} id="doc-number" className='form--input' placeholder='7382990134468' required value={docNumber} onChange={e => setDocNumber(e.target.value)} />
                                                </div>
                                            </div>

                                            <div className="form--item doc--grid">
                                                <div className='form--item form-image-card'>
                                                    <label htmlFor='form-image-input-1' id='form-image-label'>
                                                        <span className='text--box'>
                                                            <SlCloudUpload style={{ fontSize: '2.4rem', color: '#444' }} />
                                                            <p className="form-title">Front side of your document</p>
                                                            <p className='form-text'>Uplaod the front side of your document <br /> Support PNG and JPG only </p>
                                                            <input type='file' id='form-image-input-1' name='frontimage' onChange={e => setFrontImage(e.target.files[0])} accept="image/*" />
                                                        </span>
                                                    </label>
                                                </div>


                                                <div className='form--item form-image-card'>
                                                    <label htmlFor='form-image-input-2' id='form-image-label'>
                                                        <span className='text--box'>
                                                            <SlCloudUpload style={{ fontSize: '2.4rem', color: '#444' }} />
                                                            <p className="form-title">Back side of your document</p>
                                                            <p className='form-text'>Uplaod the front side of your document <br /> Support PNG and JPG only </p>
                                                            {/* <button type="button">Choose a file</button> */}
                                                            <input type='file' id='form-image-input-2' name='backimage' onChange={e => setBackImage(e.target.files[0])} accept="image/*" />
                                                        </span>
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="form--item">
                                                <button type='button' className='form--submit' onClick={() => setFormTab(2)}>Next</button>
                                            </div>
                                        </>
                                    )}


                                    {formTab === 2 && (
                                        <>
                                            <p className='section__heading' style={{ margin: '0', fontSize: '2.6rem', fontWeight: '500' }}>Continue Filling Your Kyc Application</p>

                                            <div className="form--item doc--grid">
                                                <div className='form--item form-image-card'>
                                                    <label className='form--label'>Utility Bill (Not more than 3 Months)</label>
                                                    <div id='form-image-label'>
                                                        <span className='text--box kyc-upload'>
                                                            {!utilityBill && (
                                                                <>
                                                                    <FaFile style={{ fontSize: '2.4rem', color: '#555' }} />
                                                                    <p className="form-title">Utility Bill</p>
                                                                    <p className='form-text'>No file <br /> Upload supports PNG, JPG, PDF</p>
                                                                </>
                                                            )}

                                                            {utilityBill && (
                                                                <>
                                                                    <img src={fileImage} alt='' className='form--image' />
                                                                    <p className='form-text'>Utility Bill</p>
                                                                </>
                                                            )}

                                                            <div className='btn--flex'> 
                                                                <label className='upload--btn' htmlFor="form-image-input-3">Upload document</label>
                                                                {utilityBill && <button id='form-close-btn' style={{ padding: '.4rem .8rem'}} onClick={() => setUtilityBill(null)}><IoClose style={{ fontSize: '2rem'}} /></button>}
                                                            </div>
                                                            <input type='file' id='form-image-input-3' name='utilityBill' onChange={e => setUtilityBill(e.target.files[0])} accept="*" />
                                                        </span>
                                                    </div>
                                                </div>


                                                <div className='form--item form-image-card'>
                                                    <label className='form--label'>Previous statement of account bearing your name</label>
                                                    <div id='form-image-label'>
                                                        <span className='text--box kyc-upload'>
                                                            {!acctStatement && (
                                                                <>
                                                                    <FaFile style={{ fontSize: '2.4rem', color: '#555' }} />
                                                                    <p className="form-title">Statement of Account</p>
                                                                    <p className='form-text'>No file <br /> Upload supports PNG, JPG, PDF</p>
                                                                </>
                                                            )}

                                                            {acctStatement && (
                                                                <>
                                                                    <img src={fileImage} alt='' className='form--image' />
                                                                    <p className='form-text'>Statement of Account</p>
                                                                </>
                                                            )}

                                                            <div className='btn--flex'>
                                                                <label className='upload--btn' htmlFor="form-image-input-4">Upload document</label>
                                                                {acctStatement && <button id='form-close-btn' style={{ padding: '.4rem .8rem'}} onClick={() => setAcctStatement(null)}><IoClose style={{ fontSize: '2rem'}} /></button>}
                                                            </div>
                                                            <input type='file' id='form-image-input-4' name='acctStatement' onChange={e => setAcctStatement(e.target.files[0])} accept="*" />
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="form--item">
                                                    <label htmlFor="cac" className='form--label'>CAC Number (Optional)</label>
                                                    <input type="text" className='form--input' value={cac} onChange={(e) => setCac(e.target.value)} id='cac' placeholder='10002345' />
                                                </div>
                                            </div>
                                    

                                            <div className="form--item">
                                                <span id='form-check'>
                                                    {/* <input type="checkbox" id="form--checkbox" required value={checked} onChange={e => setChecked(e.target.value)} /> */}
                                                    <input type="checkbox" id="form--checkbox" value={checked} onChange={e => setChecked(e.target.value)} />
                                                    <label htmlFor="form--checkbox" className='form--label'>I confirm that I uploaded Goverment-issued ID photo. Including Picture, Telephone, Address and DOB</label>
                                                </span>
                                            </div>

                                            <div className="form--item form--btns-grid">
                                                <button type='button' className='form--submit' onClick={() => setFormTab(1)}>Prev</button>
                                                <button type="submit" className='form--submit'>Continue</button>
                                            </div>
                                        </>
                                    )}
                                </form>
                            </>
                        )}

                    </div>
                </div>
            </section>


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
    )
}

export default KycVer;
