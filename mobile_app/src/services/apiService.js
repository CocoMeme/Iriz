/**
 * API Service
 * Handles communication with backend API
 */

import axios from 'axios';
import { getAuthToken } from './authService';

// TODO: Update with actual backend URL
const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Create axios instance with auth headers
 */
const createAuthenticatedClient = async () => {
  const token = await getAuthToken();
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};

/**
 * Sync capture to backend
 * @param {Object} capture - Capture data
 */
export const syncCapture = async (capture) => {
  try {
    const client = await createAuthenticatedClient();
    const response = await client.post('/captures', capture);
    return response.data;
  } catch (error) {
    console.error('Sync capture error:', error);
    throw error;
  }
};

/**
 * Get user's captures from backend
 * @returns {Promise<Array>}
 */
export const fetchUserCaptures = async () => {
  try {
    const client = await createAuthenticatedClient();
    const response = await client.get('/captures');
    return response.data;
  } catch (error) {
    console.error('Fetch captures error:', error);
    throw error;
  }
};

/**
 * Delete capture from backend
 * @param {string} captureId - Capture ID
 */
export const deleteCapture = async (captureId) => {
  try {
    const client = await createAuthenticatedClient();
    await client.delete(`/captures/${captureId}`);
    return true;
  } catch (error) {
    console.error('Delete capture error:', error);
    throw error;
  }
};

/**
 * Update user profile
 * @param {Object} userData - User data to update
 */
export const updateUserProfile = async (userData) => {
  try {
    const client = await createAuthenticatedClient();
    const response = await client.put('/user/profile', userData);
    return response.data;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

/**
 * Check API health
 * @returns {Promise<boolean>}
 */
export const checkAPIHealth = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`);
    return response.status === 200;
  } catch (error) {
    console.error('API health check error:', error);
    return false;
  }
};
