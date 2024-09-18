import { useState, useEffect } from "react";
import giftbox from "../Assets/giftbox.jpg";
import giftaLogo from "../Assets/images/gifta-g-white-logo.png";
import giftaWhiteLogo from "../Assets/gifta-white-logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "./context/AuthContext";
import Alert from "../Components/Alert";
import Spinner from "../Components/Spinner";
import { AiFillCheckCircle, AiFillExclamationCircle } from "react-icons/ai";

import './auth.css';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import GiftLoader from '../Assets/images/gifta-loader.gif';
// import GoogleLogin from "react-google-login";
// import { GoogleLogin } from 'react-google-login';
// import GoogleIcon from '../Assets/images/google-icon.png';

import { GoogleLogin } from '@react-oauth/google';






function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [message, setMessage] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const navigate = useNavigate();
	const { user, handleChange } = useAuthContext();

	const responseGoogle = (response) => {
		console.log(response);
	} 

	function togglePasswordVisibility() {
		setShowPassword(!showPassword);
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


	async function handleLoginUser(e) {
		try {
			setIsLoading(true);
			e.preventDefault();
			handleReset();

			if (user === '' || password === '') throw new Error("Fields Empty");

			if(password.length < 8) throw new Error('Password must not be less 8 characters');

			const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/users/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});

			if (!res.ok) {
				throw new Error("Something went wrong!");
			}

			const data = await res.json();
			if(data.message === 'Not Verified!' ) {
				localStorage.setItem('otpEmail', JSON.stringify(email));
				setTimeout(function(){
					navigate('/signup/_un');
				}, 2000);
			}
			if (data.status !== "success") {
				throw new Error(data.message);
			}
			

			setMessage(data.message || "User Login Successful!");
			setIsSuccess(true);
			setTimeout(() => {
				setIsError(false);
				setMessage("");
				handleChange(data.data.user, data.token);
			}, 1000);
		} catch (err) {
			handleError(err.message);
		} finally {
			setIsLoading(false);
		}
	}

	useEffect(
		function () {
			if (user) {
				navigate("/dashboard");
			}
		},
		[user],
	);

	return (
		<>
			{isLoading && (
				<div className='gifting--loader'>
					<img src={GiftLoader} alt='loader' />
				</div>
			)}
			<div className="auth__container">
				<div className="auth__image--box">
					<span>
						<a className="auth__logo" href={'https://getgifta.com/'}>
							<img src={giftaLogo} alt="logo" />
						</a>
						<h2>Welcome back to Gifta</h2>
						<p>Where Every Moment Deserves the Perfect Gift!</p>
					</span>
				</div>

				<div className="auth--box login--auth">
						
					<h1 className="auth--heading">
						Login
					</h1>

						
					{/* 
						<GoogleLogin
							clientId='409185840466-dk2cs4mdrl315i7s3am5pop520c3uuig.apps.googleusercontent.com'
							onSuccess={responseGoogle}
							onFailure={responseGoogle}
							cookiePolicy={"single_host_origin"}
							isSignedIn={true}
							render={(renderProps) => (
								<div className="google--login" onClick={renderProps.onClick}>
									<img src={GoogleIcon} style={{ cursor: 'pointer' }} />
									<p>Sign in with Google</p>
								</div>
							)}
						/> 
					*/}


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

					<form onSubmit={handleLoginUser} className="auth--form">
						<div className="form--item">
							<label
								htmlFor="Email"
								className="form--label"
							>
								Email
							</label>

							<input
								type="email"
								id="Email"
								name="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="form--input"
								placeholder="Enter your email address"
							/>
						</div>

						<div className="form--item">
							<label
								htmlFor="Password"
								className="form--label"
							>
								Password
							</label>

							<div className="form--input-box">

								<input
									type={showPassword ? "text" : "password"}
									id="Password"
									name="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="form--input"
									placeholder="Enter your password"
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

						<div className="form--check">
							<input
								type="checkbox"
								id="MarketingAccept"
								name="marketing_accept"
								className=""
							/>
							<label htmlFor="MarketingAccept" className="form--label">Remember me</label>
						</div>

						<div className="form--others">
							<button className="form--submit">
								Login
							</button>

							<p className="form--content">
								Don't have an account?{' '}
								<Link to={`/signup`}>
									Sign up
								</Link>
							</p>
						</div>

						<p className="form--content">
							Forgotten your passward?{' '}
							<Link to={`/forgot-password`}>
								Forgot Password
							</Link>
						</p>
					</form>
				</div>
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
	);
}

export default Login;
