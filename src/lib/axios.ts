import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_NEST_API_URL
const vocabBaseURL = process.env.NEXT_PUBLIC_NEST_API_VOCAB_URL

console.log('[AXIOS] Base URL:', baseURL)
console.log('[AXIOS] Vocab Base URL:', vocabBaseURL)

// API có token
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
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
  (error) => Promise.reject(error)
)

// API không cần token
const vocabApi = axios.create({
  baseURL: vocabBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export { api, vocabApi }
