import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const setupAxiosInterceptors = (navigate: (url: string) => void) => {
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      // Check if the error is due to an unauthorized token (401)
      if (error.response?.status === 401) {
        // Clear user session
        // localStorage.removeItem('token');
        // localStorage.removeItem('user');

        // Navigate to unauthorized page
        navigate('/menu');
      }

      return Promise.reject(error);
    }
  );
};

export default apiClient;
