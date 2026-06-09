/**
 * posts.js – Post-related API calls
 *
 * Actual backend routes (from postRoutes.js):
 *   GET  /api/posts/feed             → Fetch all posts
 *   POST /api/posts/create-posts     → Create post (multipart/form-data: caption, image file)
 *   PUT  /api/posts/:id/like         → Toggle like
 *   POST /api/posts/:id/comments     → Add a comment { text: string }
 *
 * Actual Post schema fields:
 *   { _id, caption, imageUrl, user: { _id, username },
 *     likes: [ObjectId],  comments: [{ user: { _id, username }, text }], createdAt }
 */
import api from './axiosConfig';

/**
 * Fetch all posts (newest first).
 * Backend: GET /api/posts/feed
 */
export const fetchPosts = () => api.get('/api/posts/feed');

/**
 * Create a new post.
 * Backend expects multipart/form-data with fields: caption (text), image (file).
 * We send FormData so the multer upload middleware can handle it.
 *
 * @param {{ caption?: string, imageFile?: File }} data
 */
export const createPost = ({ caption, imageFile }) => {
  const formData = new FormData();
  if (caption)   formData.append('caption', caption);
  if (imageFile) formData.append('image', imageFile);

  return api.post('/api/posts/create-posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

/**
 * Toggle like on a post.
 * Backend: PUT /api/posts/:id/like
 * @param {string} postId
 */
export const likePost = (postId) => api.put(`/api/posts/${postId}/like`);

/**
 * Add a comment to a post.
 * Backend: POST /api/posts/:id/comments
 * @param {string} postId
 * @param {{ text: string }} data
 */
export const addComment = (postId, data) =>
  api.post(`/api/posts/${postId}/comments`, data);
