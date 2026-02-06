// Client/src/api/axios.js
import axios from 'axios';

// Ensure API URL ends with /api
const getApiUrl = () => {
  const url = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  // If URL doesn't end with /api, add it
  return url.endsWith('/api') ? url : url.endsWith('/') ? `${url}api` : `${url}/api`;
};

const api = axios.create({
  baseURL: getApiUrl()
});

export default api;
