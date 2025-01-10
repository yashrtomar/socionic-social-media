import express from 'express';
import protectRoutes from '../middleware/authMiddleware.js';
import upload from '../middleware/multer.js';
import {
	addNewPost,
	getAllPosts,
	getAllUserPosts,
	likePost,
	dislikePost,
	addComment,
	commentsOfAPost,
	deletePost,
	savePost
} from '../controllers/post.controller.js';

const router = express.Router();

router.route('/add-post').post(protectRoutes, upload, addNewPost);
router.route('/all-posts').get(protectRoutes, getAllPosts);
router.route('/user/all-posts').get(protectRoutes, getAllUserPosts);
router.route('/:id/like').get(protectRoutes, likePost);
router.route('/:id/dislike').get(protectRoutes, dislikePost);
router.route('/:id/comment').post(protectRoutes, addComment);
router.route('/:id/all-post-comments').get(protectRoutes, commentsOfAPost);
router.route('/delete-post/:id').delete(protectRoutes, deletePost);
router.route('/:id/save').post(protectRoutes, savePost);

export default router;
