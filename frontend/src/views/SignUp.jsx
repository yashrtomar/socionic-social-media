import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronRight, Eye, EyeOff } from 'lucide-react';

const SignUp = () => {
	// Local State variables
	const [showPassword, setShowPassword] = useState(false); // Show or hide password
	const [input, setInput] = useState({
		username: '',
		email: '',
		password: ''
	}); // Sign Up form inputs
	const [loading, setLoading] = useState(false); //loading state so that page doesn't seem unresponsive
	const [error, setError] = useState(false); //error variable to show error when it occurs

	const navigate = useNavigate(); // to navigate to login page after a successful Sign up of user

	// function to handle input
	const handleInput = (e) => {
		setInput((input) => ({ ...input, [e.target.name]: e.target.value }));
	};

	// function to execute Sign Up - call API and adds user to database
	const handleSubmit = async (e) => {
		e.preventDefault(); //Prevent default behaviour of the form
		try {
			setLoading(true);
			const res = await axios.post(
				'http://localhost:8000/api/user/signup',
				input,
				{
					headers: { 'Content-Type': 'application/json' },
					withCredentials: true
				}
			);
			if (res.data.success) {
				setError(false);
				setInput({ email: '', username: '', password: '' });
				navigate('/login');
			}
		} catch (error) {
			setError(true);
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<section className='h-screen bg-[url("../src/assets/login-bg.jpg")] bg-center bg-cover flex items-center justify-center'>
			<div className='size-full flex text-white'>
				<div className='h-full w-3/5 flex flex-col items-start justify-between p-32'>
					<h1 className='text-6xl font-bold text-orange-600'>
						Socionic
					</h1>
					<div className='flex flex-col gap-10'>
						<h2 className='text-6xl stroke-gray-950'>Welcome !</h2>
						<p className='text-lg font-light w-[60ch] mb-5'>
							Sign up to be a part of a community,
							connect-interact with people, share your mind and
							express yourself.
						</p>
					</div>
				</div>
				<div className='h-full w-2/5 backdrop-blur-md'>
					<div className='size-full flex flex-col px-20 py-24'>
						<div className='h-1/4 w-full flex items-center text-3xl font-light'>
							<h2>Sign up</h2>
						</div>
						<form
							// onSubmit={handleSubmit}
							className='h-3/4 w-full flex flex-col justify-around gap-5'>
							<div className='w-full border-b-2 border-gray-600 focus-within:border-orange-600 ease-in-out duration-200'>
								<label htmlFor='email' hidden>
									Email
								</label>
								<input
									type='email'
									id='email'
									name='email'
									placeholder='email'
									autoComplete='off'
									value={input.email}
									onChange={handleInput}
									required
									className='h-full w-full p-3 bg-transparent outline-none'
								/>
							</div>
							<div className='w-full border-b-2 border-gray-600 focus-within:border-orange-600 ease-in-out duration-200'>
								<label htmlFor='username' hidden>
									Username
								</label>
								<input
									type='text'
									id='username'
									name='username'
									placeholder='username'
									autoComplete='off'
									value={input.username}
									onChange={handleInput}
									required
									className='h-full w-full p-3 bg-transparent outline-none'
								/>
							</div>
							<div className='w-full border-b-2 border-gray-600 focus-within:border-orange-600 ease-in-out duration-200 flex items-center'>
								<label htmlFor='password' hidden></label>
								<input
									type={showPassword ? 'text' : 'password'}
									id='password'
									name='password'
									placeholder='password'
									autoComplete='off'
									value={input.password}
									onChange={handleInput}
									required
									className='h-full w-full p-3 bg-transparent outline-none'
								/>
								<button
									type='button'
									className='mr-3 cursor-pointer'
									onClick={() =>
										setShowPassword(!showPassword)
									}>
									{showPassword ? (
										<EyeOff size={24} strokeWidth={1.75} />
									) : (
										<Eye size={24} strokeWidth={1.75} />
									)}
								</button>
							</div>
							<div className='w-full mt-5 flex items-center justify-between px-2'>
								{loading ? (
									<button
										type='submit'
										className='px-6 py-3 bg-orange-600 rounded flex gap-10 mb-5 hover:scale-105 ease-in-out duration-200'>
										<span className='size-4 rounded-full border border-dotted border-white'></span>
									</button>
								) : (
									<button
										type='submit'
										onClick={handleSubmit}
										className='px-6 py-3 bg-orange-600 rounded flex gap-10 mb-5 hover:scale-105 ease-in-out duration-200'>
										Sign up{' '}
										<ChevronRight
											size={24}
											strokeWidth={1.75}
										/>
									</button>
								)}
								<p className='mb-4'>
									Already have an Account ?{' '}
									<Link to='/login'>
										<b className='text-orange-600'>
											Login !
										</b>
									</Link>
								</p>
							</div>
						</form>
					</div>
				</div>
			</div>
		</section>
	);
};

export default SignUp;
