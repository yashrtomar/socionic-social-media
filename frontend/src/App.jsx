import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Homepage from './views/Homepage';
import Layout from './components/Layout';
import SignUp from './views/SignUp';
import ProfilePage from './views/ProfilePage';
import Search from './views/Search';
import Chats from './views/Chats';
import Login from './views/Login';
import EditProfile from './views/EditProfile';

const routes = createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
		children: [
			{ path: '/', element: <Homepage /> },
			{ path: '/profile/:id', element: <ProfilePage /> },
			{ path: '/profile/edit', element: <EditProfile /> },
			{ path: '/chats', element: <Chats /> },
			{ path: './search', element: <Search /> }
		]
	},
	{
		path: '/login',
		element: <Login />
	},
	{
		path: '/signup',
		element: <SignUp />
	}
]);

function App() {
	return (
		<>
			<RouterProvider router={routes} />
		</>
	);
}

export default App;
