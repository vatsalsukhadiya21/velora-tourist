import api from './axiosInstance';

export const toggleLike = (postId) =>
  api.post(`/api/posts/${postId}/like`);

export const getLikeStatus = (postId) =>
  api.get(`/api/posts/${postId}/like/status`);
