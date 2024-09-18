import React, { useEffect, useState } from 'react'
import Header from './Components/Header'
import { useAuthContext } from '../../Auth/context/AuthContext';

import DataTable from 'react-data-table-component';
import { currencyConverter, dateConverter, getInitials, numberConverter } from '../../utils/helper';
import DashboardModal from '../../Components/Modal';
import CurrencyInput from 'react-currency-input-field';
import { PaystackButton } from 'react-paystack';
import Alert from '../../Components/Alert';
import { AiFillCheckCircle, AiFillExclamationCircle } from 'react-icons/ai';
import Spinner from '../../Components/Spinner';
import { Link, useNavigate } from 'react-router-dom';
import GiftLoader from '../../Assets/images/gifta-loader.gif';
import { FiMinus, FiPlus } from "react-icons/fi";

import CollapsibleDiv from 'react-collapsible';
import { MdArrowDropDown, MdKeyboardDoubleArrowRight, MdOutlineWorkspacePremium } from 'react-icons/md';
import { CiBank, CiCreditCard1 } from 'react-icons/ci';
import { RiAdminLine } from "react-icons/ri";
import { GiCrownCoin } from 'react-icons/gi';
import { GoInfo } from "react-icons/go";
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';


function Message({ type }) {
    return (<p className="no-pcontent-message">No {type} transactions</p>)
}

const customStyles = {
    rows: {
        style: {
            minHeight: '58px',
        },
    },
}

const customModalStyle = {
    minHeight: "auto",
    maxWidth: "45rem",
    width: "45rem",
};
const customWithdrawalModalStyle = {
    minHeight: "auto",
    maxWidth: "50rem",
    width: "50rem",
};


const columns = [
    {
        name: "Amount",
        selector: (row) => "₦ " + numberConverter(row.amount),
    },
    {
        name: "Transaction Status",
        selector: (row) => (
            <span className={`status status--${row.status === "pending" ? "pending" : "success"}`}>
                <p>{row.status}</p>
            </span>
        ),
    },
    {
        name: "Reference",
        selector: (row) => row.reference,
    },
    {
        name: "Date",
        selector: (row) => dateConverter(row.createdAt),
        sortable: true,
    },
];

