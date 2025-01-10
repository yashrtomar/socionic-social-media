import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
	{
		username: {
			type: String,
			required: [true, 'username is required !'],
			unique: true
		},
		email: {
			type: String,
			required: [true, 'email is required !'],
			unique: true
		},
		password: { type: String, required: [true, 'password is required !'] },
		profileImage: { type: String },
		gender: {
			type: String,
			enum: ['male', 'female', 'other']
		},
		bio: { type: String, default: '' },
		// list of the followers of the logged in user
		followersList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		// list of the people who the logged user follows
		followingList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		postsList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
		savedPostsList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
	},
	{ timeStamps: true }
);

export const User = mongoose.model('User', userSchema);
