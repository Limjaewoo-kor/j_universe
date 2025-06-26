import API from './api';

// /me API 호출 (사용자 정보 조회)
const getMe = async (token) => {
  try {
    const response = await API.get('/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : 'Failed to fetch user data';
  }
};

export default getMe;
