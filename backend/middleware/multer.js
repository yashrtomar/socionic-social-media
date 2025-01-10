import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() }).fields([
	{ name: 'media', maxCount: 1 },
	{ name: 'profileImage', maxCount: 1 }
]);

export default upload;
