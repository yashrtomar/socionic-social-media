import mongoose from 'mongoose';

const messageSchema = mongoose.Schema(
	{
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: [true, 'sender info is required !']
		},
		reciever: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: [true, 'reciever info is required !']
		},
		message: { type: String, required: [true, 'message is required !'] }
	},
	{ timestamps: true }
);

export const Message = mongoose.model('Message', messageSchema);
