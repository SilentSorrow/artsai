import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
  headers: { 'app-auth': localStorage.getItem('app-auth') },
  validateStatus: (status) => status >= 200 && status < 500,
});

//users
export const signUp = async (signUpData) => {
  return await api.post('users/', signUpData);
};

//auth
export const login = async (loginData) => {
  return await api.post('auth/login', loginData);
};

//art

//media

//images
