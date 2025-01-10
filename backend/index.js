import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import express, { urlencoded } from 'express';
import connectDb from './utils/db.js';
import userRoute from './routes/user.routes.js';
import postRoute from './routes/post.routes.js';

// to use variables from .env file
dotenv.config({});

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// Routes
app.use('/api/user/', userRoute);
app.use('/api/post/', postRoute);

// Listen on port and connect to MongoDB
app.listen(PORT, () => {
	connectDb();
	console.log('server listening at port: ', PORT);
});
