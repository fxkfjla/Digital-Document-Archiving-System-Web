import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_AUTH_URL

const authService = axios.create({
  baseURL: apiUrl,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json'}
})

authService.interceptors.response.use(
  response => response,
  error => error
)

export const register = (credentials) => authService.post('/register', 
  { email: credentials.email, password: credentials.password, rePassword: credentials.rePassword })

export const login = (credentials) => authService.post('/login', 
  { email: credentials.email, password: credentials.password })

export const logout = (token) => authService.post('/logout', { token: token })

export default authService