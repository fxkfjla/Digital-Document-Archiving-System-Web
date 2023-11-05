import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_AUTH_URL

const authService = axios.create({
  baseURL: apiUrl,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json'}
})

authService.interceptors.response.use(
  response => response,
  error => {
      if (error.response) {
        console.error('Response Data:', error.response.data);
        console.error('Status Code:', error.response.status);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error:', error.message);
      }
      console.error('Error Config:', error.config);
  }
)

export const register = (credentials) => authService.post('/register', 
  { email: credentials.email, password: credentials.password, rePassword: credentials.rePassword })

export const login = (credentials) => authService.post('/login', 
  { email: credentials.email, password: credentials.password })

export const logout = (token) => authService.post('/logout', token)

export default authService