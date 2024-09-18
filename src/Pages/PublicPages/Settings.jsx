import React, { useEffect, useState } from 'react'
import { useAuthContext } from '../../Auth/context/AuthContext';
import Header from './Components/Header'
import { useNavigate } from 'react-router-dom';
import GiftLoader from '../../Assets/images/gifta-loader.gif';
import Alert from '../../Components/Alert';
import { AiFillCheckCircle, AiFillExclamationCircle } from 'react-icons/ai';
import DeleteModalUi from '../Wishlists/WishlistsComponents/DeleteModalUi';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';

function Settings() {
    const { user, token, handleUser } = useAuthContext();

    const [bank, setBank] = useState(user?.bankName || '');
    const [holderName, setHolderName] = useState(user?.holderName || '');
    const [acctNumber, setAcctNumber] = useState(user?.acctNumber || null);
    const [isLoading, setIsLoading] = useState(false);

    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [passwordCurrent, setPasswordCurrent] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [passwordDel, setpasswordDel] = useState('');

    const [showCurrPassword, setShowCurrPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

    const navigate = useNavigate();


    function toggleShowCurrPassword () {
        setShowCurrPassword(!showCurrPassword)
    }
    function toggleShowNewPassword () {
        setShowNewPassword(!showNewPassword)
    }
    function toggleShowConfirmNewPassword() {
        setShowConfirmNewPassword(!showConfirmNewPassword)
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


    async function handleAccountDetailsUpdate(e) {
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
                body: JSON.stringify({ bankName: bank, acctNumber, holderName }),
            });
            if (!res.ok) throw new Error('Something went wrong!');
            const data = await res.json();
            if(data.status !== "success") {
                throw new Error(data.message);
            }
            setIsSuccess(true);
            setMessage('Bank Details Updated Successful!');
            setTimeout(function() {
                setIsSuccess(false);
                setMessage("");
                handleUser(data?.data?.user);
            }, 2000);

        } catch(err) {
            handleFailure(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    async function handlePasswordUpdate(e) {
        try {
            e.preventDefault();
            handleReset();
            setIsLoading(true)

            if(newPassword !== confirmNewPassword) {
                throw new Error('Passwords are not the same!');
            }
            if(passwordCurrent === newPassword) throw new Error('Current Password and New Password cannot be the same!')

            if(passwordCurrent.length < 8) throw new Error('Current Password must not be less 8 characters');
            if(newPassword.length < 8) throw new Error('New Password must not be less 8 characters');

            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/users/me/update-password`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ passwordCurrent, password: newPassword, passwordConfirm: confirmNewPassword }),
            });
            if (!res.ok) throw new Error('Something went wrong!');
            const data = await res.json();
            console.log(data, res)
            if(data.status !== "success") {
                throw new Error(data.message);
            }
            setIsSuccess(true);
            setMessage("Password Updated Successful!");
            setTimeout(function() {
                setPasswordCurrent('')
                setNewPassword('')
                setConfirmNewPassword('')
                setIsSuccess(false);
                setMessage("");
                handleUser(data?.data?.user);
            }, 2000);

        } catch(err) {
            handleFailure(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDeleteAccount() {
        try {
            handleReset();
            setIsLoading(true);

            if(passwordDel.length < 8) throw new Error('Password must not be less 8 characters');

            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/users/me/delete-account`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ password: passwordDel })
            });
            if (!res.ok) throw new Error('Something went wrong!');
            const data = await res.json();
            console.log(data, res)
            if(data.status !== "success") {
                throw new Error(data.message);
            }
            setIsSuccess(true);
            setMessage("Deleted Account Successfully!");
            setTimeout(function() {
                setIsSuccess(false);
                setMessage("");
                window.location.assign('/');
            }, 2000);

        } catch(err) {
            handleFailure(err.message);
        } finally {
            setIsLoading(false);
        }
    }


    useEffect(function() {
		document.title = 'Gifta | Settings';

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

            <section className='section setting__section'>
                <div className="section__container">
                    <span onClick={() => navigate(-1)} className='wishlist--back-btn'>Back</span>
                    <h3 className="settings--heading">Your Account Settings</h3>

                    <div className='setting--container'>
                        <form className="settings--form payment-form" onSubmit={e => handleAccountDetailsUpdate(e)}>
                            <h3 className="setting-form--heading">Add a payment account</h3>
                            <div className="form--item">
                                <label className="form--label" htmlFor="paymentBankName">
                                    Payment Bank Name
                                </label>
                                <select className="form--input" id="paymentBankName" value={bank} onChange={(e) => setBank(e.target.value)}>
                                    <option hidden selected > --Select a bank-- </option>
                                    <option value="Access Bank">Access Bank</option>
                                    <option value="Citi Bank">Citi Bank</option>
                                    <option value="Coronation Merchant Bank">Coronation Merchant Bank</option>
                                    <option value="EcoBank">EcoBank</option>
                                    <option value="Fidelity Bank">Fidelity Bank</option>
                                    <option value="First Bank of Nigeria">First Bank of Nigeria</option>
                                    <option value="First City Monument Bank (FCMB)">First City Monument Bank (FCMB)</option>
                                    <option value="FSDH Merchant Bank">FSDH Merchant Bank</option>
                                    <option value="Globus Bank">Globus Bank</option>
                                    <option value="Greenwich Merchant Bank">Greenwich Merchant Bank</option>
                                    <option value="Guarantee Trust Bank (GTB)">Guarantee Trust Bank (GTB)</option>
                                    <option value="Heritage Bank">Heritage Bank</option>
                                    <option value="Jaiz Bank">Jaiz Bank</option>
                                    <option value="Keystone Bank">Keystone Bank</option>
                                    <option value="Kuda MFB">Kuda MFB</option>
                                    <option value="Lotus Bank">Lotus Bank</option>
                                    <option value="Nova Merchant Bank">Nova Merchant Bank </option>
                                    <option value="Opay">OPAY</option>
                                    <option value="Polaris Bank">Polaris Bank</option>
                                    <option value="Providus Bank">Providus Bank</option>
                                    <option value="Rand Merchant Bank">Rand Merchant Bank </option>
                                    <option value="Stanbic IBTC Bank">Stanbic IBTC Bank</option>
                                    <option value="Standard Chartered Bank">Standard Chartered Bank</option>
                                    <option value="Sterling Bank">Sterling Bank </option>
                                    <option value="Suntrust Bank">Suntrust Bank </option>
                                    <option value="Taj Bank">Taj Bank</option>
                                    <option value="Titan Trust Bank">Titan Trust Bank</option>
                                    <option value="Union Bank Plc">Union Bank Plc</option>
                                    <option value="United Bank for Africa (UBA)">United Bank for Africa (UBA)</option>
                                    <option value="Unity Bank">Unity Bank</option>
                                    <option value="Wema Bank">Wema Bank</option>
                                    <option value="Zenith Bank">Zenith Bank</option>
                                </select>
                            </div>
                            <div className="form--item">
                                <label className="form--label" htmlFor="paymentAcctNum">
                                    Payment Account Number
                                </label>
                                <input
                                    className="form--input"
                                    id="paymentAcctNum"
                                    type="number"
                                    required="required"
                                    placeholder="Bank Number"
                                    minLength={10}
                                    maxLength={10}
                                    value={acctNumber}
                                    onChange={e => setAcctNumber(e.target.value)}
                                />
                            </div>
                            <div className="form--item">
                                <label className="form--label" htmlFor="holdersName">
                                    Holder's Name
                                </label>
                                <input
                                    className="form--input"
                                    id="holdersName"
                                    type="text"
                                    name="holdersName"
                                    placeholder="Name As On Bank Document"
                                    required="required"
                                    value={holderName}
                                    onChange={e => setHolderName(e.target.value)}
                                />
                            </div>
                            <div className="form--item right">
                                <button type='submit' className="btn form-btn">Add payment account</button>
                            </div>
                        </form>


                        <form className="settings--form password-form" onSubmit={e => handlePasswordUpdate(e)}>
                            <h3 className="setting-form--heading">Update Account Password</h3>
                            <div className="form--item">
                                <label className="form--label" htmlFor="password-current">
                                    Current Password
                                </label>
                                <div className="form--input-box">
                                    <input
                                        className="form--input"
                                        id="password-current"
                                        name="password-current"
                                        type={showCurrPassword ? "text" : "password"}
                                        placeholder="••••••••••••"
                                        required="required"
                                        value={passwordCurrent}
                                        onChange={e => setPasswordCurrent(e.target.value)}
                                    />
                                    {showCurrPassword ? (
                                        <FaRegEye
                                            onClick={toggleShowCurrPassword}
                                            className="password__icon"
                                        />
                                        ) : (
                                        <FaRegEyeSlash
                                            onClick={toggleShowCurrPassword}
                                            className="password__icon"
                                        />
                                    )}
							    </div>
                            </div>
                            <div className="form--item">
                                <label className="form--label" htmlFor="password">
                                    New Password
                                </label>

                                <div className="form--input-box">
                                    <input
                                        className="form--input"
                                        id="password"
                                        name="password"
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder="••••••••••••"
                                        required="required"
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                    />
                                    {showNewPassword ? (
                                        <FaRegEye
                                            onClick={toggleShowNewPassword}
                                            className="password__icon"
                                        />
                                        ) : (
                                        <FaRegEyeSlash
                                            onClick={toggleShowNewPassword}
                                            className="password__icon"
                                        />
                                    )}
							    </div>
                            </div>
                            <div className="form--item">
                                <label className="form--label" htmlFor="password-confirm">
                                    Confirm New Password
                                </label>
                                <div className="form--input-box">
                                    <input
                                        className="form--input"
                                        id="password-confirm"
                                        name="password-confirm"
                                        type={showConfirmNewPassword ? "text" : "password"}
                                        placeholder="••••••••••••"
                                        required="required"
                                        // minLength={8}
                                        value={confirmNewPassword}
                                        onChange={e => setConfirmNewPassword(e.target.value)}
                                    />

                                    {showConfirmNewPassword ? (
                                        <FaRegEye
                                            onClick={toggleShowConfirmNewPassword}
                                            className="password__icon"
                                        />
                                        ) : (
                                        <FaRegEyeSlash
                                            onClick={toggleShowConfirmNewPassword}
                                            className="password__icon"
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="form--item right">
                                <button type='submit' className="btn form-btn">Save password</button>
                            </div>
                        </form>


                        <div className="settings--form delete-form">
                            <h4 className='setting-form--heading' style={{ marginBottom: '1rem' }}>Delete My Account </h4>
                            <span className='modal--info'>
                                Every info about this account, transactions, affiliate links, sold product
                                histories, personal details and other sensitive informations would be removed as
                                you click <strong>Delete My Account!</strong>
                            </span>
                            <div className="form--item">
                                <button className="btn delete-account" onClick={() => setShowDeleteModal(true)}>Delete My Account</button>
                                {/* onClick={handleDeleteAccount} */}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {showDeleteModal && (
                <DeleteModalUi title={'Delete Your Gifta Account'} setShowDeleteModal={setShowDeleteModal}>
                    <span className='modal--info'>Note that everything relating to this Your Account would also be deleted including transactions.</span>
                    <div className='delete--content'>
                        <div className="form--item">
                            <label htmlFor="password" className="form--label">Confirm Password</label>
                            <input
                                type="password" id="password"
                                className="form--input"
                                placeholder="••••••••••••"
                                required="required"
                                minLength={8}
                                value={passwordDel}
                                onChange={e => setpasswordDel(e.target.value)} 
                            />
                        </div>
                        <div className="modal--actions">
                            <span className='delete--cancel' onClick={() => setShowDeleteModal(false)}>Cancel</span>
                            <span className='delete--submit' onClick={handleDeleteAccount}>Delete</span>
                        </div>
                    </div>
                </DeleteModalUi>
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

export default Settings
