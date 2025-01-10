import express from 'express';
import protectRoutes from '../middleware/authMiddleware.js';
import {
	followUnfollow,
	getUserProfile,
	login,
	logout,
	signUp,
	updateUserProfile
} from '../controllers/user.controller.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.route('/signup').post(signUp);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/:id/profile').get(protectRoutes, getUserProfile);
router.route('/profile/update').post(protectRoutes, upload, updateUserProfile);
router.route('/follow-unfollow/:id').post(protectRoutes, followUnfollow);
export default router;
