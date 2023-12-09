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
    window.location.href = '/login';
  }
)

export const download = id => fileService.get('/download?id=' + id, { responseType: 'arraybuffer' })

export const deleteFile = id => fileService.get('/delete?id=' + id)

export const findAllForUser = (sortBy, sortDirection, page) => fileService.get('/all', { params: { sortBy: sortBy, sortDirection: sortDirection, page: page } })

export const search = (name, sortBy, sortDirection, page) => fileService.get('/search', { params: { name: name, sortBy: sortBy, sortDirection: sortDirection, page: page } })

export const editFile = (id, name, description, tags) => fileService.put(`/edit/${id}`, {name: name, description: description, tags: tags});

export default fileService