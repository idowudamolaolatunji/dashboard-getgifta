import React, { useEffect, useRef, useState } from 'react';

import Header from './Components/Header';
import { calculatePercentage, dateConverter, expectedDateFormatter, numberConverter } from '../../utils/helper';
import fire from '../../utils/animation'
import paystackSvg from '../../Assets/svgs/paystack.svg';
import SkelentonOne from '../../Components/SkelentonOne';
import { useParams } from 'react-router-dom';
import { SlCalender } from 'react-icons/sl';
import { IoPricetagOutline } from 'react-icons/io5';
import ProgressBar from '../../Components/ProgressBar';
import { GiMoneyStack, GiReceiveMoney, GiTakeMyMoney } from 'react-icons/gi';
import { TbUsersGroup } from 'react-icons/tb'
import SkelentonCard from '../../Components/SkelentonCard';
import DashboardModal from '../../Components/Modal';
import CurrencyInput from 'react-currency-input-field';
import { useAuthContext } from '../../Auth/context/AuthContext';
import { PaystackButton } from 'react-paystack';
import Alert from '../../Components/Alert';
import { AiFillCheckCircle, AiFillExclamationCircle } from 'react-icons/ai';
// import Spinner from '../../Components/Spinner';
import Switch from "react-switch";
import { LiaUserSecretSolid } from "react-icons/lia";
import { FaRegMoneyBillAlt } from "react-icons/fa";


const customStyle = {
	minHeight: "auto",
	maxWidth: "45rem",
	width: "45rem",
};

const modalTexts = [
    "Fulfilling a wish isn't just about realizing a dream; it's about personal growth and the invaluable experiences gained along the way. 😊",
    "Every wish fulfilled is a journey embraced, full of lessons, challenges, and triumphant moments. 🌟",
    "In the pursuit of dreams, one discovers the strength within, turning wishes into inspiring chapters of personal evolution. 🚀",
    "Wishes materialize not just through actions but through the transformation and resilience found in the pursuit. 💪",
];


