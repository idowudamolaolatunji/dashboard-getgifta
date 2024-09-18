import Cookies from 'js-cookie';
import React, { useState, useEffect } from 'react';
import { MdKeyboardBackspace, MdOutlineAddAPhoto } from "react-icons/md";
import { useAuthContext } from '../../../Auth/context/AuthContext';
import { calcTotalAmount, numberConverter } from '../../../utils/helper';
import { PaystackButton } from 'react-paystack';
import Alert from '../../../Components/Alert';
import Spinner from '../../../Components/Spinner';
import GiftLoader from '../../../Assets/images/gifta-loader.gif';
import { AiFillCheckCircle, AiFillExclamationCircle } from 'react-icons/ai';
import { TbArrowBackUp } from 'react-icons/tb';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import { FaLongArrowAltLeft } from 'react-icons/fa';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';


function GiftingForm({ handleHideForm, handleCloseModal }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [message, setMessage] = useState('');
    const [wallet, setWallet] = useState(null);
    ////////////////////////////////////////////////////////////
    const [celebrant, setCelebrant] = useState('')
    const [description, setDescription] = useState('')
    const [address, setAddress] = useState('')
    const [country, setCountry] = useState('Nigeria')
    const [state, setState] = useState('')
    const [contact, setContact] = useState(null)
    const [date, setDate] = useState('')
    const [cardPay, setCardPay] = useState(false);
    const [walletPay, setWalletPay] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [formTab, setFormTab] = useState(1)
    ////////////////////////////////////////////////////////////
    const { user, token, activeReminder, handleActiveReminder } = useAuthContext();
    const navigate = useNavigate();
    const productInfo = Cookies.get('productInfo') ? JSON.parse(Cookies.get('productInfo')) : null;
    const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
    const totalAmount = calcTotalAmount(Number(productInfo.totalPrice));
    const charges = totalAmount - productInfo.totalPrice;
    const amountInKobo = totalAmount * 100;
    const timeout = 3000;
    /////////////////////////////////////////////////////////////

    console.log(productInfo, 'Line 48')
    

    const componentProps = {
        email: user?.email,
        amount: amountInKobo,
        metadata: {
            name: user?.fullName,
        },
        text: 'Pay & Save Gifting',
        publicKey,
        onSuccess: ({ reference }) => handlePaystackPayment(reference),
        onClose: handleFailure,
    };


    function validate() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate());

        const fieldsAreFilled =
          celebrant !== "" &&
          address !== "" &&
          country !== "" &&
          state !== "" &&
          contact !== null &&
          date !== "" && 
          new Date(date) >= tomorrow;
      
        const onePaymentMethod = (walletPay && !cardPay) || (!walletPay && cardPay);
      
        return fieldsAreFilled && onePaymentMethod;
    }
    const validations = validate();
    console.log(validations)

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
        }, timeout);
    }
    
    // IMAGE PREVIEW FUNCTION
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageFile(file)
            const imageUrl = URL.createObjectURL(file);
            setImagePreview(imageUrl);
        }
    };


    // FUNCTION THAT MAKES THE DECISION BASED ON WHAT TO DO!
    function handleForm(e) {
        e.preventDefault();
        if(walletPay) {
            handleWalletPayment();
            return;
        }
    }


    // EFFECT FUNCTION THAT FETCHES THE USER WALLET
    useEffect(function() {
        async function getWallet() {
            try {
                const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/wallet`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                if(!res.ok) throw new Error('Something went wrong!');
                const data = await res.json();
                setWallet(data.data.wallet);
            } catch(err) {
                console.log(err);
            }
        }
        getWallet();
    }, []);

    // MAKE PAYMENT FROM CARD / PAYSTATCK
    async function handlePaystackPayment(reference) {
        try {
            handleReset();
            setIsLoading()
            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/giftings/payment-verification/${reference}/${charges}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ productId: productInfo?.id }),
            });
            if(!res.ok) throw new Error('Something Went Wrong!');
            const data = await res.json();
            console.log(data)

            if(data.status !== 'success') {
                throw new Error(data.message);
            }
            setIsSuccess(true);
            setMessage(data.message)
            setTimeout(function() {
                setIsSuccess(false);
                setMessage();
                handleFormSubmit();
            }, 1500);
        } catch(err) {
            handleFailure(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    // MAKE PAYMENT FROM WALLET BALANCE
    async function handleWalletPayment() {
        try {
            if(!walletPay) return;
            handleReset();
            setIsLoading(true);
            if(wallet.walletBalance < productInfo.totalPrice) throw new Error('InSufficient funds, Why with card Instead');

            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/giftings/payment-wallet/`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ amount: productInfo.totalPrice, productId: productInfo.id }),
            });

            if(!res.ok) throw new Error('Something went wrong!');

            const data = await res.json();
            console.log(data);
            if(data.status !== 'success') {
                throw new Error(data.message)
            }
            setIsSuccess(true);
            setMessage(data.message)
            setTimeout(function() {
                setIsSuccess(false);
                setMessage('');
                handleFormSubmit();
            }, 1500);
        } catch(err) {
            handleFailure(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    // FUNCTION THAT HANDLES THE SUBMITTING OF THE GIFTING PACKAGE
    async function handleFormSubmit() {
        try {
            handleReset();
            setIsLoading(true);

            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/giftings/create-gifting/`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ productId: productInfo.id, celebrant, purpose: productInfo.purpose, description, amount: productInfo.totalPrice, country, state, contact, address, date, quantity: productInfo.quantity }),
            });
            console.log(res)
            if(!res.ok) throw new Error('Something went wrong!');
            const data = await res.json();
            console.log(data)

            if(data.status !== 'success') {
                throw new Error(data.message);
            }

            // IMAGE UPLOAD
            const formData = new FormData();
            const id = data.data.gifting._id
            // console.log(id);
            handleUploadImg(formData, id);

            if(activeReminder) {
                handleAddGifting(id);
            }

            setIsSuccess(true);
            setMessage('Purchased Product Successfully');
            setTimeout(function() {
                setIsSuccess(false);
                setMessage('');
                handleCloseModal();
            }, 2000);
        } catch(err) {
            handleFailure(err.message)
            setIsLoading(false);
        }
    }

    // UPLOAD NECESSARY IMAGE(S)
    async function handleUploadImg(formData, id) {
        try {
            formData.append('image', imageFile);
            await fetch(`${import.meta.env.VITE_SERVER_URL}/giftings/gifting-img/${id}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    // Authorization: `Bearer ${token}`
                },
                body: formData,
                mode: "no-cors"
            });


            setIsSuccess(true);
            setMessage('Purchased Product Successfully');
            
        } catch(err) {
            handleFailure(err.message);
        }
    }
    
    
    
    async function handleAddGifting(id) {
        try {
            setIsLoading(true);

            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/reminders/add-gift/${activeReminder?._id}`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    giftId: id
                }),
            });

            if(!res) throw new Error('Something went wrong!');
            const data = await res.json();
            if(data.status !== 'success') throw new Error(data.message);

            setIsSuccess(true);
            setMessage('Added gift to reminder')
            setTimeout(() => {
                setIsSuccess(false);
                setMessage('');
                setIsLoading(false);
                handleActiveReminder(null);
                navigate('/dashboard/reminders');
            }, 2000);

        } catch(err) {
            handleFailure(err.message);
        }
    }

   
  return (
      <>

        {createPortal(
            isLoading && (
                <div className='gifting--loader'>
                    <img src={GiftLoader} alt='loader' />
                </div>
            ), document.body
        )}

        <form className='gifting--form form' onSubmit={handleForm}>
            <MdKeyboardBackspace className='form--icon' onClick={handleHideForm} />
            <h4 className="form--heading">Upload Celebrant Details</h4>
            <div className="form__flex-main">

                <div className="form__flex-col">
                    <div className='form--item form-image-card'>
                        {!imagePreview && <p className='image-text'>Event | Celebrant Image (Optional)</p>}
                        <input type='file' id='form-image-input' name='image' onChange={handleImageChange} accept="image/*" />
                        <label htmlFor='form-image-input' className={`${imagePreview ? 'hoverable' : ''}`} id='form-image-label'>
                            <span>
                                <MdOutlineAddAPhoto />
                                <p>Add Image</p>
                            </span>
                            {imagePreview && <img id='form-image' src={imagePreview} alt='Wishlist Preview' />}
                        </label>
                    </div>

                    <div className='form__item'>
                        <label htmlFor="" className="form__label">Address</label>
                        <textarea type="text" value={address} id='address' className="form__textarea" placeholder='Enter Celebrant Address' onChange={(e) => setAddress(e.target.value)}></textarea>
                    </div>
                </div>


                <div className="form__flex-col">
                    <div className="form__flex-small">
                        <div className='form__item'>
                            <label htmlFor="" className="form__label">Event Name / Celebrant Fullname</label>
                            <input type="text" value={celebrant} placeholder='Event / Celebrant Name' className="form__input" onChange={(e) => setCelebrant(e.target.value)} />
                        </div>
                        <div className='form__item'>
                            <label htmlFor="" className="form__label">Contact Number</label>
                            <input type="number" value={contact} placeholder='080230267911' required className="form__input" onChange={(e) => setContact(e.target.value)} />
                        </div>

                    </div>
                    <div className='form__item'>
                        <label htmlFor="description" className="form__label">Description (for gifting)</label>
                        <textarea type="text" id='description' value={description} placeholder='Description for gifting' className="form__textarea" onChange={(e) => setDescription(e.target.value)}></textarea>
                    </div>
                </div>
            </div>

            <div className="form__flex-row">
                
                <div className='form__item'>
                    <label htmlFor="country" className="form__label">Country</label>
                    <select type="text" id='country' value={country} className="form__select" onChange={(e) => setCountry(e.target.value)}>
                        <option value="Nigeria" selected>Nigeria</option>
                    </select>
                </div>
                <div className='form__item'>
                    <label htmlFor="state" className="form__label">State</label>
                    <select type="text" id="state" value={state} className="form__select" onChange={(e) => setState(e.target.value)}>
                        <option hidden selected>- Select a State -</option>
                        <option value="Abuja">Abuja FCT</option>
                        <option value="Abia">Abia</option>
                        <option value="Adamawa">Adamawa</option>
                        <option value="Akwa-Ibom">Akwa Ibom</option>
                        <option value="Anambra">Anambra</option>
                        <option value="Bauchi">Bauchi</option>
                        <option value="Bayelsa">Bayelsa</option>
                        <option value="Benue">Benue</option>
                        <option value="Borno">Borno</option>
                        <option value="Cross-River">Cross River</option>
                        <option value="Delta">Delta</option>
                        <option value="Ebonyi">Ebonyi</option>
                        <option value="Edo">Edo</option>
                        <option value="Ekiti">Ekiti</option>
                        <option value="Enugu">Enugu</option>
                        <option value="Gombe">Gombe</option>
                        <option value="Imo">Imo</option>
                        <option value="Jigawa">Jigawa</option>
                        <option value="Kaduna">Kaduna</option>
                        <option value="Kano">Kano</option>
                        <option value="Katsina">Katsina</option>
                        <option value="Kebbi">Kebbi</option>
                        <option value="Kogi">Kogi</option>
                        <option value="Kwara">Kwara</option>
                        <option value="Lagos">Lagos</option>
                        <option value="Nassarawa">Nassarawa</option>
                        <option value="Niger">Niger</option>
                        <option value="Ogun">Ogun</option>
                        <option value="Ondo">Ondo</option>
                        <option value="Osun">Osun</option>
                        <option value="Oyo">Oyo</option>
                        <option value="Plateau">Plateau</option>
                        <option value="Rivers">Rivers</option>
                        <option value="Sokoto">Sokoto</option>
                        <option value="Taraba">Taraba</option>
                        <option value="Yobe">Yobe</option>
                        <option value="Zamfara">Zamfara</option>
                    </select>
                </div>

                <div className='form__item form__item-date'>
                    <label htmlFor="date" className="form__label">Date of Delivery</label>
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                        <input id='date' value={date} type="date" min={new Date().toISOString().split('T')[0]} className='form__date' onChange={(e) => setDate(e.target.value)} />
                        {/* <span class="validity"></span> */}
                    </span>
                </div>
            </div>

            <div className="form__inline">
                <div id='form--balance'>
                    <div className="form__item">
                        <label htmlFor="checkbox-1" className="form__label">Pay With Wallet</label>
                        <input type="checkbox" id='checkbox-1' className='form__check' checked={walletPay} onChange={(e) => { setWalletPay(e.target.checked); setCardPay(false); }} />
                    </div>
                    
                    <p style={{ display: 'flex', alignItems: 'center', fontSize: '1rem', gap: '.4rem' }}>
                        {(walletPay && wallet) &&
                            <>
                                <span style={{ fontWeight: '600', color: '#777' }}>
                                    Balance:
                                </span>
                                <p>₦{numberConverter(wallet.walletBalance)}</p>
                            </> 
                        }
                    </p>
                </div>
                <div className='form__item'>
                    <label htmlFor="checkbox-2" className="form__label">Pay From Bank</label>
                    <input type="checkbox" id='checkbox-2' className='form__check' checked={cardPay} onChange={(e) => { setCardPay(e.target.checked); setWalletPay(false); }} />
                </div>
            </div>
            

            <div className="form__item">
                {!validations && <button type="submit" className="form__submit btn" disabled style={{ cursor: 'not-allowed', opacity:'0.5' }}>Pay & Save Gifting</button>}

                {(validations && cardPay) && (<PaystackButton className="form__submit btn" {...componentProps} />)} 

                {(validations && walletPay) && <button type="submit" className="form__submit btn" >Pay & Save Gifting</button>}
            </div>
        </form>


        <form className='gifting--form-mobile' onSubmit={handleForm}>
            <div className='form--head'>
                <FaLongArrowAltLeft className='form--icon-mobile' onClick={handleHideForm} />
                <h4 className="form--heading">Upload Celebrant Details</h4>
            </div>

            <div className="form--main" style={{ overflowY: 'scroll' }}>
                {(formTab === 1) && (
                    <>
                        <div className='form--item form-image-card'>
                            {!imagePreview && <p className='image-text'>Event / Celebrant Image (Required for arts purchases only)</p>}
                            <input type='file' id='form-image-input' name='image' onChange={handleImageChange} accept="image/*" />
                            <label style={{ height: '24rem' }} htmlFor='form-image-input' className={`${imagePreview ? 'hoverable' : ''}`} id='form-image-label'>
                                <span>
                                    <MdOutlineAddAPhoto />
                                    <p>Add Celebrant Image</p>
                                </span>
                                {imagePreview && <img id='form-image' src={imagePreview} alt='Wishlist Preview' />}
                            </label>
                        </div>

                        <div className='form__item'>
                            <label htmlFor="" className="form__label">Event Name | Celebrant Fullname</label>
                            <input type="text" value={celebrant} placeholder='Event / Celebrant Name' className="form__input" onChange={(e) => setCelebrant(e.target.value)} />
                        </div>
                        <div className='form__item'>
                            <label htmlFor="" className="form__label">Contact Number</label>
                            <input type="number" value={contact} placeholder='080230267911' required className="form__input" onChange={(e) => setContact(e.target.value)} />
                        </div>

                        <div className='form__item'>
                            <label htmlFor="description" className="form__label">Description (for gifting)</label>
                            <textarea type="text" id='description' value={description} placeholder='Description for gifting' className="form__textarea" onChange={(e) => setDescription(e.target.value)}></textarea>
                        </div>
                    </>
                )}

                {(formTab === 2) && (
                    <>
                        <div className='form__item'>
                            <label htmlFor="" className="form__label">Address</label>
                            <textarea type="text" value={address} id='address' className="form__textarea" placeholder='Enter Celebrant Address' onChange={(e) => setAddress(e.target.value)}></textarea>
                        </div>
                        
                        <div className='form__item'>
                            <label htmlFor="country" className="form__label">Country</label>
                            <select type="text" id='country' value={country} className="form__select" onChange={(e) => setCountry(e.target.value)}>
                                <option value="Nigeria" selected>Nigeria</option>
                            </select>
                        </div>
                        <div className='form__item'>
                            <label htmlFor="state" className="form__label">State</label>
                            <select type="text" id="state" value={state} className="form__select" onChange={(e) => setState(e.target.value)}>
                                <option hidden selected="selected">- Select a State -</option>
                                <option value="Abuja">Abuja FCT</option>
                                <option value="Abia">Abia</option>
                                <option value="Adamawa">Adamawa</option>
                                <option value="Akwa-Ibom">Akwa Ibom</option>
                                <option value="Anambra">Anambra</option>
                                <option value="Bauchi">Bauchi</option>
                                <option value="Bayelsa">Bayelsa</option>
                                <option value="Benue">Benue</option>
                                <option value="Borno">Borno</option>
                                <option value="Cross-River">Cross River</option>
                                <option value="Delta">Delta</option>
                                <option value="Ebonyi">Ebonyi</option>
                                <option value="Edo">Edo</option>
                                <option value="Ekiti">Ekiti</option>
                                <option value="Enugu">Enugu</option>
                                <option value="Gombe">Gombe</option>
                                <option value="Imo">Imo</option>
                                <option value="Jigawa">Jigawa</option>
                                <option value="Kaduna">Kaduna</option>
                                <option value="Kano">Kano</option>
                                <option value="Katsina">Katsina</option>
                                <option value="Kebbi">Kebbi</option>
                                <option value="Kogi">Kogi</option>
                                <option value="Kwara">Kwara</option>
                                <option value="Lagos">Lagos</option>
                                <option value="Nassarawa">Nassarawa</option>
                                <option value="Niger">Niger</option>
                                <option value="Ogun">Ogun</option>
                                <option value="Ondo">Ondo</option>
                                <option value="Osun">Osun</option>
                                <option value="Oyo">Oyo</option>
                                <option value="Plateau">Plateau</option>
                                <option value="Rivers">Rivers</option>
                                <option value="Sokoto">Sokoto</option>
                                <option value="Taraba">Taraba</option>
                                <option value="Yobe">Yobe</option>
                                <option value="Zamfara">Zamfara</option>
                            </select>
                        </div>
                        {/* <div className='form__item'>
                            <label htmlFor="region" className="form__label">City / Region</label>
                            <select type="text" id='region' value={cityRegion} className="form__select" onChange={(e) => setCityRegion(e.target.value)}>
                                <option hidden selected="selected">- Select a Region -</option>
                            </select>
                        </div> */}
                        <div className='form__item form__item-date'>
                            <label htmlFor="date" className="form__label">Date of Delivery</label>
                            <span style={{ display: 'flex', alignItems: 'center' }}>
                                <input id='date' value={date} type="date" min={new Date().toISOString().split('T')[0]} className='form__date' onChange={(e) => setDate(e.target.value)} />
                                {/* <span class="validity"></span> */}
                            </span>
                        </div>

                        <div className="form__inline">
                            <div id='form--balance'>
                                <div className="form__item">
                                    <label htmlFor="checkbox-1" className="form__label">Pay With Wallet</label>
                                    <input type="checkbox" id='checkbox-1' className='form__check' checked={walletPay} onChange={(e) => { setWalletPay(e.target.checked); setCardPay(false); }} />
                                </div>
                                
                                <p style={{ display: 'flex', alignItems: 'center', fontSize: '1rem', gap: '.4rem' }}>
                                    {(walletPay && wallet) &&
                                        <>
                                            <span style={{ fontWeight: '600', color: '#777' }}>
                                                Balance:
                                            </span>
                                            <p>₦{numberConverter(wallet.walletBalance)}</p>
                                        </> 
                                    }
                                </p>
                            </div>
                            <div className='form__item'>
                                <label htmlFor="checkbox-2" className="form__label">Pay From Bank</label>
                                <input type="checkbox" id='checkbox-2' className='form__check' checked={cardPay} onChange={(e) => { setCardPay(e.target.checked); setWalletPay(false); }} />
                            </div>
                        </div>
                        

                        <div className="form__item" style={{ marginTop: '4rem' }}>
                            {!validations && <button type="submit" className="form__submit btn" disabled style={{ cursor: 'not-allowed', opacity:'0.5' }}>Pay & Save Gifting</button>}

                            {(validations && cardPay) && (<PaystackButton className="form__submit btn" {...componentProps} />)} 

                            {(validations && walletPay) && <button type="submit" className="form__submit btn" >Pay & Save Gifting</button>}
                        </div>
                    </>
                )}
            </div>

            <div className="form-pag--actions">
                {(formTab === 2) && (<span onClick={() => setFormTab(1)}><FaAngleLeft />Prev </span>)}
                {(formTab === 1) && (<span onClick={() => setFormTab(2)}><FaAngleRight /> Next</span>)}
            </div>
        </form>

        {createPortal(
            (isSuccess || isError || message) && (
                <Alert alertType={`${isSuccess ? "success" : isError ? "error" : ""}`}>
                    {isSuccess ? (
                        <AiFillCheckCircle className="alert--icon" />
                    ) : isError ? (
                        <AiFillExclamationCircle className="alert--icon" />
                    ) : (
                        ""
                    )}
                    <p>{message}</p>
                </Alert>
            ), document.body
        )}
        
    </>
  )
}

export default GiftingForm;
