import { User } from '../models/user.model.js';
import { createSecretToken } from '../utils/createSecretToken.js';
import bcrypt from 'bcryptjs';
import getDataUri from '../utils/dataUri.js';
import cloudinary from '../utils/cloudinary.js';

// New user signup
export const signUp = async (req, res, next) => {
	try {
		// recieve data from request body
		const { username, email, password } = req.body;

		// Input Validation
		if (!username || !email || !password) {
			return res.status(400).json({
				message: 'All fields are required !',
				success: false
			});
		}

		// Check for existing user (using email)
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(403).json({
				message:
					'User with this email already exists, try another email !',
				success: false
			});
		}

		// Check for existing username
		const existingUsername = await User.findOne({ username });
		if (existingUsername) {
			return res.status(403).json({
				message: `The username '${username}' is already taken, Please try another one !`
			});
		}

		// Hash password for security
		const hashedPassword = await bcrypt.hash(password, 12);

		// Create new user in Database
		const user = await User.create({
			username,
			email,
			password: hashedPassword
		});

		// Generate cookie and send it to the client (browser)
		const token = createSecretToken(user._id);
		res.cookie('token', token, { withCredentials: true, httpOnly: false });

		// All done, send success message as a response
		res.status(201).json({
			message: 'User created successfully',
			success: true,
			user
		});
		next();
	} catch (error) {
		console.log(error);
	}
};

// User login
export const login = async (req, res, next) => {
	try {
		// recieve data from request body
		const { usernameOrEmail, password } = req.body;

		// Input Validation
		if (!usernameOrEmail || !password) {
			return res.status(403).json({
				message: 'All the fields are required !',
				success: true
			});
		}

		// Check if user exists in the database
		const user = await User.findOne({
			$or: [{ email: usernameOrEmail }, { username: usernameOrEmail }]
		});
		if (!user) {
			res.status(401).json({
				message: 'Incorrect email, username or password !',
				success: false
			});
		}

		// Matching password
		const passwordMatches = await bcrypt.compare(password, user.password);
		if (!passwordMatches) {
			res.status(401).json({
				message: 'Incorrect email, username or password !',
				success: false
			});
		}

		const loggedInUser = {
			_id: user._id,
			username: user.username,
			email: user.email,
			profileImage: user.profileImage,
			gender: user.gender,
			bio: user.bio,
			followersList: user.followersList,
			followingList: user.followingList,
			postsList: user.postsList,
			savedPostList: user.savedPostList
		};

		// create token and send it to the client along with a status, success message and user data
		const token = createSecretToken(user._id);
		return res
			.cookie('token', token, { withCredentials: true, httpOnly: false })
			.status(200)
			.json({
				message: `Welcome back ${user.username} !`,
				success: true,
				loggedInUser
			});
		next();
	} catch (error) {
		console.log(error);
	}
};

// User logout
export const logout = (_, res) => {
	try {
		// Just delete cookie
		return res.cookie('token', '', { maxAge: 0 }).json({
			message: 'User logged out successfully !',
			success: true
		});
	} catch (error) {
		console.log(error);
	}
};

// Get user profile
export const getUserProfile = async (req, res) => {
	try {
		const userId = req.params.id;
		// let user = User.findById(userId).select('-password');
		const user = await User.findById(userId)
			.select('-password')
			.lean()
			.populate('followersList', 'username profileImage') // You can specify which fields to populate
			.populate('followingList', 'username profileImage')
			.populate('postsList') // Populate posts if needed
			.populate('savedPostsList');
		return res.status(200).json({
			message: `Success: User found by the username ${user.username} !`,
			user,
			success: true
		});
	} catch (error) {
		console.log(error);
	}
};

// Edit profile feature
export const updateUserProfile = async (req, res) => {
	try {
		const userId = req.id;
		const { gender, bio } = req.body;
		const profileImage = req.files.profileImage[0];

		let cloudResponse;
		if (profileImage) {
			const fileUri = getDataUri(profileImage);
			cloudResponse = await cloudinary.uploader.upload(fileUri);
		}

		const user = await User.findById(userId);
		if (!user) {
			return res
				.status(404)
				.json({ message: 'User not found !', success: false });
		}
		if (bio) user.bio = bio;
		if (gender) user.gender = gender;
		if (profileImage) user.profileImage = cloudResponse.secure_url;

		await user.save();
		return res
			.status(200)
			.json({ message: 'Profile updated !', success: true, user });
	} catch (error) {
		console.log(error);
	}
};

// Users Following system
export const followUnfollow = async (req, res) => {
	try {
		const user = req.id; //me
		const userFollowedByMe = req.params.id; //the one I am following

		// User shouldn't follow self because it just doesn't make sense
		if (user === userFollowedByMe) {
			return res.status(200).json({
				message: 'Cannot Follow/Unfollow Self !',
				success: true
			});
		}

		// Check if followed or following user really exists
		const userMe = await User.findById(user);
		const targetUser = await User.findById(userFollowedByMe);
		if (!userMe || !targetUser) {
			return res.status(200).json({
				message: 'User Not Found !',
				success: true
			});
		}

		//Checking whether to follow or unfollow doing it accordingly and sucsess message
		const isFollowing = userMe.followersList.includes(userFollowedByMe);
		if (isFollowing) {
			//unfollow logic
			await Promise.all([
				User.updateOne(
					{ _id: user },
					{ $pull: { followingList: userFollowedByMe } }
				),
				User.updateOne(
					{ _id: userFollowedByMe },
					{ $pull: { followersList: user } }
				)
			]);
			return res.status(200).json({
				message: 'User Unfollowed !',
				success: true
			});
		} else {
			//follow logic
			await Promise.all([
				User.updateOne(
					{ _id: user },
					{ $push: { followingList: userFollowedByMe } }
				),
				User.updateOne(
					{ _id: userFollowedByMe },
					{ $push: { followersList: user } }
				)
			]);
			return res.status(200).json({
				message: 'User Followed !',
				success: true
			});
		}
	} catch (error) {
		console.log(error);
	}
};
