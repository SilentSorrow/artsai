import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
  validateStatus: (status) => status >= 200 && status < 500,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('app-auth');
   if (token) {
   config.headers['app-auth'] = token;
  }
  
  return config
});

//users
export const signUp = async (signUpData) => {
  return await api.post('users/', signUpData);
};

export const getUser = async (username) => {
  return await api.get('/users/' + username);
}

//auth
export const login = async (loginData) => {
  return await api.post('auth/login', loginData);
};

export const sendCode = async () => {
  return await api.get('auth/send-code');
};

export const verifyCode = async (code) => {
  return await api.put('auth/verify-code/' + code);
};

//art

//media

//images
