import GiftBox from "../Assets/giftbox.jpg";
import giftaLogo from "../Assets/images/gifta-g-white-logo.png";
// import GiftaWhiteLogo from "../Assets/gifta-white-logo.png";
import { Link, useNavigate, useParams } from "react-router-dom";

import "./auth.css";
import { useState } from "react";
import Alert from "../Components/Alert";
import { AiFillCheckCircle, AiFillExclamationCircle } from "react-icons/ai";
import Spinner from "../Components/Spinner";
import OTPMODAL from "./OTPMODAL";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
// import { GoogleLogin } from 'react-google-login';
// import GoogleIcon from '../Assets/images/google-icon.png';
import EmailIcons from '../Assets/images/icons8-email-48.png';

import { GoogleLogin } from '@react-oauth/google';



function Signup() {
	const [isLoading, setIsLoading] = useState(false);
	const [signWithEmail, setSignWithEmail] = useState(false);
	const [fullName, setFullName] = useState('');
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	// const [checked, setChecked] = useState(false);
	const [passwordConfirm, setPasswordConfirm] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

	const [message, setMessage] = useState('');
	const [isError, setIsError] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	// const [showOtpModal, setShowOtpModal] = useState(function() {
	// 	const info = JSON.parse(localStorage.getItem('otpDetails'))
	// 	return info?.showOtpModal || false;
	// });
	
	
	const { inviteCode, verificationType } = useParams();
	const [showOtpModal, setShowOtpModal] = useState(verificationType === '_un' ? true : false);
	

	const navigate = useNavigate();
	

	function togglePasswordVisibility() {
		setShowPassword(!showPassword);
	};
	function togglePasswordConfirmVisibility() {
		setShowPasswordConfirm(!showPasswordConfirm);
	};


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


	const handleSignup = async (e) => {
		try {
			e.preventDefault();
			setIsLoading(true);
			handleReset();
			console.log(password, passwordConfirm)

			if (email === '' || password === '' || fullName === "" || username === ""  || passwordConfirm === "") {
				throw new Error('All fields are required!');
			}

			if(password !== passwordConfirm) throw new Error('Passwords are not the same!');
			if(password.length < 8 || passwordConfirm.length < 8) throw new Error('Passwords must not be less 8 characters');

			const res = await fetch(inviteCode ? `${import.meta.env.VITE_SERVER_URL}/users/signup/${inviteCode}` : `${import.meta.env.VITE_SERVER_URL}/users/signup`, {
				method: 'POST',
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ fullName, username, email, password, passwordConfirm }),
			});

			if (!res.ok) {
				throw new Error("Something went wrong!");
			}

			const data = await res.json();
			if(data.message === 'Email Already Exists and Unverified!' ) {
				localStorage.setItem('otpEmail', JSON.stringify(email));
				setTimeout(function() {
					navigate('/signup/_un');
				}, 1500);
			}
			if (data.status !== 'success') {
				throw new Error(data.message);
			}

			setIsSuccess(true);
			setMessage(data.message || 'Signup Successful. Verify OTP Code')
			setTimeout(() => {
				setIsSuccess(false);
				setMessage("");
				setShowOtpModal(true);
			}, 1500);
			localStorage.setItem('otpEmail', JSON.stringify(email));
		} catch (err) {
			handleError(err.message)
		} finally {
			setIsLoading(false)
		}
	};


	return (
		<>
			{isLoading && (
				<div className='gifting--loader'>
					<Spinner />
				</div>
			)}
			<div className="auth__container">
				<div className="auth__image--box">
					<span>
						<a className="auth__logo" href={`/`}>
							<img src={giftaLogo} alt="logo" />
						</a>

						<h2>Welcome back to Gifta</h2>
						<p>Where Every Moment Deserves the Perfect Gift!</p>
					</span>
				</div>

				<div className="auth--box signup--auth">
					<h2 className="auth--heading">Sign Up</h2>


					{/* <GoogleLogin
						clientId='409185840466-dk2cs4mdrl315i7s3am5pop520c3uuig.apps.googleusercontent.com'
						onSuccess={responseGoogle}
						onFailure={responseGoogle}
						cookiePolicy={"single_host_origin"}
						isSignedIn={true}
						render={(renderProps) => (
							<div className="google--login" onClick={renderProps.onClick}>
								<img src={GoogleIcon} style={{ cursor: 'pointer' }} />
								<p>Sign up with Google</p>
							</div>
						)}
					/> */}

					{/* <GoogleLogin
						onSuccess={credentialResponse => {
							console.log(credentialResponse);
						}}
						onError={() => {
							console.log('Login Failed');
						}}
					/>

					<div className="auth--diff">
						<span></span>
						<span>OR</span>
						<span></span>
					</div> */}

					<form onSubmit={handleSignup} className="auth--form">
						<div className="form--flex">
							<div className="form--item">
								<label htmlFor="FirstName" className="form--label">
									Fullname
								</label>

								<input
									type="text"
									id="fullName"
									name="first_name"
									className="form--input"
									value={fullName}
									placeholder="Enter Your Fullname"
									onChange={e => setFullName(e.target.value)}
								/>
							</div>

							<div className="form--item">
								<label htmlFor="username" className="form--label">
									Username
								</label>

								<input
									type="text"
									id="username"
									name="last_name"
									className="form--input"
									value={username}
									placeholder="Enter a Username"
									onChange={e => setUsername(e.target.value)}
								/>
							</div>
						</div>

						<div className="form--item">
							<label htmlFor="Email" className="form--label">
								Email
							</label>

							<input type="email" id="Email" placeholder="Enter Email Address" name="email" value={email} onChange={e => setEmail(e.target.value)} className="form--input" />
						</div>

						<div className="form--flex">
							<div className="form--item">
								<label htmlFor="Password" className="form--label">
									Password
								</label>

								<div className="form--input-box">
									<input
										// type="password"
										type={showPassword ? "text" : "password"}
										id="Password"
										name="password"
										className="form--input"
										value={password}
										placeholder="Enter a Password"
										onChange={e => setPassword(e.target.value)}
									/>
									{showPassword ? (
										<FaRegEye
											onClick={togglePasswordVisibility}
											className="password__icon"
										/>
										) : (
										<FaRegEyeSlash
											onClick={togglePasswordVisibility}
											className="password__icon"
										/>
									)}
								</div>

							</div>

							<div className="form--item">
								<label htmlFor="PasswordConfirmation" className="form--label">
									Password Confirmation
								</label>
										
								<div className="form--input-box">
									<input
										// type="password"
										type={showPasswordConfirm ? "text" : "password"}
										id="PasswordConfirmation"
										name="password_confirmation"
										className="form--input"
										value={passwordConfirm}
										placeholder="Enter a Password Confirmation"
										onChange={e => setPasswordConfirm(e.target.value)}
									/>
									{showPasswordConfirm ? (
										<FaRegEye
											onClick={togglePasswordConfirmVisibility}
											className="password__icon"
										/>
										) : (
											<FaRegEyeSlash
											onClick={togglePasswordConfirmVisibility}
											className="password__icon"
										/>
									)}
								</div>
							</div>
						</div>

						{/* <div className="form--check">
							<input
								type="checkbox"
								id="MarketingAccept"
								name="marketing_accept"
								className=""
								value={checked}
								onChange={e => setChecked(e.target.value)}
							/>

							<p htmlFor="MarketingAccept" className="form--content">
								I want to receive emails about events, product updates and company announcements.
							</p>
						</div> */}

						<div className="form--item">
							<span className="form--content">
								By creating an account, you agree to our{' '}
								<Link to={`/terms-of-use`} className="">
									terms and conditions
								</Link>
								{' '}and{' '}
								<Link to={`/privacy-policy`} className="">
									privacy policy
								</Link>
								.
							</span>
						</div>

						<div className="form--others">
							<button className="form--submit" type="submit" style={{ cursor: 'pointer' }}>
								Create an account
							</button>

							<p className="form--content" style={{ marginTop: '0' }}>
								Already have an account?{' '}
								<Link to={`/login`}>
									Log in
								</Link>
								.
							</p>
						</div>
					</form>

					{/* {!signWithEmail && (
						<div className="email--login" onClick={() => setSignWithEmail(!signWithEmail)}>
							<img src={EmailIcons} style={{ cursor: 'pointer' }} />
							<p>Sign up with Email</p>
						</div>
					)} */}

					
				</div>
			</div>

			{(showOtpModal) && (
				<OTPMODAL setShowOtpModal={setShowOtpModal} />
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
	);
}

export default Signup;
