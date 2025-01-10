import mongoose from 'mongoose';

const postSchema = mongoose.Schema(
	{
		media: { type: String, required: [true, 'Media is required !'] },
		caption: { type: String, default: '' },
		postCreator: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: [true, 'User info of this post is required !']
		},
		likesList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		commentsList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
	},
	{ timestamps: true }
);

export const Post = mongoose.model('Post', postSchema);
