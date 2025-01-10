import sharp from 'sharp';
import cloudinary from '../utils/cloudinary.js';
import { Post } from '../models/post.model.js';
import { User } from '../models/user.model.js';
import { Comment } from '../models/comment.model.js';

export const addNewPost = async (req, res) => {
	try {
		// Get data from frontend (form)
		console.log(req.id);
		const userId = req.id;
		const image = req.files.media;
		const caption = req.body.caption;

		// Image validation
		if (!image || image.length === 0) {
			return res.status(400).json({ message: 'Image is required !' });
		}

		// Image optimisation
		const imageOptimisationBuffer = await sharp(image[0].buffer) // Get the first image file
			.resize({ width: 800, height: 800, fit: 'inside' })
			.toFormat('jpeg', { quality: 80 })
			.toBuffer();

		// Image buffer to data uri
		const fileUri = `data:image/jpeg;base64,${imageOptimisationBuffer.toString(
			'base64'
		)}`;

		// Image upload
		const cloudResponse = await cloudinary.uploader.upload(fileUri);

		// Create post
		const post = await Post.create({
			caption,
			media: cloudResponse.secure_url,
			postCreator: userId
		});

		// Validate and push the post into user's array of posts
		const user = await User.findById(userId);
		console.log('user: ', user);
		if (!user) {
			console.log('USER NOT FOUND !');
		} else {
			user.postsList.push(post._id);
			await user.save();
		}

		// populate the new created post in the respective creator of the post (postCreator field in Post model) and send success message
		await post.populate({ path: 'postCreator', select: '-password' });
		return res.status(200).json({
			message: 'New Post Added !',
			post,
			success: true
		});
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ message: 'Internal Server Error', success: false });
	}
};

// Main feed
export const getAllPosts = async (req, res) => {
	try {
		const posts = await Post.find()
			.sort({ createdAt: -1 })
			.populate({
				path: 'postCreator',
				select: 'username profileImage'
			})
			.populate({
				path: 'commentsList',
				sort: { createdAt: -1 },
				populate: {
					path: 'commenter',
					select: 'username profileImage'
				}
			});
		return res.status(200).json({
			posts,
			success: true
		});
	} catch (error) {
		console.log(error);
	}
};

// Get all the posts but only from the users that we follow
export const getPostsByFollowing = async (req, res) => {
	try {
		const userId = req.id;

		// Find the user to get their following list
		const user = await User.findById(userId).select('followingList');

		if (!user) {
			return res.status(404).json({
				success: false,
				message: 'User not found'
			});
		}

		// Get posts only from users the current user is following
		const posts = await Post.find({
			postCreator: { $in: user.followingList }
		})
			.sort({ createdAt: -1 })
			.populate({
				path: 'postCreator',
				select: 'username profileImage'
			})
			.populate({
				path: 'commentsList',
				options: { sort: { createdAt: -1 } },
				populate: {
					path: 'postCreator',
					select: 'username profileImage'
				}
			});

		return res.status(200).json({
			posts,
			success: true
		});
	} catch (error) {
		console.error('Error fetching posts:', error);
		return res.status(500).json({
			success: false,
			message: 'Server error. Please try again later.'
		});
	}
};

// All posts of the logged in user
export const getAllUserPosts = async (req, res) => {
	try {
		const userId = req.id;
		const posts = await Post.find({ postCreator: userId })
			.sort({ createdAt: -1 })
			.populate({
				path: 'postCreator',
				select: 'username profilePicture'
			})
			.populate({
				path: 'comments',
				sort: { createdAt: -1 },
				populate: {
					path: 'userId',
					select: 'username profilePicture'
				}
			});
		res.status(200).json({
			posts,
			success: true
		});
	} catch (error) {
		console.log(error);
	}
};

