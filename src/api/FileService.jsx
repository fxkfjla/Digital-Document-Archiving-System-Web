import axios from 'axios'
import { getTokenFromCookie } from 'src/utils/CookieManager';

const apiUrl = import.meta.env.VITE_API_FILE_URL

const fileService = axios.create({
  baseURL: apiUrl,
  timeout: 10000
})

fileService.interceptors.request.use((config) => {
  const token = getTokenFromCookie()

  if(token) 
    config.headers.Authorization = `Bearer ${token}`

  return config;
})

fileService.interceptors.response.use(
  response => response,
  error => {
      if (error.response) {
        console.error('Response Data:', error.response.data)
        console.error('Status Code:', error.response.status)
      } else if (error.request) {
        console.error('No response received:', error.request)
      } else {
        console.error('Error:', error.message)
      }
      console.error('Error Config:', error.config)
  }
)

export const download = (id) => fileService.get('/download?id=' + id, { responseType: 'arraybuffer' })

export const deleteFile = (id) => fileService.get('/delete?id=' + id)

export const findAllForUser = () => fileService.get('/all')

export const search = (name) => fileService.get('/search?name=' + name)

export default fileService