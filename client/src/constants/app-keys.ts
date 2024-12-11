export const API_KEYS = {
  SIGN_IN: '/auth/signin',
  SIGN_UP: '/auth/signup',
  USERS: '/users',
  POSTS: '/posts',
  LIKE: 'like',
  COMMENTS: 'comments',
  NOTIFICATIONS: 'notifications',
  READ: 'read',
  VERSION: import.meta.env.VITE_API_VERSION,
};

export const QUERY_KEYS = {
  ALL: 'all',
  POSTS: 'posts',
  POST: 'post',
  USER: 'user',
  COMMENTS: 'comments',
  LIKES: 'likes',
  NOTIFICATIONS: 'notifications',
};

export const ROUTER_KEYS = {
  SIGNUP: 'signup',
  SIGNIN: 'signin',
  HOME: '/',
  USERS: '/users',
  POSTS: 'posts',
  NOTIFICATIONS: 'notifications',
  LIKE: 'like',
  AUTHOR_ID: 'authorId',
  TAG: 'tag',
};
