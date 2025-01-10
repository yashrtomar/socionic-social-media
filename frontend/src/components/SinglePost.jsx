import React, { useState, useRef } from 'react';
import ProfileIconSolid from './icons/profile-icon/ProfileIconSolid';
import PostMenuDialog from './dialogs/PostMenuDialog';
import CommentDialog from './dialogs/CommentDialog';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setPosts } from '../redux/postSlice';
import { Link } from 'react-router-dom';
import {
	Bookmark,
	EllipsisVertical,
	Heart,
	MessageCircle,
	Send,
	Square
} from 'lucide-react';

const SinglePost = ({ post }) => {
	// access data from store
	const { user } = useSelector((store) => store.authSlice);
	const { posts } = useSelector((store) => store.postsSlice);

	const dispatch = useDispatch();

	// state variables for interactive elements - like-unlike and comment
	const [comment, setComment] = useState('');
	const [liked, setLiked] = useState(post.likesList.includes(user) || false);
	const [numberOfLikes, setNumberOfLikes] = useState(post.likesList.length);
	// toggle image resolution feature for images of resolution other than square
	const [originalImageResolution, setOriginalImageResolution] =
		useState(false);
	const [viewFullCaption, setViewFullCaption] = useState(false);
	const [saved, setSaved] = useState(
		user?.savedPostsList?.includes(post._id) || false
	);

	// to toggle dialogs
	const postMenuDialogRef = useRef(null);
	const commentDialogRef = useRef(null);
	const fullScreenDialogRef = useRef(null);

	const handleCommentInput = (e) => {
		const inputText = e.target.value;
		if (inputText.trim()) {
			setComment(inputText);
		} else {
			setComment('');
		}
	};

	const handleLikeDislike = async () => {
		try {
			const action = liked ? 'dislike' : 'like';
			const res = await axios.get(
				`http://localhost:8000/api/post/${post?._id}/${action}`,
				{ withCredentials: true }
			);
			if (res.data.success) {
				const updateNumberOfLikes = liked
					? numberOfLikes - 1
					: numberOfLikes + 1;
				setNumberOfLikes(updateNumberOfLikes);
				setLiked(!liked);
				const updatedPostsData = posts.map((p) =>
					p._id === post._id
						? {
								...p,
								likesList: liked
									? p.likesList.filter(
											(id) => id !== user._id
									  )
									: [...p.likesList, user._id]
						  }
						: p
				);
				dispatch(setPosts(updatedPostsData));
				console.log(res.data.message);
			}
		} catch (error) {
			console.log(error);
		}
	};

	//Function to save/unsave posts
	const handleSaveOrUnsave = async () => {
		try {
			const res = await axios.post(
				`http://localhost:8000/api/post/${post._id}/save`,
				{},
				{ withCredentials: true }
			);
			if (res.data.success) {
				console.log(res.data.message);
				setSaved(!saved);
			}
		} catch (error) {
			console.log(error);
		}
	};

	// toggle menu from each post
	const togglePostMenuDialog = () => {
		if (!postMenuDialogRef.current) return;
		else if (postMenuDialogRef.current.hasAttribute('open')) {
			postMenuDialogRef.current.close();
		} else {
			postMenuDialogRef.current.showModal();
		}
	};

	// to toggle comments view from reach post
	const toggleCommentDialog = () => {
		if (!commentDialogRef.current) return;
		else if (commentDialogRef.current.hasAttribute('open')) {
			commentDialogRef.current.close();
		} else {
			commentDialogRef.current.showModal();
		}
	};

	// to toggle comments view from reach post
	const toggleFullScreenDialog = () => {
		if (!fullScreenDialogRef.current) return;
		else if (fullScreenDialogRef.current.hasAttribute('open')) {
			fullScreenDialogRef.current.close();
		} else {
			fullScreenDialogRef.current.showModal();
		}
	};

	return (
		<>
			<section className='w-full max-w-sm'>
				<div className='flex items-center justify-between h-10 mb-3 px-1'>
					<Link
						to={`/profile/${post.postCreator._id}`}
						className='flex items-center justify-center gap-3 cursor-pointer'>
						{post.postCreator?.profileImage ? (
							<img
								src={post.postCreator?.profileImage}
								alt='profile-image'
								height={40}
								width={40}
								className='rounded-full aspect-square object-cover'
							/>
						) : (
							<ProfileIconSolid />
						)}
						<p className='font-medium'>
							{post.postCreator?.username || 'Username'}
						</p>
					</Link>
					<div
						onClick={togglePostMenuDialog}
						className='cursor-pointer'>
						<EllipsisVertical size={20} strokeWidth={1.75} />
					</div>
				</div>
				<div className='relative'>
					<img
						className={`${
							originalImageResolution
								? 'object-contain'
								: 'object-cover'
						} my-2 w-full rounded-md aspect-square`}
						src={post.media}
						alt='post-image'
					/>
					<span
						onClick={() =>
							setOriginalImageResolution(!originalImageResolution)
						}
						className='absolute bottom-3 right-3 rounded-full p-2 bg-black cursor-pointer'>
						{originalImageResolution ? (
							<Square
								size={12}
								strokeWidth={1.75}
								color='white'
								fill='white'
							/>
						) : (
							<Square
								size={12}
								strokeWidth={1.75}
								color='white'
							/>
						)}
					</span>
				</div>
				<div className='flex items-center justify-between mt-5 mb-1 px-1'>
					<div className='flex items-center justify-start gap-4'>
						{
							<div className='flex items-center justify-center gap-2'>
								<span
									onClick={handleLikeDislike}
									className='cursor-pointer hover:scale-110 ease-in-out duration-200'>
									{liked ? (
										<Heart
											size={24}
											strokeWidth={0}
											fill='red'
										/>
									) : (
										<Heart size={24} strokeWidth={1.75} />
									)}
								</span>
								<span>{post.likesList.length}</span>
							</div>
						}
						{
							<div className='flex items-center justify-center gap-2'>
								<span
									onClick={toggleCommentDialog}
									className='cursor-pointer hover:scale-110 ease-in-out duration-200'>
									<MessageCircle
										size={24}
										strokeWidth={1.75}
									/>
								</span>
								<span>{post.commentsList.length}</span>
							</div>
						}
						<span className='cursor-pointer hover:scale-110 ease-in-out duration-200 mt-1'>
							<Send size={24} strokeWidth={1.75} />
						</span>
					</div>
					<div
						onClick={handleSaveOrUnsave}
						className='cursor-pointer hover:scale-110 ease-in-out duration-200'>
						{saved ? (
							<Bookmark
								size={24}
								strokeWidth={1.75}
								fill='black'
							/>
						) : (
							<Bookmark size={24} strokeWidth={1.75} />
						)}
					</div>
				</div>
				<div className='px-1 mb-2'>
					<span className='mr-2 font-medium'>
						{post.postCreator?.username || 'username'}
					</span>
					{viewFullCaption ? (
						<div className={`${viewFullCaption ? '' : 'flex'}`}>
							<p>{post.caption}</p>
							<span
								className='text-blue-600 cursor-pointer hover:underline'
								onClick={() =>
									setViewFullCaption(!viewFullCaption)
								}>
								less
							</span>
						</div>
					) : (
						<div className={`${viewFullCaption ? '' : 'flex'}`}>
							<p className='line-clamp-1'>{post.caption}</p>
							{post.caption.length > 50 ? (
								<span
									className='text-blue-600 cursor-pointer hover:underline'
									onClick={() =>
										setViewFullCaption(!viewFullCaption)
									}>
									more
								</span>
							) : null}
						</div>
					)}
				</div>
				<div className='p-1 flex items-center justify-between border-b border-gray-300'>
					<input
						type='text'
						placeholder='Add a comment...'
						value={comment}
						onChange={handleCommentInput}
						className='outline-none text-sm w-full p-2'
					/>
					{comment && (
						<span className='text-indigo-500 cursor-pointer'>
							Post
						</span>
					)}
				</div>
			</section>
			<PostMenuDialog
				ref={postMenuDialogRef}
				togglePostMenuDialog={togglePostMenuDialog}
				userId={user._id}
				postId={post._id}
				postCreatorId={post.postCreator._id}
			/>
			<CommentDialog
				ref={commentDialogRef}
				toggleCommentDialog={toggleCommentDialog}
				post={post}
			/>
		</>
	);
};

export default SinglePost;
