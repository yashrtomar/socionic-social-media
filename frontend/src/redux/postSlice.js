import { createSlice } from '@reduxjs/toolkit';

const postSlice = createSlice({
	name: 'postSlice',
	initialState: {
		posts: []
	},
	reducers: {
		setPosts: (state, action) => {
			state.posts = action.payload;
		}
	}
});

export const { setPosts } = postSlice.actions;
export default postSlice.reducer;
