import mongoose from 'mongoose';

const chatSchema = mongoose.Schema(
	{
		participants: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
				required: [true, 'Participants are required !']
			}
		],
		messages: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Message',
				required: [true, 'Messages are required !']
			}
		]
	},
	{ timestamps: true }
);

export const Chat = mongoose.model('Chat', chatSchema);
