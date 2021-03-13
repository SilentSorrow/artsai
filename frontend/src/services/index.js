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

  return config;
});

//users
export const signUp = async (signUpData) => {
  return await api.post('users/', signUpData);
};

export const getUser = async (username) => {
  return await api.get('users/' + username);
};

export const changeProfileImage = async (formData) => {
  return await api.put('users/change-profile-image', formData);
};

export const changeBackgroundImage = async (formData) => {
  return await api.put('users/change-background-image', formData);
};

export const deleteAccount = async () => {
  return await api.delete('users/delete-account');
};

export const update = async (updateData) => {
  return await api.put('users/', updateData);
};

export const toggleFollow = async (userId) => {
  return await api.put('users/toggle-follow/' + userId);
};

export const isFollowing = async (userId) => {
  return await api.get('users/is-following/' + userId);
};

export const getFollowers = async (userId) => {
  return await api.get('users/' + userId + '/followers')
};

export const getFollowing = async (userId) => {
  return await api.get('users/' + userId + '/following')
};

//auth
export const login = async (loginData) => {
  return await api.post('auth/login', loginData);
};

export const logout = async () => {
  return await api.post('auth/logout');
};

export const sendCode = async () => {
  return await api.get('auth/send-code');
};

export const verifyCode = async (code) => {
  return await api.put('auth/verify-code/' + code);
};

export const checkToken = async () => {
  return await api.get('auth/check-token');
};

//art
export const getAllUserArt = async (userId) => {
  return await api.get('art/' + userId);
};

export const getArtDetails = async (artId) => {
  return await api.get('art/details/' + artId);
};

export const addToPortfolio = async (artData) => {
  return await api.post('art/', artData, {
    headers: {
      'Content-Type': `multipart/form-data`,
    },
  });
};

export const getLikes = async (artId) => {
  return await api.get('art/details/' + artId + '/likes');
};

export const toggleLike = async (artId) => {
  return await api.put('art/toggle-like/' + artId); 
};

export const getLiked = async (userId) => {
  return await api.get('art/liked/' + userId);
};

//catalog
export const getSubjects = async () => {
  return await api.get('catalogs/art-subjects');
};

export const getTypes = async () => {
  return await api.get('catalogs/art-types');
};

//images
