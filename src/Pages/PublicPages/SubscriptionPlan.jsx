import React, { useEffect, useState } from 'react'
import Header from './Components/Header'
import { useNavigate } from 'react-router-dom';
import { BsCheck } from 'react-icons/bs';

import GiftLoader from '../../Assets/images/gifta-loader.gif';

import Modal from '../../Components/Modal';
import { PiWallet } from 'react-icons/pi';
import { ImCreditCard  } from 'react-icons/im';

import { PaystackButton } from 'react-paystack';
import { useAuthContext } from '../../Auth/context/AuthContext';
import Alert from '../../Components/Alert';
import { AiFillCheckCircle, AiFillExclamationCircle } from 'react-icons/ai';


const customStyle = {
    minHeight: "auto",
    maxWidth: "40rem",
    width: "40rem",
};

function SubscriptionPlan() {
    const [checkedMonthly, setCheckedMonthly] = useState(false);
    const [checkedYearly, setCheckedYearly] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [plan, setPlan] = useState()

    const navigate = useNavigate();
    const { user, token, handleUser } = useAuthContext();


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

    function handleChecked(subPlan) {
        if ( subPlan === 'semi-annual' && !user?.isPremium ) {
            setCheckedMonthly(!checkedMonthly);
            setCheckedYearly(false);
            setPlan(subPlan)
        } else if ( subPlan === 'annual' && !user?.isPremium ) {
            setCheckedYearly(!checkedYearly);
            setCheckedMonthly(false);
            setPlan(subPlan)
        }

        setTimeout(() => {
            if(!user?.isPremium) {
                setShowModal(true);
            }
        }, 1000);
    }

    useEffect(function() {
        if(!showModal) {
            setCheckedMonthly(false);
            setCheckedYearly(false);
        }
    }, [showModal])

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
    const amountInKobo = calcTotalAmount(Number(checkedMonthly ? 15000 : 50000)) * 100;
    const componentProps = {
        email: user?.email,
        amount: amountInKobo,
        metadata: {
            name: user?.fullName,
        },
        publicKey,
        text: 
            <>
                <ImCreditCard style={{ color: 'bb0505', fontSize: '2rem' }} /> Pay from Bank
            </>
        ,
        onSuccess: ({ reference }) => {
            handleSubscriptionPay(reference);
            setShowModal(false);
        },
        onClose: () => handleFailure('Transaction Not Completed!'),
    };

    async function handleSubscriptionPay(reference) {
        try {
            handleReset();
            setIsLoading(true);

            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/subscriptions/subscribe-from-card/${reference}/${charges}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ plan })
            });

            if(!res.ok) throw new Error('Something went wrong!');
            const data = await res.json();
            console.log(res, data);
            if(data?.status !== 'success') {
                throw new Error(data?.message)
            }

            setIsSuccess(true);
            setMessage(data.message);
            setTimeout(function() {
                setIsSuccess(false);
                setMessage("");
                handleUser(data?.data.user);
            }, 2000);

        } catch(err) {
            handleFailure(err.message)
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSubscriptionWallet() {
        try {
            setIsLoading(true);
            handleReset();

            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/subscriptions/subscribe-from-wallet`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ plan, amount: checkedMonthly ? 15000 : 50000 }),
            });

            if(!res.ok) throw new Error('Something went wrong!');
            const data = await res.json();
            // if(data.message === 'Insufficient wallet balance') {
            //     navigate('/wallet')
            //     throw new Error('Insufficient wallet balance');
            // }
            console.log(res, data);
             if(data?.status !== 'success') {
                throw new Error(data?.message)
            }

            setIsSuccess(true);
            setMessage(data.message);
            setTimeout(function() {
                setIsSuccess(false);
                setMessage("");
                handleUser(data?.data.user);
                setShowModal(false);
            }, 2000);

        } catch (err) {
            handleFailure(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(function() {
		document.title = 'Gifta | Subscription Plans';

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
            <section className='section wallet__section'>
                <div className="section__container">
                    <span onClick={() => navigate(-1)} className='wishlist--back-btn'>Back</span>

                    <div className="terms--container">
                        <h3 className="terms--heading">Plans.</h3>
                        <span className='modal--info'>Note that for everything successfully purchased products we own 5% and you own 95% of the profit</span>

                        <div className={`plans--box ${user?.isPremium ? 'user--premium' : ''}`}>
                            <figure className={`plan-figure ${user?.premiumDuration === 'half' ? 'user--premium-dur' : ''}`} onClick={() => handleChecked('semi-annual')}>
                                <p className="plans--title">Semi-annual</p>
                                <span className={`plans--check ${checkedMonthly ? 'checked' : ''}`}>{checkedMonthly && <BsCheck className='check--icon' />}</span>
                                <ul className="plans--infos">
                                    <li>Increased Profit Margins</li>
                                    <li>Competitive Advantage</li>
                                    <li>Lower prices can facilitate</li>
                                    <li>Proper pricing strategies</li>
                                    <li>Dynamic pricing models</li>
                                </ul>
                                <span className='plans--pricing'>
                                    <span className='plans--number'>₦12,000</span>
                                    <span>/ 6 months</span>
                                </span>
                            </figure>
                            {console.log(user?.premiumDuration)}
                            <figure className={`plan-figure ${user?.premiumDuration === 'full' ? 'user--premium-dur' : ''}`} onClick={() => handleChecked('annual')}>
                                <p className="plans--title">Annual</p>
                                <span className={`plans--check ${checkedYearly ? 'checked' : ''}`}>{checkedYearly && <BsCheck className='check--icon' />}</span>
                                <ul className="plans--infos">
                                    <li>Increased Profit Margins</li>
                                    <li>Competitive Advantage</li>
                                    <li>Lower prices can facilitate</li>
                                    <li>Proper pricing strategies</li>
                                    <li>Dynamic pricing models</li>
                                </ul>
                                <span className='plans--pricing'>
                                    <span className='plans--number'>₦50,000</span>
                                    <span>/ 1 year</span>
                                </span>
                            </figure>
                        </div>
                    </div>
                </div>
            </section>


            {showModal && (
                <Modal customStyle={customStyle} setShowDashboardModal={setShowModal} title={'Choose a Payment Option!'}>
                    <span className='modal--info'>Subscription plan for {checkedYearly ? 'a Year' : 'Six-months'}. Note the subtotal for this plan {checkedMonthly ? '₦1,200' : '₦50,000'}. Proceed with caution!</span>

                    <div className="payment--option">
                        <span className='payment--action payment--wallet' onClick={handleSubscriptionWallet}><PiWallet style={{ color: 'bb0505', fontSize: '2rem' }} /> Pay from Wallet</span>
                        <span className='payment--or'><p/>Or<p/></span>
                        <PaystackButton type='submit' className="payment--action payment--card" {...componentProps} />
                    </div>
                </Modal>
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
    )
}

export default SubscriptionPlan
