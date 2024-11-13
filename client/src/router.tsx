import { createBrowserRouter, Navigate } from 'react-router-dom';

import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import Profile from './pages/Profile';
import Post from './pages/Post';

const router = createBrowserRouter([
  {
    path: '',
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to={'posts'} /> },
      { path: 'posts', element: <HomePage /> },
      { path: 'signin', element: <SignIn /> },
      { path: 'signup', element: <SignUp /> },
      { path: 'profile', element: <Profile /> },
      { path: 'post', element: <Post /> },
    ],
  },
]);

export { router };
