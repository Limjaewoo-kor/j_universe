import API from './api';

// 로그인 API 호출
const login = async (email, password) => {
  try {
    const response = await API.post('/login', { email, password });
    return response.data;  // 반환값은 access_token이 될 것입니다.
  } catch (error) {
    throw error.response ? error.response.data : 'Login failed';
  }
};

export default login;
