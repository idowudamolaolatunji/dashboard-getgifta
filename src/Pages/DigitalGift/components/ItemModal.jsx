import React, { useEffect } from 'react'

import { capitalizeFirstLetter, dateConverter, numberConverter } from '../../../utils/helper';
import { AiFillCheckCircle, AiFillExclamationCircle, AiOutlineClose } from 'react-icons/ai';
import { FaPlus, FaMinus } from "react-icons/fa6";
import { useState } from 'react';
import GiftLoader from '../../../Assets/images/gifta-loader.gif';


import giftaLogo from "../../../Assets/gifta-logo.png";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../Auth/context/AuthContext';
import { createPortal } from 'react-dom';
import Alert from '../../../Components/Alert';
import CurrencyInput from 'react-currency-input-field';


function ItemModal({ item, handleCloseModal, category }) {
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [message, setMessage] = useState('');

    const [isAtMax, setIsAtMax] = useState(false);

    const [maxQuantity, setMaxQuantity] = useState(100000);
    const [quantity, setQuantity] = useState(1);
    const amount = Number(quantity * item?.price);
    const timeout = 3000;

    const { token } = useAuthContext()

    function incQuantity() {
        if (quantity < maxQuantity) {
            setQuantity(prev => prev + 1);
        }   
    }
    function decQuantity() {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    }
    function handleInputQuality(value) {
        const numValue = Number(value)
        if(!value || numValue > maxQuantity) return;
        setQuantity(numValue)
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
        }, timeout);
    }

    useEffect(function() {
        if(category !== "stickers") {
            setMaxQuantity(item?.quantity)
        }
    }, [category])
    useEffect(function() {
        if(quantity === maxQuantity) {
            setIsAtMax(true)
        } else {
            setIsAtMax(false)
        }
    }, [quantity])

    async function handlePurchaseDigitalGift(type) {
        const baseUrl = import.meta.env.VITE_SERVER_URL
        let url, body;
        if(type === 'stickers') {
            url = `${baseUrl}/digital-stickers/purchase-sticker`;
            body = { stickerType: item?.type, quantity }
        }else {
            url = `${baseUrl}/digital-giftings/purchase-digital-gift/${item?._id}`;
            body = { quantity }
        }
        try {
            setIsLoading(true);
            handleReset();

            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            if(!res.ok) throw new Error('Something went wrong');
            const data = await res.json();
            if(data.status !== 'success') throw new Error(data.message);

            setIsSuccess(true);
            setMessage(data.message)
            setTimeout(function() {
                setIsSuccess(false);
                setMessage();
                handleCloseModal();
            }, 2000);

        } catch(err) {
            handleFailure(err.message)
        } finally {
            setIsLoading(false);
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

            <div className="product__modal--overlay" onClick={handleCloseModal} />
            <aside className={`item__modal ${category === 'stickers' ? 'item--sticker-modal' : ''}`} key={item._id}>

                <div className="item--container">
                    <span className='item--image-box'>
                        <img src={`${import.meta.env.VITE_SERVER_ASSET_URL}/${category === 'stickers' ? 'stickers' : 'others'}/${item?.image}`} alt={item?.name} className="item--img" />
                    </span>

                    <div className="product--info">
                        <h4 className="product--title">{category === 'stickers' ? capitalizeFirstLetter(item?.type + ' sticker') : item?.name}</h4>

                        {category !== "stickers" && (
                            <div className="product--vendor item--vendor">
                                <div className="vendor--main">
                                    <img className='' src={`${import.meta.env.VITE_SERVER_ASSET_URL}/users/${item?.vendor?.image}`} alt={item?.vendor?.fullName} />
                                    <div>
                                        <p className='product-item-username'>{item?.vendor?.fullName}</p>
                                        <p className='product-vendor--email'>{item?.vendor?.email}</p>
                                    </div>
                                </div>

                                <span className='expiry-date'>Expires Date:<p>{new Date(item?.expiryDate).toLocaleString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}</p></span>
                                <span style={isAtMax ? { color: 'red', transform: 'scale(1.05)', transition: 'all 0.35s'} : {}} className='expiry-date'>Avail Quantity:<p>{item?.quantity}</p></span>
                            </div>
                        )}

                        <span className="product--actions">
                            <span className="product--total">
                                <span className="product--price">
                                    <span>Price:</span>
                                    <p>₦{numberConverter(amount)}</p>
                                </span>

                                <span className="product--quantity">
                                    <span onClick={decQuantity}><FaMinus /></span>
                                    {/* <p>{quantity}</p> */}
                                    {/* <input type="text" value={quantity} onChange={(e) => handleInputQuality(e.target.value)} placeholder='1' /> */}

                                    <CurrencyInput value={quantity} onValueChange={(value, _) => handleInputQuality(value)} defaultValue={quantity} placeholder='1' />

                                    <span onClick={incQuantity}><FaPlus /></span>
                                </span>
                            </span>

                            <button className="product--btn" onClick={() => handlePurchaseDigitalGift(category)}>Purchase</button>
                        </span>
                    </div>
                </div>
            </aside>

            {
            createPortal(
                (message) && (
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

export default ItemModal;
