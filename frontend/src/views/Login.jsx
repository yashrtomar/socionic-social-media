import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '../redux/authSlice.js';
import { ChevronRight, Eye, EyeOff } from 'lucide-react';

const Login = () => {
	// Local State variables
	const [showPassword, setShowPassword] = useState(false); // Show or hide password
	const [input, setInput] = useState({ userNameOrEmail: '', password: '' }); // Login form inputs
	const [loading, setLoading] = useState(false); //loading state so that page doesn't seem unresponsive
	const [error, setError] = useState(false); //error variable to show error when it occurs

	const dispatch = useDispatch(); //to dispatch an action defined in authSlice
	const { user } = useSelector((store) => store.authSlice); //taking a variable from global state (redux)

	const handleInput = (e) => {
		setInput((input) => ({ ...input, [e.target.name]: e.target.value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			const res = await axios.post(
				'http://localhost:8000/api/user/login',
				input,
				{
					headers: { 'Content-Type': 'application/json' },
					withCredentials: true
				}
			);
			if (res.data.success) {
				dispatch(setAuthUser(res.data.loggedInUser));
				setError(false);
				setInput({ userNameOrEmail: '', password: '' });
				navigate('/');
			}
		} catch (error) {
			setError(true);
			console.log(error);
		}
	};

	const navigate = useNavigate();

	return (
		<section className='h-screen bg-[url("../src/assets/login-bg.jpg")] bg-center bg-cover flex items-center justify-center'>
			<div className='size-full flex text-white'>
				<div className='h-full w-3/5 flex flex-col items-start justify-between p-32'>
					<h1 className='text-6xl font-bold text-orange-600'>
						Socionic
					</h1>
					<div className='flex flex-col gap-10'>
						<h2 className='text-6xl stroke-gray-950'>
							Welcome back !
						</h2>
						<p className='text-lg font-light w-[60ch] mb-5'>
							Be a part of a community, connect-interact with
							people, watch their content, share your mind and
							express yourself.
						</p>
					</div>
				</div>
				<div className='h-full w-2/5 backdrop-blur-md'>
					<div className='size-full flex flex-col px-20 py-24'>
						<div className='h-1/4 w-full flex items-center text-3xl font-light'>
							<h2>Login</h2>
						</div>
						<form className='h-3/4 w-full flex flex-col justify-around gap-5 py-8'>
							<div className='w-full border-b-2 border-gray-600 focus-within:border-orange-600 ease-in-out duration-200'>
								<label htmlFor='usernameOrEmail' hidden>
									Username
								</label>
								<input
									type='text'
									id='usernameOrEmail'
									name='usernameOrEmail'
									placeholder='username or email'
									autoComplete='off'
									onChange={handleInput}
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
									onChange={handleInput}
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
								<button
									type='submit'
									onClick={handleSubmit}
									className='px-6 py-3 bg-orange-600 rounded flex gap-10 mb-5 hover:scale-105 ease-in-out duration-200'>
									Login{' '}
									<ChevronRight
										size={24}
										strokeWidth={1.75}
									/>
								</button>
								<p className='mb-4'>
									Don't have an Account ?{' '}
									<Link to='/signup'>
										<b className='text-orange-600'>
											Sign up !
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

export default Login;
