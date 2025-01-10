import React, { forwardRef, useRef, useState } from 'react';
import { readFileAsDataUrl } from '../../utils/utils.js';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '../../redux/postSlice.js';
import { CircleUser } from 'lucide-react';

const CreatePostDialog = forwardRef(({ toggleDialog }, ref) => {
	const [imageFile, setImageFile] = useState(''); // for image upload
	const [imagePreview, setImagePreview] = useState(''); // to preview uploaded image in the create post UI (this dialog)
	const [caption, setCaption] = useState(''); // for caption of the post being created
	const [loading, setLoading] = useState(false); // loading state to display 'loading' UI elements while API call

	// access user and posts data from store
	const { user } = useSelector((store) => store.authSlice);
	const { posts } = useSelector((store) => store.postsSlice);

	// to dispatch actions
	const dispatch = useDispatch();

	// to bind click even to a button (child element of the Image Upload UI)
	const imageUploadRef = useRef(null);

	// function to recieve uploaded image, convert it to a URI and display preview
	const handleImageUpload = async (e) => {
		const file = e.target?.files[0];
		if (file) {
			setImageFile(file);
			const imageDataUrl = await readFileAsDataUrl(file);
			setImagePreview(imageDataUrl);
		}
	};

	// function to call API to actually create a post- Update the database
	const handleCreatePost = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append('caption', caption);
		if (imagePreview) formData.append('media', imageFile);
		try {
			setLoading(true);
			const res = await axios.post(
				'http://localhost:8000/api/post/add-post',
				formData,
				{
					headers: { 'content-Type': 'multipart/form-data' },
					withCredentials: true
				}
			);
			if (res.data.success) {
				console.log(res.data.message);
				dispatch(setPosts([res.data.post, ...posts]));
			}
			toggleDialog();
		} catch (error) {
			console.log(error);
		} finally {
			setImageFile('');
			setImagePreview('');
			setCaption('');
			setLoading(false);
		}
	};

	return (
		<dialog
			ref={ref}
			onClick={(e) => {
				if (e.currentTarget === e.target) toggleDialog();
			}}
			className='h-[70%] w-[60%] outline-none'>
			<div className='w-full h-full flex flex-col overflow-hidden'>
				<div className='w-full px-5 py-3 border-b border-gray-300'>
					<header className='flex'>
						<h1 className='font-semibold w-[95%] text-center ml-16'>
							Create New Post
						</h1>
						{loading ? (
							<span>LOADING...</span>
						) : (
							imagePreview && (
								<button
									type='submit'
									onClick={handleCreatePost}
									className='text-indigo-600 font-semibold w-[5%]'>
									Post
								</button>
							)
						)}
					</header>
				</div>
				<div className='flex h-full'>
					{imagePreview ? (
						<div className='w-[60%] h-full'>
							<img
								className='aspect-square object-cover'
								src={imagePreview}
								alt='post-image-preview'
							/>
						</div>
					) : (
						<div className='flex-1 flex flex-col items-center justify-center gap-5'>
							<input
								ref={imageUploadRef}
								type='file'
								hidden
								id='image-upload'
								onChange={handleImageUpload}
							/>
							<label htmlFor='image-upload'>
								<button
									onClick={() => {
										imageUploadRef.current.click();
									}}
									className='text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg'>
									Select from computer
								</button>
							</label>
							<p className='text-gray-400 mb-10'>
								Just keep the good stuff as centered as possible
								!
							</p>
						</div>
					)}
					<div className='w-[40%] border-l border-gray-300 py-5 flex flex-col gap-5'>
						<div className='flex items-center justify-between px-5'>
							<div className='flex items-center gap-3'>
								{user?.profilePicture ? (
									<img
										src={user?.profilePicture}
										alt='post-image'
										height={36}
										width={36}
										className='rounded-full border border-indigo-500 aspect-square object-cover'
									/>
								) : (
									<CircleUser size={24} strokeWidth={1.75} />
								)}
								<h1 className='font-semibold'>
									{user?.username || 'username'}
								</h1>
							</div>
						</div>
						<div className='w-full px-5'>
							<textarea
								placeholder='Add a caption'
								className='w-full h-full resize-none outline-none'
								value={caption}
								onChange={(e) => setCaption(e.target.value)}
							/>
						</div>
					</div>
				</div>
			</div>
		</dialog>
	);
});

export default CreatePostDialog;
