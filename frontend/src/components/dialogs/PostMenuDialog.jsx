import axios from 'axios';
import React, { forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '../../redux/postSlice';

const PostMenuDialog = forwardRef(
	({ togglePostMenuDialog, userId, postId, postCreatorId }, ref) => {
		// access user and posts data from store
		const { posts } = useSelector((store) => store.postsSlice);

		// to dispatch actions related to posts- add a new post
		const dispatch = useDispatch();

		// function to delete post
		const handleDeletePost = async () => {
			try {
				const res = await axios.delete(
					`http://localhost:8000/api/v2/post/delete-post/${postId}`,
					{ withCredentials: true }
				);
				if (res.data.success) {
					const updatedPosts = posts.filter(
						(postItem) => postItem._id !== postId
					);
					dispatch(setPosts(updatedPosts));
					console.log(res.data.message);
				}
			} catch (error) {
				console.log(error);
			}
		};
		return (
			<dialog
				ref={ref}
				onClick={(e) => {
					if (e.currentTarget === e.target) togglePostMenuDialog();
				}}
				className='w-96 rounded-md border-none outline-none backdrop-brightness-100'>
				<div className='flex flex-col items-center justify-center'>
					<div className='flex items-center justify-center cursor-pointer h-14 w-full text-center text-red-600 border-b border-gray-300'>
						Unfollow
					</div>
					<div className='flex items-center justify-center cursor-pointer h-14 w-full text-center border-b border-gray-300'>
						Add to favourites
					</div>

					{userId === postCreatorId && (
						<div
							onClick={handleDeletePost}
							className='flex items-center justify-center cursor-pointer h-14 w-full text-center'>
							Delete Post
						</div>
					)}
				</div>
			</dialog>
		);
	}
);

export default PostMenuDialog;
