// API service for SafeNest backend integration
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to include auth token in requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// API Health check
export const checkAPIHealth = async () => {
  try {
    // Use a simple timeout to avoid long waits
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    await api.get('/auth/me', {
      signal: controller.signal,
      validateStatus: () => true // Accept any response status
    });
    
    clearTimeout(timeoutId);
    return true;
  } catch (error) {
    console.error("API health check failed:", error);
    return false;
  }
};

// Auth services
export const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error: any) {
      // Handle network errors
      if (!error.response) {
        throw new Error('Network error: Unable to connect to the server');
      }
      // Pass through the API error
      throw error;
    }
  },
  
  register: async (userData: any) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error: any) {
      // Handle network errors or format error response
      if (!error.response) {
        throw new Error('Network error: Unable to connect to the server');
      }
      // Pass through the API error
      throw error;
    }
  },
  
  logout: async () => {
    try {
      // Call logout endpoint to properly invalidate token on server
      await api.post('/auth/logout');
    } catch (error) {
      console.error("Logout error:", error);
      // Continue with local logout even if server call fails
    } finally {
      // Remove local storage items
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  },
  
  getCurrentUser: () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }
};

// User services
export const userService = {
  getProfile: async () => {
    return api.get('/users/profile');
  },
  
  updateProfile: async (profileData: any) => {
    return api.put('/users/profile', profileData);
  },
  
  getEmergencyContacts: async () => {
    return api.get('/users/emergency-contacts');
  },
  
  addEmergencyContact: async (contactData: any) => {
    return api.post('/users/emergency-contacts', contactData);
  },
  
  updateEmergencyContact: async (contactId: number, contactData: any) => {
    return api.put(`/users/emergency-contacts/${contactId}`, contactData);
  },
  
  deleteEmergencyContact: async (contactId: number) => {
    return api.delete(`/users/emergency-contacts/${contactId}`);
  }
};

// Alert services
export const alertService = {
  createSOS: async (alertData: any) => {
    return api.post('/alerts/sos', alertData);
  },
  
  getAlertHistory: async () => {
    return api.get('/alerts/history');
  },
  
  cancelAlert: async (alertId: number) => {
    return api.post(`/alerts/${alertId}/cancel`);
  }
};

// Import sample data for fallback
import { samplePosts, sampleResources } from '@/lib/sample-data';

