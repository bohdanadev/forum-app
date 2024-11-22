import { createBrowserRouter, Navigate } from 'react-router-dom';

import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import Profile from './pages/Profile';
import Post from './pages/Post';
import ErrorPage from './pages/ErrorPage';
import FeedLayout from './layouts/FeedLayout';

const router = createBrowserRouter(
  [
    {
      path: '',
      element: <MainLayout />,
      errorElement: <ErrorPage />,
      children: [
        { path: 'signin', element: <SignIn /> },
        { path: 'signup', element: <SignUp /> },

        {
          path: '',
          element: <FeedLayout />,
          children: [
            { index: true, element: <Navigate to={'posts'} /> },
            { path: 'posts', element: <HomePage /> },
            { path: 'users/:id', element: <Profile /> },
            { path: 'posts/:id', element: <Post /> },
          ],
        },
      ],
    },
  ],

  {
    future: {
      v7_relativeSplatPath: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_fetcherPersist: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);

export { router };
