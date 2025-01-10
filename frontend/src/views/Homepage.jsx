import React from 'react';
import PostsContainer from '../components/PostsContainer';
import useGetAllPosts from '../hooks/useGetAllPosts';

const Homepage = () => {
	useGetAllPosts();
	return (
		<main>
			<section>
				<PostsContainer />
			</section>
		</main>
	);
};

export default Homepage;
