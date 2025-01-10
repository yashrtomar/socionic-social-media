import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
	name: 'authSlice',
	initialState: {
		user: null,
		userProfile: null,
		selectedUser: null
	},
	reducers: {
		setAuthUser: (state, action) => {
			state.user = action.payload;
			localStorage.removeItem('persist:root');
		},
		setUserProfile: (state, action) => {
			state.userProfile = action.payload;
		},
		setSelectedUser: (state, action) => {
			state.selectedUser = action.payload;
		}
	}
});

export const { setAuthUser, setUserProfile, setSelectedUser } =
	authSlice.actions;
export default authSlice.reducer;
