import axios from 'axios';
export const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || '/api', withCredentials: true, timeout: 8000 });
export async function bootstrap() { return (await api.post('/session', {})).data; }
export async function persistProfile(profile) {
  try { return (await api.put('/profile', profile)).data; }
  catch (error) {
    if (error.response?.status === 401) {
      await bootstrap(); return (await api.put('/profile', profile)).data;
    }
    throw error;
  }
}
