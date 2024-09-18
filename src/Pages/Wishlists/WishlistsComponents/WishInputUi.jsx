import React, { useEffect, useRef, useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


import { TbMoneybag } from 'react-icons/tb';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { formatDate } from '../../../utils/helper';
import { useAuthContext } from '../../../Auth/context/AuthContext';
import Alert from '../../../Components/Alert';
import GiftLoader from '../../../Assets/images/gifta-loader.gif';
import { AiFillCheckCircle, AiFillExclamationCircle } from 'react-icons/ai';

function WishInputUi({ wishListId, wishDetails, setShowModal, type, setHelpReset }) {
    const [wish, setWish] = useState(wishDetails ? wishDetails.wish : '');
    const [description, setDescription] = useState(wishDetails ? wishDetails.description : '');
    const [date, setDate] = useState(wishDetails ? formatDate(wishDetails.deadLineDate) : '')
    const [amount , setAmount] = useState(wishDetails ? wishDetails.amount : '');
    const [isError, setIsError] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [message, setMessage] = useState("");
    const [inValid, setInValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [focus, setFocus] = useState(null);

    const inputRef = useRef(null);

    const { user, token } = useAuthContext();
    const navigate = useNavigate();

    function handleCloseModal() {
        setShowModal(false);
    }

    function handleReset() {
		setIsError(false);
		setIsSuccess(false);
		setMessage("");
	}

	function handleError(mess) {
		setIsError(true);
		setMessage(mess);
		setTimeout(() => {
			setIsError(false);
			setMessage("");
		}, 3000);
	}

    async function handleWishInput(e) {
        e.preventDefault();
        let url, method;
        try {
            if (!wish || !description || !date || !amount) {
                setInValid(true);
                setTimeout(function() {
                    setInValid(false);
                }, 1500);
                throw new Error('All fields must be filled!');
            }
            setHelpReset(false)
            setIsLoading(true);
            handleReset();
            if(type === 'new') {
                method = 'POST';
                url = `${import.meta.env.VITE_SERVER_URL}/wishlists/create-wish/${wishListId}`;
            } else if(type === 'edit') {
                method = "PATCH";
                url = `${import.meta.env.VITE_SERVER_URL}/wishlists/update-wish/${wishListId}/${wishDetails._id}`;
            }

            const res = await fetch(`${url}`, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ wish, description, deadLineDate: date, amount: Number(amount) }),
            });

            console.log(res);
            if(!res.ok) throw new Error('Something went wrong!');

            const data = await res.json();
            if(data?.message === "You cannot perfom this task, Upgrade Account!") {
				setTimeout(() => {
					navigate('/plans');
				}, 1500);
				throw new Error(data.message);
			}
            if(data.status !== 'success') {
                throw new Error(data.message);
            }
            setMessage(data.message);
			setIsSuccess(true);
			setTimeout(() => {
                handleCloseModal();
				setIsSuccess(false);
				setMessage("");
                setHelpReset(true);
			}, 1500);
        } catch(err) {
            handleError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    function handleInputFocus() {
        setFocus(!focus)
    }
    
    useEffect(function() {
        if(focus) {
            inputRef.current.focus();
        }
    }, [focus])

  return (
    <>
        <div className='wish--overlay' onClick={handleCloseModal} />
        {isLoading && (
            <div className='gifting--loader'>
                <img src={GiftLoader} alt='loader' />
            </div>
        )}
        <form className={`wish--form wish--modal ${inValid ? 'form--focus' : ''}`} onSubmit={handleWishInput}>
            <input type="text" className='wish--input' placeholder='Write a wish here' value={wish} onChange={(e) => setWish(e.target.value)} />
            <textarea className='wish--textarea' placeholder='A bit of description..' value={description} onChange={(e) => setDescription(e.target.value)} />
            <div className="form--grid">
                <span>
                    <input type="date" className='wish--input input--date' placeholder='Deadline Date!' min={new Date().toISOString().split('T')[0]} value={date} onChange={(e) => setDate(e.target.value)}/>
                    {/* <DatePicker className='wish--input input--date' placeholderText='Deadline Date...' minDate={new Date()} selected={date} onChange={(date) => setDate(date)} /> */}
                    <span className='wish--input-flex'>
                        <CurrencyInput 
                            className='wish--input input--number'
                            decimalsLimit={0}
                            prefix='₦ '
                            placeholder='Wish Amount (₦)'
                            defaultValue={amount}
                            onValueChange={(value, _) => setAmount(value)}
                            ref={inputRef}
                        />
                        <TbMoneybag className='wish--input-icon' onClick={handleInputFocus} />
                    </span>
                </span>
                <span>
                    <button type="button" className='wish--button btn--cancel' onClick={handleCloseModal}>Cancel</button>
                    <button type="submit" className='wish--button btn--submit'>Submit</button>
                </span>
            </div>
        </form>

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

export default WishInputUi;