function SharedWishlist() {
    const { user, token } = useAuthContext();

    const [wishList, setWishList] = useState({});
    const [wishes, setWishes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingPay, setIsLoadingPay] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [index, setIndex] = useState(null);
    const [payerEmail, setPayerEmail] = useState('');
    const [payerName, setPayerName] = useState('')
    const [amount, setAmount] = useState('');

    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [randomText, setRandomText] = useState('');

    const [helpReset, setHelpReset] = useState(false);
    const [selectedWishId, setSelectedWishId] = useState(null);
    const [contributors, setContributors] = useState(0);
    const [checkAnonymous, setCheckAnonymous] = useState(false);

    const animatedBtnEl = useRef(null);

    const { shareableUrl } = useParams();

    function handlePay(index, id) {
        setShowModal(true)
        setIndex(index+1);
        handleRendomText()
        setSelectedWishId(id)
    }

    let charges;
    function calcTotalAmount(amount) {
        const calcChargesAmount = (3 / 100) * amount;
        if (calcChargesAmount > 3000) {
            charges = 3000;
        } else {
            charges = calcChargesAmount;
        }
        return amount + charges;
    }

    const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
    const amountInKobo = calcTotalAmount(Number(amount)) * 100;
    const componentProps = {
        email: payerEmail,
        amount: amountInKobo,
        publicKey,
        text: "Pay!",
        onSuccess: ({ reference }) => handlePayment(reference),
        onClose: () => handleFailure('Transaction Not Completed!'),
    };

    function handleRendomText() {
        const randomIndex = Math.floor(Math.random() * modalTexts.length);
        setRandomText(modalTexts[randomIndex]);
    };

    // HANDLE ON FETCH FAILURE
    function handleFailure(mess) {
        setIsError(true);
        setMessage(mess)
        setTimeout(() => {
            setIsError(false);
            setMessage('')
        }, 3000);
    }

    // HANDLE FETCH STATE RESET
    function handleReset() {
        setIsError(false);
        setMessage('')
        setIsSuccess(false);
        setHelpReset(false);
    }

    async function handlePayment(reference) {
        try {
            handleReset();
            setIsLoadingPay(true);
            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/wishlists/payment-verification/${reference}/${charges}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ wishListID: wishList._id, wishID: selectedWishId, userID: wishList?.user._id, payerEmail, anonymous: checkAnonymous, payerName }),
            });
            if (!res.ok) throw new Error('Something went wrong!');
            const data = await res.json();
            console.log(res, data)
            if(data.success === 'fail') {
                throw new Error(data?.message);
            }
            setIsSuccess(true);
            setMessage("Thank you for you payment!");
            setShowModal(false);
            setTimeout(() => {
                setHelpReset(true);
                setIsSuccess(false);
                setMessage("");
                setContributors(prevContributors => prevContributors += 1)
            }, 2000);
        } catch (err) {
            handleFailure(err.message)
        } finally {
            setIsLoadingPay(false);
        }
    }

    useEffect(function() {
        async function handleFetchList() {
            try {
                setIsLoadingPay(true);

                const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/wishlists/shared-wishlist/${shareableUrl}`, {
                    method: 'GET',
                    headers: {
                        "Content-Type" : "application/json"
                    },
                });
                if(!res.ok) throw new Error('Something went wrong!');
                const data = await res.json();
                if(data.status !== "success") throw new Error(data.message);
                setWishList(data.data.wishList);
                setContributors(data.data.wishList?.contributors || 0);
            } catch(err) {
                console.log(err);
            } finally {
                setIsLoadingPay(false)
            }
        }
        handleFetchList();
    }, [])


    useEffect(function() {
        async function handleFetchWishes() {
            try {
                const wishesRes = await fetch(`${import.meta.env.VITE_SERVER_URL}/wishlists/all-wishes/${wishList?._id}`, {
                    method: 'GET',
                    headers: {
                        "Content-Type" : "application/json"
                    },
                });
                if(!wishesRes.ok) throw new Error('Something went wrong!');
                const wishesData = await wishesRes.json();
                if(wishesData.status !== "success") throw new Error(wishesData.message);
    
                setWishes(wishesData.data.wishes);
            } catch(err) {
                console.log(err);
            } finally {
                setIsLoading(false)
            }
        }
        handleFetchWishes();
    }, [wishList, helpReset])


    useEffect(function() {
        if (isSuccess) {
            setTimeout(function() {
                fireAnimation();
            }, 3000);
        }
      }, [isSuccess]);


    const fireAnimation = () => {
        if (animatedBtnEl.current) {
            // fire({ target: {} });
            fire();
        } else {
          console.error('Btn not found!');
        }
    };


    useEffect(function() {
		document.title = 'Gifta | Meet a Wish | Every Moment Deserves the Perfect Gift!';

        window.scrollTo(0, 0);
	}, [])


  return (
    <>
        <Header />
        <section className='section section__shareable'>
            <div className="section__container">
                <div className="wishlish--share">
                    {/* {isLoadingPay && (
                        <div className='gifting--loader'>
                            <Spinner />
                        </div>
                    )} */}
                    {isLoading && (<SkelentonCard />)}
                    {(wishList && !isLoading) && (
                        <div className="share--top">
                            <img src={`${import.meta.env.VITE_SERVER_ASSET_URL}/others/${wishList.image}`} alt={wishList.image} />
                            <div className="top--details">
                                <p className="wishlist--title">{wishList.name}.</p>
                                <span className='top--info'>
                                    <span>Contributors <TbUsersGroup />: <p>{contributors}</p></span>
                                    <span>Wishes subtotal<GiMoneyStack />: <p>₦{numberConverter(wishes.reduce((acc, wish) => acc + wish.amount, 0))}</p></span>
                                    <span>Accoumulated <GiTakeMyMoney />: <p>₦{numberConverter(wishes.reduce((acc, wish) => acc + (wish?.amountPaid > wish?.amount ? wish.amount : wish.amountPaid), 0))}</p></span>
                                    {/* <span>Etras <GiReceiveMoney />: <p>₦{numberConverter(wishes.reduce((acc, wish) => acc + (wish?.amountPaid > wish?.amount ? wish.amountPaid - wish.amount : 0), 0))}</p></span> */}
                                </span>
                                {/* <span className="top--insight">
                                    <span>date</span>
                                </span> */}
                                <span className='top--progress'>
                                    <ProgressBar progress={`${calculatePercentage(wishes.reduce((acc, wish) => acc + wish.amount, 0), wishes.reduce((acc, wish) => acc + (wish?.amountPaid > wish?.amount ? wish.amount : wish.amountPaid), 0))}%`} />
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="share--bottom">
                        <p className="wish--title">{wishList?.user?.fullName || wishList?.user?.username}'s Wishes</p>
                        {isLoading && (<SkelentonOne />)}
                        <ul className='lists--figure'>
                            {(wishes && !isLoading) && wishes?.map(( wishItem, i ) => (
                                // <li className={`lists--item ${(calculatePercentage(wishItem.amount, wishItem.amountPaid) === 100) ? 'lists--completed' : ''}`} key={wishItem._id}>
                                <li className={`lists--item`} key={wishItem._id}>
                                    <span className='lists--item-top'>
                                        <span className='lists--content'>
                                            <p>{wishItem.wish}</p>
                                        </span>
                                        <div className='lists--actions'>
                                            <div className='lists--pay-btn' onClick={() => handlePay(i, wishItem._id)}><img height={'17rem'} src={paystackSvg} ref={animatedBtnEl} /><p>Pay</p></div>                                           
                                        </div>
                                    </span>
                                    <span className='lists--item-bottom'>
                                        <div className='lists--insight'>
                                            <span><IoPricetagOutline /><p>₦{numberConverter(wishItem.amount)}</p></span>
                                            <span><SlCalender /><p>{expectedDateFormatter(wishItem.deadLineDate)}</p></span>
                                        </div>
                                        <ProgressBar amountPaid={`₦${numberConverter(wishItem.amountPaid)}`} progress={`${calculatePercentage(wishItem.amount, wishItem.amountPaid)}%`} />
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>


        {showModal && (
            <DashboardModal setShowDashboardModal={setShowModal} customStyle={customStyle} title={
                <>
                    Make a wish come true ❤️
                    <picture style={{ transform: 'translateY(-.6rem)'}}>
                        <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/1f389/512.webp" type="image/webp" />
                        <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f389/512.gif" alt="🎉" width="32" height="32" />
                    </picture>
                </>
            }>
                <span className='modal--info'>{randomText}</span>
                <form className="pay--form" onSubmit={e => e.preventDefault()} style={{ marginTop: '.8rem' }}>
                
                    <div className="form--flex" style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <div className="form--item">
                            <label htmlFor="amount" className="form--label">Amount</label>
                            <CurrencyInput
                                className='form--input'
                                decimalsLimit={0}
                                prefix='₦ '
                                placeholder='Amount to pay'
                                defaultValue={amount}
                                value={amount}
                                onValueChange={(value, _) => setAmount(value)}
                                required
                            />
                        </div>

                        {/* <div className="form--item" style={{ flexDirection: 'row', alignItems: 'center' }}> */}
                        <div className="form--item">
                            <label htmlFor="switch--check" className="form--label"><LiaUserSecretSolid /> Anonymous</label>
                            <Switch
                                onChange={next => setCheckAnonymous(next)}
                                checked={checkAnonymous}
                                className="form--switch"
                                id='switch--check'
                                onColor="#bb0505"
                                handleDiameter={18}
                                height={25}
                            />
                        </div>                        
                    </div>

                    {!checkAnonymous && (
                        <div className="form--item">
                            <label htmlFor="name" className="form--label">Your Name</label>
                            <input className='form--input' id='name' value={payerName} onChange={e => setPayerName(e.target.value)} type='text' placeholder='Enter a display name' required={ checkAnonymous ? true : false } />
                        </div>
                    )}

                    <div className="form--item">
                        <label htmlFor="email" className="form--label">Your Email</label>
                        <input type="email" id='email' required placeholder='Email Address' name='email' value={payerEmail} onChange={e => setPayerEmail(e.target.value)} className="form--input" />
                    </div>

                    <div className="form--item">
                        {(payerEmail && amount) ? (
                            <PaystackButton type='submit' className="form--button" {...componentProps} />
                        ) : (
                            <button type='submit' className="form--button">Pay!</button>
                        )}
                    </div>
                </form>
            </DashboardModal>
        )}


        <Alert alertType={`${isSuccess ? "success" : isError ? "error" : ""}`}>
            {isSuccess ? (
                <AiFillCheckCircle className="alert--icon" />
            ) : isError && (
                <AiFillExclamationCircle className="alert--icon" />
            )}
            <p>{message}</p>
        </Alert>
    </>
  )
}

export default SharedWishlist
