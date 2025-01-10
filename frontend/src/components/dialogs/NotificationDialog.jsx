import React, { forwardRef } from 'react';

const NotificationDialog = forwardRef(({ toggleDialog }, ref) => {
	return (
		<dialog
			ref={ref}
			onClick={(e) => {
				if (e.currentTarget === e.target) toggleDialog();
			}}
			className='h-[70%] w-3/5 outline-none'>
			<div className='size-full flex items-center justify-center'>
				<div className='w-full flex items-center justify-center'>
					<p className='text-gray-400 text-lg'>
						No Notifications for now...
					</p>
				</div>
			</div>
		</dialog>
	);
});

export default NotificationDialog;
