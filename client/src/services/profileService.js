import axios from 'axios';

const API_URL = '/api/profiles';

export const getProfile = async (userId) => {
  const endpoint = userId ? `${API_URL}/${userId}` : `${API_URL}/me`;
  const response = await axios.get(endpoint);
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await axios.put(`${API_URL}/me`, profileData);
  return response.data;
};

export const getAllProfiles = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const searchProfiles = async (searchTerm, filterType) => {
  const response = await axios.get(`${API_URL}/search`, {
    params: { q: searchTerm, type: filterType },
  });
  return response.data;
};
