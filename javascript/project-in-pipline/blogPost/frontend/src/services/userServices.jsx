import api from './api'; // Assuming you have an API service set up

const userServices = {
  /**
   * Get multiple users by their IDs
   * @param {Array<string>} userIds - Array of user IDs to fetch
   * @returns {Promise<Array>} - Array of user objects
   */
  getUsersByIds: async (userIds) => {
    try {
      const response = await api.post('/users/by-ids', { userIds });
      return response.data;
    } catch (error) {
      console.error('Error fetching users by IDs:', error);
      throw error;
    }
  },

  /**
   * Get a single user by ID
   * @param {string} userId - The user ID to fetch
   * @returns {Promise<Object>} - User object
   */
  getUserById: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }
  },

  /**
   * Get current authenticated user's profile
   * @returns {Promise<Object>} - User object
   */
  getProfile: async () => {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  /**
   * Update user profile
   * @param {string} userId - The user ID to update
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} - Updated user object
   */
  updateUser: async (userId, updateData) => {
    try {
      const response = await api.patch(`/users/${userId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  /**
   * Search users by name or email
   * @param {string} query - Search term
   * @returns {Promise<Array>} - Array of matching users
   */
  searchUsers: async (query) => {
    try {
      const response = await api.get('/users/search', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }
};

export default userServices;