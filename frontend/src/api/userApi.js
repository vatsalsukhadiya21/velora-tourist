import api from './axiosInstance';

export const getUserById = (id) =>
  api.get(`/api/users/${id}`);

export const getCurrentUser = () =>
  api.get('/api/users/me');

export const updateProfile = (formData) =>
  api.put('/api/users/me', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const getUserPosts = (userId, page = 0, size = 12) =>
  api.get(`/api/posts/user/${userId}`, { params: { page, size } });
