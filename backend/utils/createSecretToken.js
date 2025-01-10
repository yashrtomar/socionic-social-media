import jwt from 'jsonwebtoken';

export const createSecretToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
		expiresIn: 1 * 24 * 60 * 60
	});
};
