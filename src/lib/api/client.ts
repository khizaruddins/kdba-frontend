import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  process.env.BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:4000/api/v1';

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach Bearer token if present in memory or localStorage
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const adminToken = localStorage.getItem('kdba_admin_token');
      const token = localStorage.getItem('kdba_access_token');
      const activeToken = config.url?.includes('/admin') && adminToken ? adminToken : (adminToken || token);
      if (activeToken && config.headers) {
        config.headers.Authorization = `Bearer ${activeToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor: unwrap standard { success: true, data } response envelope and handle 401 token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => {
    // If response is wrapped in { success: true, data }, unwrap it
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return response.data.data;
    }
    return response.data;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If 401 and not already retrying and not on auth endpoints
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/register') &&
      !originalRequest.url?.includes('/auth/refresh') &&
      !originalRequest.url?.includes('/admin/auth/login') &&
      !originalRequest.url?.includes('/admin/auth/register')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        );

        const newAccessToken =
          refreshResponse.data?.data?.accessToken || refreshResponse.data?.accessToken;

        if (newAccessToken && typeof window !== 'undefined') {
          localStorage.setItem('kdba_access_token', newAccessToken);
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          processQueue(null, newAccessToken);
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('kdba_access_token');
          // Only redirect if not on public, site, or admin routes
          if (
            !window.location.pathname.startsWith('/site') &&
            !window.location.pathname.startsWith('/login') &&
            !window.location.pathname.startsWith('/register') &&
            !window.location.pathname.startsWith('/admin')
          ) {
            window.location.href = '/login';
          }
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error.response?.data || error);
  },
);
