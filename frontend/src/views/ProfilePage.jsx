import React, { useState } from 'react';
import HeartIconSolid from '../components/icons/heart-icon/HeartIconSolid';
import ChatBubbleSolid from '../components/icons/chat-bubble-icon/ChatBubbleSolid';
import useGetUserProfile from '../hooks/useGetUserProfile';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Bookmark, CircleUser, ImagePlay } from 'lucide-react';

const ProfilePage = () => {
	const params = useParams();
	const userId = params.id;
	useGetUserProfile(userId);
	const { userProfile } = useSelector((store) => store.authSlice);

	const { user } = useSelector((store) => store.authSlice);

	const [active, setActive] = useState('posts');

	return (
		<main className='flex'>
			<section className='h-[90%] w-1/4 fixed top-[77px] p-10'>
				<div className='h-full flex flex-col gap-5 border-r pr-10'>
					<div className='flex items-center'>
						{userProfile?.profileImage ? (
							<img
								src={userProfile.profileImage}
								alt='profile image'
								height={160}
								width={160}
								className='object-cover aspect-square rounded-full'
							/>
						) : (
							<CircleUser size={160} strokeWidth={5} />
						)}
					</div>
					<div>
						<p className='text-2xl font-medium mb-5'>
							{userProfile?.username}
						</p>
						<div className='flex items-center gap-5'>
							<p>
								<span className='block text-center font-medium'>
									{userProfile?.postsList.length}
								</span>
								Posts
							</p>
							<p>
								<span className='block text-center font-medium'>
									{userProfile?.followersList.length}
								</span>
								Followers
							</p>
							<p>
								<span className='block text-center font-medium'>
									{userProfile?.followingList.length}
								</span>
								Following
							</p>
						</div>
					</div>
					{userProfile?._id === user?._id ? (
						<Link
							to='/profile/edit'
							className='flex items-center gap-3 mb-3'>
							<button className='border border-blue-600 bg-blue-600 text-white rounded-md px-3 py-1 hover:scale-105 ease-in-out duration-200'>
								Edit Profile
							</button>
						</Link>
					) : (
						<div className='flex items-center gap-3 mb-3'>
							{user?.followingList.includes(userProfile?._id) ? (
								<button className='border border-gray-400 bg-gray-400 text-black rounded-md px-3 py-1 hover:scale-105 ease-in-out duration-200'>
									Unfollow
								</button>
							) : (
								<button className='border border-blue-600 bg-blue-600 text-white rounded-md px-3 py-1 hover:scale-105 ease-in-out duration-200'>
									Follow
								</button>
							)}
							<button className='border border-blue-600 bg-blue-600 text-white rounded-md px-3 py-1 hover:scale-105 ease-in-out duration-200'>
								Message
							</button>
						</div>
					)}
					<div>
						<p>{userProfile?.bio}</p>
					</div>
				</div>
			</section>
			<section className='w-3/4 ml-[26%] p-5'>
				<div className='flex items-center justify-center gap-32 mt-3 mb-8 mr-16'>
					<button
						type='button'
						onClick={() => setActive('posts')}
						className={`flex items-center justify-center gap-2 ${
							active === 'posts'
								? 'text-orange-600'
								: 'text-gray-400'
						}`}>
						<ImagePlay size={20} strokeWidth={1.75} /> Posts
					</button>
					<button
						type='button'
						onClick={() => setActive('saved')}
						className={`flex items-center justify-center gap-2 ${
							active === 'saved'
								? 'text-orange-600'
								: 'text-gray-400'
						}`}>
						<Bookmark size={20} strokeWidth={1.75} /> Saved
					</button>
				</div>
				{active === 'posts' ? (
					<div className='size-full flex flex-wrap gap-1 items-start justify-start pl-8'>
						{userProfile?.postsList.map((post) => {
							return (
								<div key={post._id} className='relative'>
									<div className='relative size-full cursor-pointer'>
										<img
											src={post.media}
											alt='post image'
											height={240}
											width={240}
											className='object-cover aspect-square '
										/>
										<div className='size-full absolute top-0 bg-black opacity-0 left-0 text-white flex items-center justify-center gap-5 hover:opacity-70 ease-out duration-200'>
											<span className='flex gap-1'>
												<span>
													<HeartIconSolid />
												</span>
												<span className='font-medium'>
													{post.likesList.length}
												</span>
											</span>
											<span className='flex gap-1'>
												<span>
													<ChatBubbleSolid />
												</span>
												<span className='font-medium'>
													{post.commentsList.length}
												</span>
											</span>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				) : (
					<div className='size-full flex flex-wrap gap-1 items-start justify-start pl-10'>
						{userProfile?.savedPostsList.map((post) => {
							return (
								<div key={post._id} className='relative'>
									<div className='relative size-full cursor-pointer'>
										<img
											src={post.media}
											alt='post image'
											height={320}
											width={320}
											className='object-cover aspect-square '
										/>
										<div className='size-full absolute top-0 bg-black opacity-0 left-0 text-white flex items-center justify-center gap-5 hover:opacity-70 ease-out duration-200'>
											<span className='flex gap-1'>
												<span>
													<HeartIconSolid />
												</span>
												<span className='font-medium'>
													{post.likesList.length}
												</span>
											</span>
											<span className='flex gap-1'>
												<span>
													<ChatBubbleSolid />
												</span>
												<span className='font-medium'>
													{post.commentsList.length}
												</span>
											</span>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</section>
		</main>
	);
};

export default ProfilePage;