// Community services
export const communityService = {
  // Check if the API is available
  checkAPIConnection: async () => {
    try {
      // Use a simple timeout to avoid long waits
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await api.get('/community/posts?page=1&limit=1', {
        signal: controller.signal,
        validateStatus: () => true // Accept any response status
      });
      
      clearTimeout(timeoutId);
      // Consider successful if we get any response
      return response.status < 500;
    } catch (error) {
      console.error("Community API health check failed:", error);
      return false;
    }
  },

  getPosts: async (page = 1, limit = 10, category?: string) => {
    try {
      // First check if the API is available
      const apiAvailable = await communityService.checkAPIConnection();
      if (!apiAvailable) {
        console.log("API unavailable, using sample posts data");
        return { data: samplePosts };
      }
      
      let url = `/community/posts?page=${page}&limit=${limit}`;
      if (category) {
        url += `&category=${category}`;
      }
      console.log("Fetching posts with URL:", url);
      const response = await api.get(url);
      console.log("Raw posts response:", response);
      
      // If posts are wrapped in an object with 'posts' property, unwrap them
      if (response.data && !Array.isArray(response.data) && response.data.posts) {
        // Return the posts directly
        return { data: response.data.posts };
      }
      
      return response;
    } catch (error: any) {
      console.error("Error fetching posts:", error);
      // Use sample data as fallback
      console.log("Error occurred, using sample posts data");
      return { data: samplePosts };
    }
  },
  
  getPost: async (postId: number) => {
    try {
      console.log("Fetching post with ID:", postId);
      return await api.get(`/community/posts/${postId}`);
    } catch (error: any) {
      console.error(`Error fetching post ${postId}:`, error);
      throw error;
    }
  },
  
  createPost: async (postData: any) => {
    try {
      // First check if the API is available
      const apiAvailable = await communityService.checkAPIConnection();
      if (!apiAvailable) {
        console.log("API unavailable, simulating post creation");
        
        // Create a new post object with our data
        const newPost = {
          id: Math.floor(Math.random() * 10000),
          title: postData.title || "",
          content: postData.content,
          author: "You",
          authorInitials: "YOU",
          time: "Just now",
          likes: 0,
          comments: 0,
          shares: 0,
          created_at: new Date().toISOString(),
          user_id: 1  // Arbitrary user ID since we're offline
        };
        
        // Return a simulated response
        return { 
          data: newPost,
          status: 201,
          statusText: "Created (Simulated)"
        };
      }
      
      console.log("Creating post with data:", postData);
      const response = await api.post('/community/posts', postData);
      console.log("Create post response:", response);
      return response;
    } catch (error: any) {
      console.error("Error creating post:", error);
      // Check for auth issues
      if (error.response && error.response.status === 401) {
        // Special handling for auth issues
        console.error("Authentication error when creating post");
        throw error;
      }
      
      // For other errors, simulate post creation
      console.log("Error occurred, simulating post creation");
      return { 
        data: {
          id: Math.floor(Math.random() * 10000),
          title: postData.title || "",
          content: postData.content,
          author: "You", 
          time: "Just now",
          likes: 0,
          comments: 0,
          shares: 0
        },
        status: 201,
        statusText: "Created (Simulated)"
      };
    }
  },
  
  addComment: async (postId: number, commentData: any) => {
    try {
      // First check if the API is available
      const apiAvailable = await communityService.checkAPIConnection();
      if (!apiAvailable) {
        console.log("API unavailable, simulating comment creation");
        
        // Create a new comment object with our data
        const newComment = {
          id: Math.floor(Math.random() * 10000),
          content: commentData.content,
          post_id: postId,
          author: "You",
          created_at: new Date().toISOString()
        };
        
        // Return a simulated response
        return { 
          data: newComment,
          status: 201,
          statusText: "Created (Simulated)"
        };
      }
      
      console.log(`Adding comment to post ${postId} with data:`, commentData);
      const response = await api.post(`/community/posts/${postId}/comments`, commentData);
      console.log("Add comment response:", response);
      return response;
    } catch (error: any) {
      console.error(`Error adding comment to post ${postId}:`, error);
      
      // For errors, simulate comment creation
      console.log("Error occurred, simulating comment creation");
      return { 
        data: {
          id: Math.floor(Math.random() * 10000),
          content: commentData.content,
          post_id: postId,
          author: "You",
          created_at: new Date().toISOString()
        },
        status: 201,
        statusText: "Created (Simulated)"
      };
    }
  },
  
  getResources: async () => {
    try {
      // First check if the API is available
      const apiAvailable = await communityService.checkAPIConnection();
      if (!apiAvailable) {
        console.log("API unavailable, using sample resources data");
        return { data: sampleResources };
      }
      
      console.log("Fetching community resources");
      const response = await api.get('/community/resources');
      return response;
    } catch (error: any) {
      console.error("Error fetching resources:", error);
      // Use sample data as fallback
      console.log("Error occurred, using sample resources data");
      return { data: sampleResources };
    }
  }
};

// Classes services
export const classesService = {
  getClasses: async (type?: string, level?: string) => {
    let url = '/classes/';
    if (type || level) {
      url += '?';
      if (type) url += `type=${type}&`;
      if (level) url += `level=${level}`;
    }
    return api.get(url);
  },
  
  getClassDetails: async (classId: number) => {
    return api.get(`/classes/${classId}`);
  },
  
  registerForClass: async (classId: number) => {
    return api.post(`/classes/${classId}/register`);
  },
  
  getUserRegistrations: async () => {
    return api.get('/classes/user/registrations');
  },
  
  getInstructors: async () => {
    return api.get('/classes/instructors');
  }
};

export default api;