function Wallet() {
    const { user, token } = useAuthContext();
    const [wallet, setWallet] = useState({});
    const [transactions, setTransactions] = useState([]);
    const [activeTab, setActiveTab] = useState('deposit');
    const [isLoading, setIsLoading] = useState(false);
    const [showDepositModal, setShowDepositModal] = useState(false);
    const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
    const [helpReset, setHelpReset] = useState(false);

    const [showPointsInfo, setShowPointsInfo] = useState(false);


    const [email, setEmail] = useState(user.email);
    const [amount, setAmount] = useState();
    const [withdrawalAmount, setWithdrawalAmount] = useState();
    const [password, setPassword] = useState('');
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const deposit = transactions.filter(transaction => transaction.purpose === 'deposit');
    const gifting = transactions.filter(transaction => transaction.purpose === 'gifting');
    const withdrawal = transactions.filter(transaction => transaction.purpose === 'withdrawal');
    const reminder = transactions.filter(transaction => transaction.purpose === 'reminder');
    const subscription = transactions.filter(transaction => transaction.purpose === 'subscription');
    const wishes = transactions.filter(transaction => transaction.purpose === 'wishes');
    const orders = transactions.filter(transaction => transaction.purpose === 'orders');
    const redeemed = transactions.filter(transaction => transaction.purpose === 'redeemed');

    const navigate = useNavigate();

    function toggleShowPassword() {
        setShowPassword(!showPassword);
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
        email,
        amount: amountInKobo,
        metadata: {
            name: user?.fullName,
        },
        publicKey,
        text: "Pay!",
        onSuccess: ({ reference }) => {
            handlePayment(reference);
            setShowDepositModal(false);
        },
        onClose: () => handleFailure('Transaction Not Completed!'),
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
            setMessage('')
        }, 3000);
    }

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };

    async function handlePayment(reference) {
        try {
            handleReset();
            setIsLoading(true);
            setHelpReset(false);
            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/transactions/payment-verification/${reference}/${charges}`, {
                method: 'POST',
                headers,
            });
            console.log(helpReset)
            if (!res.ok) throw new Error('Something went wrong!');
            const data = await res.json();
            console.log(res, data)
            if (data.success === 'fail') {
                throw new Error(data?.message);
            }
            setIsSuccess(true);
            setMessage("Deposit Successful!");
            setTimeout(() => {
                setIsSuccess(false);
                setMessage("");
                setHelpReset(true);
            }, 2000);
        } catch (err) {
            handleFailure(err.message)
        } finally {
            setIsLoading(false);
        }
    }

    async function handleWithdrawal(e) {
        try {
            if (!user?.bankName || !user?.holderName || !user?.acctNumber) {
                throw new Error('Input Bank details in Profile');
            }
            if (!withdrawalAmount || !password) throw new Error('Fill all fields!');
            if(password.length < 8) throw new Error('Password must not be less 8 characters');

            e.preventDefault();
            handleReset();
            setIsLoading(true);
            setHelpReset(false);

            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/transactions/withdrawal-request`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ amount: withdrawalAmount, password })
            });
            if (!res.ok) throw new Error('Something went wrong!');
            const data = await res.json();
            if (data.status !== "success") throw new Error(data.message);
            setIsSuccess(true);
            setMessage("Withdrawal Request Successful!");
            setTimeout(function () {
                setIsSuccess(false);
                setMessage("");
                setShowWithdrawalModal(false);
                setHelpReset(true);
            }, 2000);

        } catch (err) {
            handleFailure(err.message);
        } finally {
            setIsLoading(false)
        }
    }


    useEffect(function () {
        async function handleWalletTransaction() {
            try {
                setIsLoading(true);
                setShowDepositModal(false)
                const [walletRes, transactionsRes] = await Promise.all([
                    fetch(`${import.meta.env.VITE_SERVER_URL}/wallet/`, { headers }),
                    fetch(`${import.meta.env.VITE_SERVER_URL}/transactions/my-transactions`, { headers }),
                ]);

                if (!walletRes.ok || !transactionsRes.ok) {
                    throw new Error('Something went wrong!');
                }
                const walletData = await walletRes.json();
                const transactionData = await transactionsRes.json();
                if (walletData.status !== 'success' || transactionData.status !== 'success') {
                    throw new Error(walletData.message || transactionData.message)
                }
                setWallet(walletData.data.wallet);
                setTransactions(transactionData.data.myTransactions);
            } catch (err) {
                console.log(err.message);
            } finally {
                setIsLoading(false)
            }
        }
        handleWalletTransaction();
    }, [helpReset]);


    useEffect(function() {
		document.title = 'Gifta | My Wallet';

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
                <div className="section__container wallet--container">

                    <span onClick={() => navigate(-1)} className='wishlist--back-btn'>Back</span>


                    <div className="wallet--top">
                        <div className="wallet--user-info">
                            <span style={{ position: 'relative', overflow: 'hidden', borderRadius: '50%' }}>
                                {(user?.image !== "") ? (
                                    <img
                                        alt={user?.fullName + " 's image"}
                                        src={`${import.meta.env.VITE_SERVER_ASSET_URL}/users/${user?.image}`}
                                    />
                                ) : (
                                    <span className="user__img-initials">
                                        {getInitials(user?.fullName || user.username)}
                                    </span>
                                )}
                                {user?.isPremium && (
                                    <div className="premium--tag">
                                        <p style={{ display: 'flex', alignItems: 'center', gap: '.2rem' }}>Premium <MdOutlineWorkspacePremium style={{ fontSize: '1.6rem' }} /></p>
                                    </div>
                                )}
                            </span>


                            <div>
                                <p className="wallet--user-name">{user.fullName || user.username}</p>
                                <span className='wallet--user-balance'>
                                    <span>₦</span>
                                    <span>{numberConverter(wallet?.walletBalance || 0)}</span>
                                </span>

                                {(user?.role === 'vendor') && (
                                    <span className='wallet--user-pending-balance'>
                                        <span>Pending Balance: </span>
                                        <span>₦{numberConverter(wallet?.pendingWalletBalance || 0)}</span>
                                    </span>
                                )}

                                <span className='wallet--user-point'><GiCrownCoin style={{ color: '#bb0505', fontSize: '2rem' }} />{numberConverter(wallet?.pointBalance || 0)} G-points <GoInfo className='wallet--user-info-icon' onMouseOver={() => setShowPointsInfo(true)} onMouseLeave={() => setShowPointsInfo(false)} onClick={() => setShowPointsInfo(true)} style={ showPointsInfo ? { color: '#bb0505' } : {} } />
                                
                                    {showPointsInfo && (
                                        <div className="modal--info wallet--point-modal">Your Gifta point is valid and can be redeemed, This points cannot be withdrawn but can be used to purchase gifts.</div>
                                    )}
                                </span>

                                <span className='wallet--buttons'>
                                    <span className="wallet--button" onClick={() => setShowDepositModal(true)}>Fund Wallet <FiPlus className='wallet--icon' /></span>
                                    <span className="wallet--button" onClick={() => setShowWithdrawalModal(true)}>Withdraw <FiMinus className='wallet--icon' /></span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="wallet--bottom">
                        <span>
                            <div className="wallet--head-title">
                                <h3 className="wallet--heading">Transactions History</h3>
                                <select className="wallet--tabs-mobile" value={activeTab} onChange={(e) => { setActiveTab(e.target.value) }}>
                                    <option value="deposit">Deposit</option>
                                    {/* <option value="reminder">Reminder</option> */}
                                    <option value="giftings">Giftings</option>
                                    <option value="wishes">Wishes</option>
                                    <option value="withdrawal">Withdrawal</option>
                                    <option value="subscription">Subscription</option>
                                    <option value="orders">Orders</option>
                                    <option value="redeemed">Redeemed</option>
                                </select>
                            </div>


                            <div className="wallet--tabs">
                                <span className={`wallet--tab ${activeTab === "deposit" && "tab--active"}`} onClick={() => { setActiveTab("deposit") }}>Deposit</span>
                                {/* <span className={`wallet--tab ${activeTab === "reminder" && "tab--active"}`} onClick={() => { setActiveTab("reminder") }}>Reminder</span> */}
                                <span className={`wallet--tab ${activeTab === "giftings" && "tab--active"}`} onClick={() => { setActiveTab("giftings") }}>Giftings</span>
                                <span className={`wallet--tab ${activeTab === "wishes" && "tab--active"}`} onClick={() => { setActiveTab("wishes") }}>Wishes</span>
                                <span className={`wallet--tab ${activeTab === "withdrawal" && "tab--active"}`} onClick={() => { setActiveTab("withdrawal") }}>Withdrawal</span>
                                <span className={`wallet--tab ${activeTab === "subscription" && "tab--active"}`} onClick={() => { setActiveTab("subscription") }}>Subscription</span>
                                <span className={`wallet--tab ${activeTab === "orders" && "tab--active"}`} onClick={() => { setActiveTab("orders") }}>Orders</span>
                                <span className={`wallet--tab ${activeTab === "redeemed" && "tab--active"}`} onClick={() => { setActiveTab("redeemed") }}>Redeemed</span>
                            </div>
                        </span>


                        <DataTable
                            columns={columns}
                            data={activeTab === 'deposit' ? deposit : activeTab === 'withdrawal' ? withdrawal : activeTab === 'reminder' ? reminder : activeTab === 'giftings' ? gifting : activeTab === 'wishes' ? wishes : activeTab === 'subscription' ? subscription : activeTab === "orders" ? orders : activeTab === "redeemed" && redeemed}
                            pagination
                            noDataComponent={<Message type={activeTab} />}
                            customStyles={customStyles}
                            selectableRows
                        />
                    </div>
                </div>
            </section>


            {showDepositModal && (
                <DashboardModal setShowDashboardModal={setShowDepositModal} customStyle={customModalStyle} title={
                    <>
                        Make Deposit{' '}
                        <picture style={{ transform: 'translateY(-.6rem)' }}>
                            <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/1f389/512.webp" type="image/webp" />
                            <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f389/512.gif" alt="🎉" width="32" height="32" />
                        </picture>
                    </>
                }>
                    <span className='modal--info'> Ensure accuracy when funding your wallet to avoid transaction errors. Proceed with caution!</span>

                    <form className="pay--form" onSubmit={e => {
                        e.preventDefault();
                        if(amount < 1000) {
                            handleFailure('Minimum Deposits is ₦1,000')
                            return;
                        }
                    }} style={{ marginTop: '.8rem' }}>
                        <div className="form--item">
                            <label htmlFor="email" className="form--label">Email</label>
                            <input type="email" id='email' required placeholder='Email Address' name='email' value={email} onChange={e => setEmail(e.target.value)} className="form--input" />
                        </div>
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
                        <div className="form--item">
                            {(email && (amount && amount >= 1000)) ? (
                                <PaystackButton type='submit' className="form--button" {...componentProps} />
                            ) : (
                                <button type='submit' className="form--button">Pay!</button>
                            )}
                        </div>
                    </form>
                </DashboardModal>
            )}

            {(showWithdrawalModal) && (
                <DashboardModal setShowDashboardModal={setShowWithdrawalModal} customStyle={customWithdrawalModalStyle} title={
                    <>
                        Make a Withdrawal{' '}
                        <picture style={{ transform: 'translateY(-.6rem)' }}>
                            <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/1f911/512.webp" type="image/webp" />
                            <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f911/512.gif" alt="🤑" width="32" height="32" />
                        </picture>
                    </>
                }>
                    <span className='modal--info'>Withdrawals are final. Confirm your details and available balance before initiating. Proceed with caution.!</span>
                    <form className="pay--form" onSubmit={e => handleWithdrawal(e)}>
                        <div className="form--item">
                            <label className="form--label" htmlFor="amount">
                                Withdrawal Amount
                            </label>
                            <CurrencyInput
                                id="amount"
                                className="form--input"
                                placeholder="Enter Your Desired Amount"
                                defaultValue={withdrawalAmount}
                                value={withdrawalAmount}
                                decimalsLimit={2}
                                required
                                prefix="₦ "
                                onValueChange={(value, _) => setWithdrawalAmount(value)}
                            />
                        </div>

                        <CollapsibleDiv trigger={
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <p>Bank Information</p>
                                <MdArrowDropDown style={{ fontSize: '2.8rem' }} />
                            </div>
                        } className='form--collapsible'>
                            <div className='bank-info'>
                                <span>
                                    <p><CiBank /> Bank Name</p>
                                    <p style={!user?.bankName ? { color: "#bb0505" } : {}}>{user?.bankName || "Empty"}</p>
                                </span>
                                <span>
                                    <p><CiCreditCard1 /> Account Number</p>
                                    <p style={!user?.acctNumber ? { color: "#bb0505" } : {}}>{user?.acctNumber || "Empty"}</p>
                                </span>
                                <span>
                                    <p><RiAdminLine /> Account Holder's Name</p>
                                    <p style={!user?.holderName ? { color: "#bb0505" } : {}}>{user?.holderName || "Empty"}</p>
                                </span>
                            </div>

                            <Link to={'/settings'} className="form--item form--acct-btn">
                                <div>Goto Account <MdKeyboardDoubleArrowRight style={{ fontSize: '1.6rem' }} /></div>
                            </Link>
                        </CollapsibleDiv>


                        <div className="form--bank-info-d">
                            <div className='bank-info'>
                                <span>
                                    <p><CiBank /> Bank Name</p>
                                    <p style={!user?.bankName ? { color: "#bb0505" } : {}}>{user?.bankName || "Empty"}</p>
                                </span>
                                <span>
                                    <p><CiCreditCard1 /> Account Number</p>
                                    <p style={!user?.acctNumber ? { color: "#bb0505" } : {}}>{user?.acctNumber || "Empty"}</p>
                                </span>
                                <span>
                                    <p><RiAdminLine /> Account Holder's Name</p>
                                    <p style={!user?.holderName ? { color: "#bb0505" } : {}}>{user?.holderName || "Empty"}</p>
                                </span>
                            </div>

                            <Link style={{ marginLeft: 'auto' }} to={'/settings'} className="form--item form--acct-btn">
                                <div>Goto Account <MdKeyboardDoubleArrowRight style={{ fontSize: '1.6rem' }} /></div>
                            </Link>
                        </div>
                        <div className="form--item">
                            <label className="form--label" htmlFor="password">
                                Password Confirmation
                            </label>
                            <div className="form--input-box">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="form--input"
                                    id="password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                    required
                                    // placeholder="●●●●●●●●●"
                                    placeholder="••••••••••••"
                                />
                                {showPassword ? (
                                    <FaRegEye
                                        onClick={toggleShowPassword}
                                        className="password__icon"
                                    />
                                    ) : (
                                    <FaRegEyeSlash
                                        onClick={toggleShowPassword}
                                        className="password__icon"
                                    />
                                )}
                            </div>
                        </div>

                        <div className={`form--item ${(!user?.bankName || !user?.acctNumber || !user?.holderName) ? 'unclickable-form-item' : ''}`}>
                            <button type='submit' className="form--submit">Withdrawal Request</button>
                        </div>
                    </form>
                </DashboardModal>
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

export default Wallet
