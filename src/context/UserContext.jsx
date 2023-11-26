import { jwtDecode } from 'jwt-decode';
import React, { createContext, useContext, useState } from 'react';
import { getTokenFromCookie, removeTokenFromCookie } from 'src/utils/CookieManager';

const UserContext = createContext()

export const useUser = () => useContext(UserContext)

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = getTokenFromCookie()

    if(token) {
      try {
        const decodedToken = jwtDecode(token, {header: true})

        if(decodedToken.exp * 1000 < Date.now()) {
          removeTokenFromCookie()
          return null
        }

        return decodedToken
      }
      catch(error) {
        removeTokenFromCookie();
        return null;
      }
    }

    return null
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