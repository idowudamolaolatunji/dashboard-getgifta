import React, { useEffect, useState } from 'react';
import OTPInput from 'react-otp-input';
import Spinner from '../Components/Spinner';
import Alert from '../Components/Alert';
import { AiFillCheckCircle, AiFillExclamationCircle } from 'react-icons/ai';
import { useNavigate, useParams } from 'react-router-dom';

const customStyle = {
    minHeight: "auto",
    maxWidth: "32rem",
    width: "32rem",
};

const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem'
}

const inputStyle = {
    width: '5.2rem',
    height: '5.2rem',
    fontSize: '2rem',
    border: '1.6px solid #ccc',
    borderRadius: '.4rem',
    color: '#444',
}

function OTPMODAL({ setShowOtpModal }) {
    const [otp, setOtp] = useState(null);
    const [countdownOver, setCountdownOver] = useState(false);
    const [currentSecond, setCurrentSecond] = useState(180);
    const [showOtp, setShowOtp] = useState(true)
    const [showReset, setShowReset] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState('');
	const [isError, setIsError] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

    // const info = JSON.parse(localStorage.getItem('otpDetails'))
    // const email = info?.email;
    const email = JSON.parse(localStorage.getItem('otpEmail'));

    const { verificationType } = useParams();
    const navigate = useNavigate();


    function handleShowOtp() {
        setShowReset(false);
        setShowOtp(true);
    }
    function handleShowReset() {
        setShowOtp(false);
        setShowReset(true);
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
		}, 2500);
	}

    useEffect(() => {
        let intervalId;
        function startCountdown(setCountdownOver) {
            let seconds = 180;

            intervalId = setInterval(() => {
                if (seconds < 1) {
                    clearInterval(intervalId);
                    setCountdownOver(true);
                    setCurrentSecond(0);
                } else {
                    if (seconds > 0) {
                        setCountdownOver(false);
                        setCurrentSecond(seconds);
                        seconds -= 1;
                    }
                }
            }, 1000);
        }

        startCountdown(setCountdownOver);

        return () => clearInterval(intervalId)
    }, []);

    useEffect(function() {
        if(verificationType === '_un') {
            handleShowReset();
        }
    }, [])


    async function handleFetchResetOtp() {
        try {
            handleReset();
            setIsLoading(true)
            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/users/request-otp`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email }),
            });
            // if (!res.ok) throw new Error('Something went wrong!');
            const data = await res.json();
            if(data.message === 'OTP not yet expired') {
                handleShowOtp();
                throw new Error(data.message);
            }
            if(data.status !== 'success') {
                throw new Error(data.message);
            }
            setIsSuccess(true);
			setMessage(data.message)
            setTimeout(() => {
                handleShowOtp();
                setIsSuccess(false);
                setMessage('')
            }, 2000);
        } catch (err) {
            handleError(err.message);
        } finally {
            setIsLoading(false)
        }
    }

    async function handleFetchSubmitOtp() {
        try {
            handleReset();
            setIsLoading(true);
            if(!otp) throw new Error('OTP field required!');

            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/users/verify-otp`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, otp: Number(otp) }),
            });
            // if (!res.ok) throw new Error('Something went wrong!');
            const data = await res.json();
            console.log(res, data)
            if(data.status !== 'success') {
                throw new Error(data.message);
            }
            setIsSuccess(true);
			setMessage(data.message || "OTP Verification Successful!")
			setTimeout(() => {
				setIsSuccess(false);
				setMessage("");
                setShowOtpModal(false);
                navigate('/login');
                localStorage.setItem('otpEmail', JSON.stringify(''));
			}, 1500);
        } catch (err) {
            handleError(err.message);
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(function() {
        // handleFetchResetOtp();
    }, []);

    function handleCloseOpt() {
        if(verificationType === '_un') {
            setShowOtpModal();
            navigate('/signup');
        } else {
            return;
        }
    }


    return (
        <>
            {isLoading && (
                <div className='gifting--loader'>
                    <Spinner />
                </div>
            )}
            <div className="overlay" onClick={handleCloseOpt} />
            <div className="modal" style={customStyle}>
                {showOtp && (
                    <>
                        <p className="modal--heading" style={{ marginBottom: '3.2rem' }}>Verify OTP!</p>
                        <OTPInput
                            value={otp}
                            onChange={setOtp}
                            numInputs={4}
                            inputStyle={inputStyle}
                            containerStyle={containerStyle}
                            renderInput={(props) => <input {...props} />}
                        />
                        <div className="reminder--actions" style={{ marginTop: '2.4rem', justifyContent: 'space-between' }}>
                            <span onClick={countdownOver ? handleShowReset : ''} className='otp--btn' style={countdownOver ? { fontWeight: '500', cursor: 'pointer', color: "#bb0505" } : {}}>Request new OTP {currentSecond === 0 ? '' : 'in'} <p style={{ fontWeight: '600', color: "#bb0505" }}>{currentSecond === 0 ? 'now' : `(${currentSecond}s)`}</p></span>
                            <button type='submit' className='set--btn' onClick={handleFetchSubmitOtp}>Submit</button>
                        </div>
                    </>
                )}
                {(showReset) && (
                    <>
                        <p className="modal--heading" style={{ marginBottom: '3.2rem' }}>Reset OTP!</p>
                        <div className="form--item">
                            <label htmlFor="" className="form--label">Email Address</label>
                            <input type="email" className="form--input" readOnly value={email} />
                        </div>
                        <div className="reminder--actions" style={{ marginTop: '1.8rem' }}>
                            <button type='submit' className='set--btn' onClick={handleFetchResetOtp}>Send Otp</button>
                        </div>
                    </>
                )}
            </div>

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
        </>
    )
}

export default OTPMODAL;
