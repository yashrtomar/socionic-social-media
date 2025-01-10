import mongoose from 'mongoose';

const commentSchema = mongoose.Schema(
	{
		text: { type: String, required: true },
		commenter: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: [true, 'Commenter username is required !']
		},
		postBeenCommentedOn: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Post',
			required: [true, 'Post that is been commented on is required !']
		}
	},
	{ timestamps: true }
);

export const Comment = mongoose.model('Comment', commentSchema);
