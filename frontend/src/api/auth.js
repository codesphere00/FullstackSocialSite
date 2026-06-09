/**
 * auth.js – Authentication API calls
 *
 * Backend endpoints:
 *   POST /api/auth/register  →  { username, email, password }
 *   POST /api/auth/login     →  { email, password }
 *
 * Actual response shape from backend (flat, no "user" wrapper):
 *   { _id, username, email, token }
 */
import api from './axiosConfig';

/**
 * Sign up a new user.
 * @param {{ username: string, email: string, password: string }} data
 */
export const signupUser = (data) => api.post('/api/auth/register', data);

/**
 * Log in an existing user.
 * @param {{ email: string, password: string }} data
 */
export const loginUser = (data) => api.post('/api/auth/login', data);
