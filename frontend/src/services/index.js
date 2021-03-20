import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost/api',
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
  return await api.delete('auth/logout');
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

export const deleteArt = async (artId) => {
  return await api.delete('art/' + artId);
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

export const postComment = async (artId, value) => {
  return await api.post('art/comment/' + artId, { value });
};

export const getComments = async (artId) => {
  return await api.get('art/details/' + artId + '/comments');
};

export const deleteComment = async (commentId) => {
  return await api.delete('art/comment/' + commentId);
};

export const getTop = async () => {
  return await api.get('art/top');
};

export const search = async (q, options) => {
  return await api.get('art/search?q=' + q + '&options=' + options);
}

//catalog
export const getSubjects = async () => {
  return await api.get('catalogs/art-subjects');
};

export const getTypes = async () => {
  return await api.get('catalogs/art-types');
};

//images
