import axios from 'axios'
const baseURL = process.env.NEXT_PUBLIC_NEST_API_URL

console.log('[AXIOS] Base URL:', baseURL)
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Xử lý lỗi chung
    return Promise.reject(error)
  }
)

export default api
