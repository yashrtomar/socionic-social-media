import React, { forwardRef, useState } from 'react';
// import SearchIcon from '../icons/search-icon/SearchIcon';
import { Search } from 'lucide-react';

const SearchDialog = forwardRef(({ toggleDialog }, ref) => {
	const [searchInput, setSearchInput] = useState('');

	return (
		<dialog
			ref={ref}
			onClick={(e) => {
				if (e.currentTarget === e.target) toggleDialog();
			}}
			className='h-[70%] w-3/5 outline-none'>
			<div className='size-full flex items-center justify-center'>
				<div className='h-10 w-3/5 border-b border-gray-300 focus-within:border-orange-600 ease-in-out duration-200 flex items-center justify-between mb-10'>
					<label htmlFor='search' hidden>
						Search
					</label>
					<input
						type='text'
						id='search'
						name='search'
						placeholder='search'
						autoComplete='off'
						value={searchInput}
						onChange={(e) => setSearchInput(e.target.value)}
						className='size-full p-3 outline-none text-lg'
					/>
					<button type='button' className='px-3'>
						<Search size={24} strokeWidth={1.75} />
					</button>
				</div>
			</div>
		</dialog>
	);
});

export default SearchDialog;
