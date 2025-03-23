import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

const login = (credentials: any) => {
  return axios.post(`${API_URL}/login`, credentials, {
    headers: { 'Content-Type': 'application/json' }
  });
};

export const register = (userData: any) => {
  return axios.post(`${API_URL}/register`, userData);
};

export default {
  login,
  register,
};