import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Your Express URL
  withCredentials: true, // CRITICAL: This sends the httpOnly cookie back and forth
});

export default api;