// Like Feature
export const likePost = async (req, res) => {
	const userWhosLiking = req.id; // logged in user who is liking the post
	const postId = req.params.id; //the post which is being liked
	const post = await Post.findById(postId); //finding the post in DB
	// Post Validation
	if (!post)
		return res.status(404).json({
			message: 'Post Not Found !',
			success: false
		});

	// Like Logic
	await post.updateOne({ $addToSet: { likesList: userWhosLiking } });
	await post.save();

	// Implement Socket.io for real time notification

	return res.status(200).json({ message: 'Post Liked !', success: true });
};

// Dislike feature
export const dislikePost = async (req, res) => {
	const userWhosLiking = req.id; // logged in user who is liking the post
	const postId = req.params.id; //the post which is being liked
	const post = await Post.findById(postId); //finding the post in DB
	// Post Validation
	if (!post)
		return res.status(404).json({
			message: 'Post Not Found !',
			success: false
		});

	// Like Logic
	await post.updateOne({ $pull: { likesList: userWhosLiking } });
	await post.save();

	// Implement Socket.io for real time notification

	return res.status(200).json({ message: 'Post Disliked !', success: true });
};

// Comment feature
export const addComment = async (req, res) => {
	try {
		const postId = req.params.id;
		const userWhosCommenting = req.id;
		const { text } = req.body;
		console.log(text);

		const post = await Post.findById(postId);

		if (!text)
			return res.status(400).json({
				message: 'Text Is Required !',
				success: false
			});

		const comment = await Comment.create({
			text,
			commenter: userWhosCommenting,
			postBeenCommentedOn: postId
		});

		await comment.populate({
			path: 'commenter',
			select: 'username profilePicture'
		});

		post.commentsList.push(comment._id);
		await post.save();

		return res.status(201).json({
			message: 'Comment Added !',
			comment,
			success: true
		});
	} catch (error) {
		console.log(error);
	}
};

// Get comments of a particular post
export const commentsOfAPost = async (req, res) => {
	try {
		const postId = req.params.id;
		const comments = await Comment.find({ post: postId }).populate(
			'commenter',
			'username profilePicture'
		);

		if (!comments)
			return res.status(404).json({
				message: 'No Comments Not Found For This post !',
				success: false
			});
		return res.status(200).json({ comments, success: true });
	} catch (error) {
		console.log(error);
	}
};

export const deletePost = async (req, res) => {
	try {
		const postId = req.params.id;
		const userId = req.id;

		const post = await Post.findById(postId);

		if (!post)
			return res.status(404).json({
				message: 'Post Not Found !',
				success: false
			});

		//Check if the post belongs to the logged in user
		if (post.postCreator.toString() !== userId)
			return res
				.status(403)
				.json({ message: 'Unauthorized !', success: false });

		//Delete post
		await Post.findByIdAndDelete(postId);

		//Remove post from user collection too
		let user = await User.findById(userId);
		user.posts = user.posts.filter((id) => id.toString() !== postId);
		await user.save();

		//Delete all comments associated with the post
		await Comment.deleteMany({ post: postId });

		return res
			.status(200)
			.json({ message: 'Post Deleted !', success: true });
	} catch (error) {
		console.log(error);
	}
};

export const savePost = async (req, res) => {
	try {
		const postId = req.params.id;
		const userId = req.id;
		const post = await Post.findById(postId);
		if (!post)
			return res.status(404).json({
				message: 'Post Not Found !',
				success: false
			});

		const user = await User.findById(userId);
		if (user.savedPostsList.includes(post._id)) {
			// Already saved > remove it then
			await user.updateOne({ $pull: { savedPostsList: post._id } });
			await user.save();
			return res.status(200).json({
				type: 'unsaved',
				message: 'Post Unsaved !',
				success: true
			});
		} else {
			//save post in bookmark
			await user.updateOne({ $addToSet: { savedPostsList: post._id } });
			await user.save();
			return res.status(200).json({
				type: 'saved',
				message: 'Post Saved !',
				success: true
			});
		}
	} catch (error) {
		console.log(error);
	}
};
