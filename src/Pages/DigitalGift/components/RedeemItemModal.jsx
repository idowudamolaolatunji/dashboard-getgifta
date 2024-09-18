import React, { useEffect } from 'react'

import { capitalizeFirstLetter, dateConverter, numberConverter, numberConverterSticker } from '../../../utils/helper';
import { AiFillCheckCircle, AiFillExclamationCircle, AiOutlineClose } from 'react-icons/ai';
import { FaPlus, FaMinus } from "react-icons/fa6";
import { useState } from 'react';
import GiftLoader from '../../../Assets/images/gifta-loader.gif';
import { GoSearch } from "react-icons/go";


import { useAuthContext } from '../../../Auth/context/AuthContext';
import { createPortal } from 'react-dom';
import Alert from '../../../Components/Alert';
import SearchModal from './SearchModal';
import CurrencyInput from 'react-currency-input-field';


function Loading() {
    return <p style={{ fontSize: '1.2rem' }}>Loading...</p>
}

function RedeemItemModal({ item, handleCloseModal, category, setHelpReset }) {
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [message, setMessage] = useState('');

    const [isAtMax, setIsAtMax] = useState(false);
    const [maxQuantity, setMaxQuantity] = useState(null);
    const [quantity, setQuantity] = useState(1);

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

    useEffect(function() {
        setMaxQuantity(item?.balance)
    }, [item]);

    useEffect(function() {
        if(quantity === maxQuantity) {
            setIsAtMax(true)
        } else {
            setIsAtMax(false)
        }
    }, [quantity])

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


    async function handleRedeemStickers() {
        try {
            setIsLoading(true);
            handleReset();
            setHelpReset(false)

            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/digital-stickers/redeem-gifted-sticker/${item?._id}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ quantity, stickerType: item?.stickerType })
            });

            if(!res.ok) throw new Error('Something went wrong!');
            const data = res.json()
            if(data.status === "fail") throw new Error(data?.message);

            setIsSuccess(true);
            setMessage(data?.message || `Redeemed ${quantity} ${item?.stickerType} stickers successfully!`)
            setTimeout(function() {
                setHelpReset(true);
                handleCloseModal();
                setIsSuccess(false);
                setMessage('');
            }, 2000);
            
        } catch(err) {
            handleFailure(err.message);
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
                        <img src={`${import.meta.env.VITE_SERVER_ASSET_URL}/${category === 'stickers' ? `stickers/${item?.sticker?.image}` : `others/${item?.digitalGift?.image}`}`} alt={item?.name} className="item--img" />
                    </span>

                    <div className="product--info">
                        <h4 className="product--title">{category === 'stickers' ? capitalizeFirstLetter(item?.stickerType + ' sticker') : item?.digitalGift?.name}</h4>

                        {category === "stickers" && (
                            <>
                                <div className="item--info">
                                    <span style={isAtMax ? { color: 'red', transform: 'scale(1.05)', transition: 'all 0.35s'} : {}} className="expiry-date">Quantity Given:<span className='item--quantity'>x {item?.balance}</span></span>

                                    <span className="product--quantity">
                                        <button onClick={decQuantity}><FaMinus /></button>
                                        {/* <input type="text" value={quantity} onChange={(e) => handleInputQuality(e.target.value)} placeholder='1' /> */}

                                        <CurrencyInput value={quantity} onValueChange={(value, _) => handleInputQuality(value)} defaultValue={quantity} placeholder='1' />

                                        <button onClick={incQuantity}><FaPlus /></button>
                                    </span>
                                </div>

                                <div style={{ width: '100%', margin: '-.4rem 0 1.6rem', display: 'flex', alignItems: 'center', gap: '.6rem' }}>
                                    <span className='expiry-date'>Redeem amount:</span>
                                    <span className='product--price'>₦{numberConverterSticker(item?.sticker?.price * quantity)}</span>
                                </div>

                                <button className="item--btn" onClick={handleRedeemStickers}>Redeem</button>
                            </>
                        )}


                    </div>
                </div>
            </aside>

            {createPortal(
                (isError || isSuccess || message) && (
                    <Alert alertType={`${isSuccess ? "success" : isError ? "error" : ""}`}>
                        {isSuccess ? (
                            <AiFillCheckCircle className="alert--icon" />
                        ) : isError && (
                            <AiFillExclamationCircle className="alert--icon" />
                        )}
                        <p>{message}</p>
                    </Alert>
                ), document.body
            )}
        </>
    )
}

export default RedeemItemModal;