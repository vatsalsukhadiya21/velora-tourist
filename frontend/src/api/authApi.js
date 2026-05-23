import api from './axiosInstance';

export const loginUser = (credentials) =>
  api.post('/api/auth/login', credentials);

export const registerUser = (userData) =>
  api.post('/api/auth/register', userData);

export const getCurrentUser = () =>
  api.get('/api/users/me');

export const updateProfile = (formData) =>
  api.put('/api/users/me', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const getUserById = (id) =>
  api.get(`/api/users/${id}`);
