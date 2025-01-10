import React, { useEffect, useRef, useState } from 'react';
// import HomeIconOutline from './icons/home-icon/HomeIconOutline';
// import HomeIconSolid from './icons/home-icon/HomeIconSolid';
import CreateIconSolid from './icons/create-icon/CreateIconSolid';
import CreateIconOutline from './icons/create-icon/CreateIconOutline';
import SearchIcon from './icons/search-icon/SearchIcon';
import HeartIconSolid from './icons/heart-icon/HeartIconSolid';
import HeartIconOutline from './icons/heart-icon/HeartIconOutline';
import SendIconSolid from './icons/send-icon/SendIconSolid';
import SendIconOutline from './icons/send-icon/SendIconOutline';
import ProfileIconSolid from './icons/profile-icon/ProfileIconSolid';
import ProfileIconOutline from './icons/profile-icon/ProfileIconOutline';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuthUser } from '../redux/authSlice';
import CreatePostDialog from './dialogs/CreatePostDialog';
import axios from 'axios';
import SearchDialog from './dialogs/SearchDialog';
import NotificationDialog from './dialogs/NotificationDialog';
import BarsMenuIcon from './icons/bars-menu-icon/BarsMenuIcon';
import SaveOutline from './icons/save-icon/SaveOutline';
import LightThemeSun from './icons/appearance-icons/LightThemeSun';
import { useSelector } from 'react-redux';
import {
	CirclePlus,
	CircleUser,
	EllipsisVertical,
	Heart,
	House,
	Search,
	Send
} from 'lucide-react';

