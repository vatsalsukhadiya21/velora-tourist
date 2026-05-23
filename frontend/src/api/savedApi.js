import api from './axiosInstance';

export const toggleSave = (postId) =>
  api.post(`/api/posts/${postId}/save`);

export const getSaveStatus = (postId) =>
  api.get(`/api/posts/${postId}/save/status`);

export const getSavedPosts = (page = 0, size = 12) =>
  api.get('/api/saved', { params: { page, size } });
