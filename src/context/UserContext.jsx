import { jwtDecode } from 'jwt-decode';
import React, { createContext, useContext, useState } from 'react';
import { getTokenFromCookie } from 'src/utils/CookieManager';

const UserContext = createContext()

export const useUser = () => useContext(UserContext)

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = getTokenFromCookie()
    return token ? jwtDecode(token) : null
  })

  const updateUser = (userData) => {
    setUser(userData)
  }

  return (
    <UserContext.Provider value={{ user, updateUser }}>
        { children }
    </UserContext.Provider> 
  )
}