import axios from 'axios';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setAuthUser } from '../redux/authSlice';

const EditProfile = () => {
	const { user } = useSelector((store) => store.authSlice);

	const imageUploadRef = useRef(null);

	const [formInput, setFormInput] = useState({
		profileImage: user?.profileImage || '',
		bio: user?.bio || '',
		gender: user?.gender || ''
	});

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleImageUpload = async (e) => {
		const imageFile = e.target?.files[0];
		if (imageFile) {
			setFormInput((formInput) => ({
				...formInput,
				profileImage: imageFile
			}));
		}
	};

	const handleSelectGender = (e) => {
		setFormInput((formInput) => ({ ...formInput, gender: e.target.value }));
	};

	const handleEditProfileSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		console.log('form input: ', formInput);
		if (formInput.profileImage) {
			formData.append('profileImage', formInput.profileImage);
		}
		formData.append('bio', formInput.bio);
		formData.append('gender', formInput.gender);
		for (let [key, value] of formData.entries()) {
			console.log(`${key}: ${value}`);
		}

		try {
			const res = await axios.post(
				'http://localhost:8000/api/user/profile/update',
				formData,
				{
					headers: { 'Content-Type': 'multipart/form-data' },
					withCredentials: true
				}
			);
			if (res.data.success) {
				const updateUserData = {
					...user,
					profileImage: res.data.user.profileImage,
					bio: res.data.user.bio,
					gender: res.data.user.gender
				};
				console.log('Updated user data:', updateUserData);
				dispatch(setAuthUser(updateUserData));
				console.log('Redux state after update:', user);
				navigate(`/profile/${user._id}`);
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<main className='flex justify-center'>
			<section className='w-4/5'>
				<div className='py-10'>
					<h1 className='text-3xl font-bold'>Edit Profile</h1>
				</div>
				<form>
					<div className='px-10'>
						<div className='flex items-center justify-between bg-gray-100 rounded-xl px-10 py-5'>
							<div className='flex items-center justify-center gap-5'>
								<img
									src={
										user?.profileImage
											? user?.profileImage
											: 'https://picsum.photos/id/237/200'
									}
									alt='profile image'
									height={56}
									width={56}
									className='aspect-square object-cover object-center rounded-full'
								/>
								<p className='font-medium text-2xl'>
									{user?.username}
								</p>
							</div>
							<div>
								<input
									type='file'
									id='image-upload'
									name='image-upload'
									ref={imageUploadRef}
									hidden
									onChange={handleImageUpload}
								/>
								<label htmlFor='image-upload'>
									<button
										type='button'
										onClick={() => {
											imageUploadRef.current.click();
										}}
										className='border border-blue-600 bg-blue-600 text-white rounded-md px-3 py-1 hover:scale-105 ease-in-out duration-200'>
										Change Photo
									</button>
								</label>
							</div>
						</div>
					</div>
					<div className='p-10 flex flex-col gap-5'>
						<div className='flex flex-col gap-3'>
							<label
								htmlFor='bio'
								className='font-medium text-xl px-3'>
								Bio
							</label>
							<textarea
								id='bio'
								name='bio'
								rows='5'
								cols='50'
								value={formInput.bio || ''}
								onChange={(e) => {
									setFormInput({
										...formInput,
										bio: e.target.value
									});
								}}
								className='border border-gray-300 outline-none rounded-md resize-none p-3'></textarea>
						</div>
						<div className='flex flex-col gap-3'>
							<label
								htmlFor='gender'
								className='font-medium text-xl px-3'>
								Gender
							</label>
							<select
								name='gender'
								id='gender'
								value={formInput.gender || ''} // Correct two-way binding
								onChange={handleSelectGender} // Correctly pass the event to the handler
								className='border rounded-md p-3 outline-none'>
								<option value=''>Select Gender</option>
								<option value='male'>Male</option>
								<option value='female'>Female</option>
								<option value='other'>Other</option>
							</select>
						</div>
						<div>
							<button
								type='submit'
								onClick={handleEditProfileSubmit}
								className='border border-blue-600 bg-blue-600 text-white rounded-md px-12 py-3 hover:scale-105 ease-in-out duration-200 mt-5'>
								Save Changes
							</button>
						</div>
					</div>
				</form>
			</section>
		</main>
	);
};

export default EditProfile;
