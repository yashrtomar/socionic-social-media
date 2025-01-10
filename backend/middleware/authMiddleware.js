import jwt from 'jsonwebtoken';

const protectRoutes = async (req, res, next) => {
	try {
		const token = req.cookies.token;
		if (!token) {
			return res.status(401).json({
				message: 'User Is Not Authenticated !',
				success: false
			});
		}

		const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY);

		if (!decode) {
			return res.status(401).json({
				message: 'Invalid Token !',
				success: false
			});
		}

		req.id = decode.id;
		next();
	} catch (error) {
		console.log(error);
	}
};

export default protectRoutes;
