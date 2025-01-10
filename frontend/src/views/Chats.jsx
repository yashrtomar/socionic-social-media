import { useSelector } from 'react-redux';
import NewChat from '../components/icons/new-chat/NewChat';

const Chats = () => {
	const { user } = useSelector((store) => store.authSlice);
	return (
		<main className='flex'>
			<section className='h-full w-1/4 fixed'>
				<div className='h-full border-r'>
					<div className='flex items-center justify-between px-8 py-5 border-b'>
						<p className='font-medium text-xl'>{user?.username}</p>
						<NewChat />
					</div>
					<div className='flex flex-col gap-5 pt-8'>
						<div className='flex items-center justify-start gap-3 px-8 py-5'>
							<div>
								<img
									src='https://picsum.photos/id/237/200'
									alt='profile image'
									height={56}
									width={56}
									className='aspect-square object-center object-contain rounded-full'
								/>
							</div>
							<div className='flex flex-col justify-center'>
								<span className='text-lg'>username</span>
								<span className='text-xs text-green-600'>
									Online
								</span>
							</div>
						</div>
					</div>
					<div className='flex flex-col gap-5'>
						<div className='flex items-center justify-start gap-3 px-8 py-5'>
							<div>
								<img
									src='https://picsum.photos/id/237/200'
									alt='profile image'
									height={56}
									width={56}
									className='aspect-square object-center object-contain rounded-full'
								/>
							</div>
							<div className='flex flex-col justify-center'>
								<span className='text-lg'>username</span>
								<span className='text-xs text-green-600'>
									Online
								</span>
							</div>
						</div>
					</div>
					<div className='flex flex-col gap-5'>
						<div className='flex items-center justify-start gap-3 px-8 py-5'>
							<div>
								<img
									src='https://picsum.photos/id/237/200'
									alt='profile image'
									height={56}
									width={56}
									className='aspect-square object-center object-contain rounded-full'
								/>
							</div>
							<div className='flex flex-col justify-center'>
								<span className='text-lg'>username</span>
								<span className='text-xs text-green-600'>
									Online
								</span>
							</div>
						</div>
					</div>
				</div>
			</section>
			<section className='w-3/4 ml-[26%] p-5 mt-72'>
				<div className='text-center'>
					<p className='mb-3'>Send a message to start a chat</p>
					<button
						type='button'
						className='border border-blue-600 bg-blue-600 text-white rounded-md px-3 py-1 hover:scale-105 ease-in-out duration-200'>
						Send Message
					</button>
				</div>
			</section>
		</main>
	);
};

export default Chats;
