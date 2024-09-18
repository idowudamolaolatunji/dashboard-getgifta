import React, { useEffect, useState } from 'react'
import Header from './Components/Header';
import GiftLoader from '../../Assets/images/gifta-loader.gif';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../Auth/context/AuthContext';
import Alert from '../../Components/Alert';
import { AiFillCheckCircle, AiFillExclamationCircle } from 'react-icons/ai';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';

function VendorReg() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    
    const navigate = useNavigate();
    const { user, token, handleUser } = useAuthContext();

    function toggleShowPassword() {
        setShowPassword(!showPassword);
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


    async function handleBecomeaVendor(e) {
        try {
            e.preventDefault()
            setIsLoading(true);
            handleReset();

            if(password.length < 8) throw new Error('Password must not be less 8 characters');
            
            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/users/role/become-vendor`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ email, password }),
            });

            if(!res.ok) throw new Error('Something went wrong');
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
                navigate('/product-catalogue')
            }, 2000);

        } catch(err) {
            handleFailure(err.message)
        } finally {
            setIsLoading(false);
        }
    }


    useEffect(function() {
		document.title = 'Gifta | Become a Vendor';

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
            <section className="section account__section vendor--section">
                <div className="section__container">
                    <span onClick={() => navigate(-1)} className='wishlist--back-btn'>Back</span>
                    
                    <h3 className="settings--heading">Become a Vendor</h3>

                    <form className='vendor-reg__form' onSubmit={e => handleBecomeaVendor(e)}>
                        <div className="form--item">
                            <label htmlFor="email" className="form--label">Confirm Email</label>
                            <input type="email" id="email" required className="form--input" value={email} onChange={e => setEmail(e.target.value)} placeholder='Email address' />
                        </div>
                        <div className="form--item">
                            <label htmlFor="password" className="form--label">Confirm Password</label>
                            {/* <input type="password" id="password" required className="form--input" value={password} onChange={e => setPassword(e.target.value)} placeholder='●●●●●●●●●' /> */}
                            <div className="form--input-box">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="form--input"
                                    id="password"
                                    onChange={e => setPassword(e.target.value)}
                                    value={password}
                                    required
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
                        <div className="form--item">
                            <button type="submit" className="form--btn" style={{ width: '100%' }}>Submit Request</button>
                        </div>
                    </form>
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

export default VendorReg
