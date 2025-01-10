import { forwardRef, useRef, useState } from 'react';
import PostMenuDialog from './PostMenuDialog';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '../../redux/postSlice';
import { CircleUser, LucideEllipsisVertical } from 'lucide-react';

const CommentDialog = forwardRef(({ toggleCommentDialog, post }, ref) => {
	const { posts } = useSelector((store) => store.postsSlice);

	const dispatch = useDispatch();

	const [commentInput, setCommentInput] = useState('');
	// const [comment, setComment] = useState(post.commentsList);

	const handleCommentInput = (e) => {
		const inputText = e.target.value;
		if (inputText.trim()) {
			setCommentInput(inputText);
		} else {
			setCommentInput('');
		}
	};

	const handleComment = async () => {
		try {
			const res = await axios.post(
				`http://localhost:8000/api/post/${post._id}/comment`,
				{ text: commentInput },
				{
					headers: { 'Content-type': 'application/json' },
					withCredentials: true
				}
			);
			if (res.data.success) {
				console.log(res.data);
				const updatedCommentsOnPost = [
					...post.commentsList,
					res.data.comment
				];
				// setComment(updatedCommentsOnPost);
				const updatedPostsData = posts.map((p) =>
					p._id === post._id
						? { ...p, commentsList: updatedCommentsOnPost }
						: p
				);
				dispatch(setPosts(updatedPostsData));
				console.log(res.data.message);
				setCommentInput('');
			}
		} catch (error) {
			console.log(error);
		}
	};

	const postMenuDialogRef = useRef(null);
	const togglePostMenuDialog = () => {
		if (!postMenuDialogRef.current) return;
		postMenuDialogRef.current.hasAttribute('open')
			? postMenuDialogRef.current.close()
			: postMenuDialogRef.current.showModal();
	};

	return (
		<>
			<dialog
				ref={ref}
				onClick={(e) => {
					if (e.currentTarget === e.target) toggleCommentDialog();
				}}
				className='w-4/5 h-4/5 outline-none'>
				<div className='w-full h-full overflow-hidden flex'>
					<div className='w-[60%] h-full'>
						<img
							className='h-full w-full object-cover object-center'
							src={post.media}
							alt='post-image'
						/>
					</div>
					<div className='w-[40%] flex flex-col'>
						<div className='flex items-center justify-between px-5 py-5 border-b border-gray-300'>
							<div className='flex items-center gap-3'>
								{post.postCreator.profileImage ? (
									<img
										src={post.postCreator.profileImage}
										alt='profile-image'
										height={36}
										width={36}
										className='inline rounded-full border border-indigo-500 aspect-square object-cover'
									/>
								) : (
									<CircleUser size={24} strokeWidth={1.75} />
								)}
								<p className='font-medium'>
									{post.postCreator.username || username}
								</p>
							</div>
							<div
								onClick={togglePostMenuDialog}
								className='cursor-pointer'>
								<LucideEllipsisVertical
									size={24}
									strokeWidth={1.75}
								/>
							</div>
						</div>
						<div className='p-5 overflow-y-auto flex-grow flex flex-col gap-4'>
							<div className='flex gap-2'>
								{post.postCreator.profileImage ? (
									<img
										src={post.postCreator.profileImage}
										alt='profile-image'
										height={36}
										width={36}
										className='inline rounded-full border border-indigo-500 aspect-square object-cover'
									/>
								) : (
									<CircleUser size={24} strokeWidth={1.75} />
								)}
								<div>
									<p className='font-medium inline'>
										{post.postCreator.username || username}
									</p>
									<p className='px-1 inline'>
										{post.caption}
									</p>
								</div>
							</div>
							{post.commentsList.map((comment) => (
								<div
									key={comment._id}
									className='mb-3 flex items-center gap-2'>
									<div>
										{comment.commenter.profileImage ? (
											<img
												src={
													comment.commenter
														.profileImage
												}
											/>
										) : (
											<ProfileIconOutline />
										)}
									</div>
									<div>
										<p className='font-medium inline'>
											{comment.commenter.username}:
										</p>
										<p className='inline px-1'>
											{comment.text}
										</p>
									</div>
								</div>
							))}
						</div>
						<div className='px-5 py-2 flex items-center justify-between border-t border-gray-300'>
							<input
								type='text'
								placeholder='Add a comment...'
								value={commentInput}
								onChange={handleCommentInput}
								className='outline-none text-sm w-full p-2'
							/>
							{commentInput && (
								<button
									type='button'
									onClick={handleComment}
									className='text-indigo-500 cursor-pointer'>
									Post
								</button>
							)}
						</div>
					</div>
				</div>
			</dialog>
			<PostMenuDialog
				ref={postMenuDialogRef}
				togglePostMenuDialog={togglePostMenuDialog}
			/>
		</>
	);
});

export default CommentDialog;
