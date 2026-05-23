import api from './axiosInstance';

export const getAllPosts = (page = 0, size = 12, sort = 'createdAt,desc') =>
  api.get('/api/posts', { params: { page, size, sort } });

export const getPostById = (id) =>
  api.get(`/api/posts/${id}`);

export const createPost = (postData, images) => {
  const formData = new FormData();
  formData.append('post', new Blob([JSON.stringify(postData)], { type: 'application/json' }));
  images.forEach((image) => formData.append('images', image));
  return api.post('/api/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const updatePost = (id, postData) =>
  api.put(`/api/posts/${id}`, postData);

export const deletePost = (id) =>
  api.delete(`/api/posts/${id}`);

export const getTrendingPosts = (page = 0, size = 6) =>
  api.get('/api/posts/trending', { params: { page, size } });

export const getPostsByUser = (userId, page = 0, size = 12) =>
  api.get(`/api/posts/user/${userId}`, { params: { page, size } });

export const searchPosts = ({ q, country, categoryId, page = 0, size = 12 } = {}) =>
  api.get('/api/posts/search', {
    params: { q, country, categoryId, page, size },
  });

export const getCategories = () =>
  api.get('/api/categories');
