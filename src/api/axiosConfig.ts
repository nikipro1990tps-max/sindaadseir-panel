import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// تعریف اینترفیس برای پیکربندی
interface ApiConfig {
  baseURL: string;
  timeout: number;
}

// ایجاد پیکربندی
const apiConfig: ApiConfig = {
  baseURL: 'http://localhost:3070/api', // process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 10000 // parseInt(process.env.REACT_APP_API_TIMEOUT || '10000', 10)
};

// ایجاد axios instance
const axiosInstance: AxiosInstance = axios.create(apiConfig);

// اینترسپتور برای درخواست‌ها
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // اضافه کردن توکن یا هدرهای دلخواه
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(`📤 Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// اینترسپتور برای پاسخ‌ها
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`📥 Received response for: ${response.config.url}`, response.status);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.data || error.message);

    // مدیریت خطاهای خاص
    if (error.response?.status === 401) {
      // redirect به صفحه لاگین
      // window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;