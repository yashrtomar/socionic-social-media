import React from 'react';
import SinglePost from './SinglePost';
import { useSelector } from 'react-redux';

const PostsContainer = () => {
	const { posts } = useSelector((store) => store.postsSlice);
	return (
		<div className='flex flex-wrap items-center justify-center p-10 gap-x-16 gap-y-12'>
			{posts.map((post) => (
				<SinglePost key={post._id} post={post} />
			))}
		</div>
	);
};

export default PostsContainer;