const Navbar = () => {
	const { user } = useSelector((store) => store.authSlice);

	const [activeMenuItem, setActiveMenuItem] = useState('home');
	const [open, setOpen] = useState(false);

	const createPostDialogRef = useRef(null);
	const searchDialogRef = useRef(null);
	const notificationDialogRef = useRef(null);
	const dropdownRef = useRef(null);
	const menuButtonRef = useRef(null);

	useEffect(() => {
		document.addEventListener('click', handleDropDownClose, true);
		return () => {
			document.removeEventListener('click', handleDropDownClose, true);
		};
	}, [open]);

	const handleDropDownClose = (e) => {
		if (
			dropdownRef.current &&
			!dropdownRef.current.contains(e.target) &&
			menuButtonRef.current &&
			!menuButtonRef.current.contains(e.target)
		) {
			setOpen(false);
		}
	};

	const dispatch = useDispatch();

	const navigate = useNavigate();

	const location = useLocation();

	const handleLogout = async () => {
		try {
			const res = await axios.get(
				'http://localhost:8000/api/user/logout',
				{ withCredentials: true }
			);
			if (res.data.success) {
				dispatch(setAuthUser(null));
				console.log(res.data.message);
				navigate('/login');
			}
		} catch (error) {
			console.log(error);
		}
	};

	const toggleCreatePostDialog = () => {
		if (!createPostDialogRef.current) return;
		if (createPostDialogRef.current.hasAttribute('open')) {
			createPostDialogRef.current.close();
			setActiveMenuItem('home');
		} else {
			createPostDialogRef.current.showModal();
		}
	};

	const toggleSearchDialog = () => {
		if (!searchDialogRef.current) return;
		if (searchDialogRef.current.hasAttribute('open')) {
			searchDialogRef.current.close();
			setActiveMenuItem('search');
		} else {
			searchDialogRef.current.showModal();
		}
	};

	const toggleNotificationDialog = () => {
		if (!notificationDialogRef.current) return;
		if (notificationDialogRef.current.hasAttribute('open')) {
			notificationDialogRef.current.close();
			setActiveMenuItem('search');
		} else {
			notificationDialogRef.current.showModal();
		}
	};

	const handleNavMenu = (menuItem) => {
		setActiveMenuItem(menuItem);
	};

	const centerNavMenuItems = [
		{
			id: 1,
			icon: (
				<div>
					{location.pathname === '/' && activeMenuItem === 'home' ? (
						<House
							size={24}
							strokeWidth={1.75}
							className='text-orange-600'
						/>
					) : (
						<House size={24} strokeWidth={1.75} />
					)}
				</div>
			),
			text: 'Home'
		},
		{
			id: 2,
			icon: (
				<div onClick={toggleCreatePostDialog}>
					{activeMenuItem === 'create' ? (
						<CirclePlus
							size={24}
							strokeWidth={1.75}
							className='text-orange-600'
						/>
					) : (
						<CirclePlus size={24} strokeWidth={1.75} />
					)}
				</div>
			),
			text: 'Create'
		},
		{
			id: 3,
			icon: (
				<div onClick={toggleSearchDialog}>
					<Search size={24} strokeWidth={1.75} />
				</div>
			),
			text: 'Search'
		},
		{
			id: 4,
			icon: (
				<div onClick={toggleNotificationDialog}>
					{activeMenuItem === 'notifications' ? (
						<Heart
							size={24}
							strokeWidth={1.75}
							className='text-orange-600'
						/>
					) : (
						<Heart size={24} strokeWidth={1.75} />
					)}
				</div>
			),
			text: 'Notifications'
		}
	];

	const rightNavMenuItems = [
		{
			id: 1,
			icon: (
				<Link to='/chats'>
					<div>
						{location.pathname === '/chats' ? (
							<Send
								size={22}
								strokeWidth={1.75}
								className='text-orange-600'
							/>
						) : (
							<Send size={22} strokeWidth={1.75} />
						)}
					</div>
				</Link>
			),
			text: 'Chats'
		},
		{
			id: 2,
			icon: (
				<Link to={`/profile/${user?._id}`}>
					<div>
						{location.pathname === `/profile/${user._id}` ? (
							<CircleUser
								size={24}
								strokeWidth={1.75}
								className='text-orange-600'
							/>
						) : (
							<CircleUser size={24} strokeWidth={1.75} />
						)}
					</div>
				</Link>
			),
			text: 'Profile'
		}
		// {
		// 	id: 3,
		// 	icon: (

		// 	),
		// 	text: 'more'
		// }
	];

	return (
		<>
			<header className='flex items-center justify-between px-10 py-5 sticky top-0 z-10 border-b border-gray-300 bg-white'>
				<Link to='/'>
					<h1 className='text-3xl font-medium text-orange-600'>
						Socionic
					</h1>
				</Link>
				<nav className='flex items-center ml-14'>
					<ul className='flex items-center justify-center gap-10'>
						{centerNavMenuItems.map((menuItem) => (
							<li
								key={menuItem.id}
								className='hover:scale-110 ease-in-out duration-200'>
								<button
									type='button'
									title={menuItem.text}
									onClick={() =>
										handleNavMenu(
											menuItem.text.toLowerCase()
										)
									}>
									{menuItem.icon}
								</button>
							</li>
						))}
					</ul>
				</nav>
				<nav>
					<ul className='flex items-center justify-center gap-8'>
						{rightNavMenuItems.map((menuItem) => (
							<li
								key={menuItem.id}
								className='hover:scale-110 ease-in-out duration-200'>
								<button
									type='button'
									title={menuItem.text}
									onClick={() =>
										handleNavMenu(
											menuItem.text.toLowerCase()
										)
									}>
									{menuItem.icon}
								</button>
							</li>
						))}
						<li>
							<button
								ref={menuButtonRef}
								onClick={() => setOpen((open) => !open)}
								className='relative cursor-pointer hover:scale-110 ease-in-out duration-200'>
								<EllipsisVertical
									size={22}
									strokeWidth={1.75}
								/>
							</button>
							<div
								ref={dropdownRef}
								className={`${
									open ? 'visible' : 'hidden'
								} absolute top-20 right-5 w-60 bg-gray-100 rounded-lg hover:none z-20`}>
								<ul>
									<li className='p-2 cursor-pointer'>
										<div className='flex items-center justify-start gap-3 px-7 py-4 hover:bg-gray-200 rounded-md ease-out duration-200'>
											<LightThemeSun />
											<p>Switch Appearance</p>
										</div>
									</li>
									<li
										onClick={handleLogout}
										className='p-2 cursor-pointer text-red-600'>
										<div className='flex items-center justify-start gap-3 px-7 py-4 hover:bg-gray-200 rounded-md ease-out duration-200'>
											<p>Logout</p>
										</div>
									</li>
								</ul>
							</div>
						</li>
					</ul>
				</nav>
			</header>
			<CreatePostDialog
				ref={createPostDialogRef}
				toggleDialog={toggleCreatePostDialog}
			/>
			<SearchDialog
				ref={searchDialogRef}
				toggleDialog={toggleSearchDialog}
			/>
			<NotificationDialog
				ref={notificationDialogRef}
				toggleDialog={toggleNotificationDialog}
			/>
		</>
	);
};

export default Navbar;
