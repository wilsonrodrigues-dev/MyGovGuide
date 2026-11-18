import axios from 'axios';
export const adminApi = axios.create({ baseURL: '/api/admin', withCredentials: true, timeout: 15000 });
export const errorText = error => error.response?.data?.error?.message || 'The request could not be completed. Check the backend connection and try again.';
