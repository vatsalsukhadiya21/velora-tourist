import api from './axiosInstance';

export const getComments = (postId, page = 0, size = 20) =>
  api.get(`/api/posts/${postId}/comments`, { params: { page, size } });

export const addComment = (postId, content) =>
  api.post(`/api/posts/${postId}/comments`, { content });

export const deleteComment = (commentId) =>
  api.delete(`/api/comments/${commentId}`);
