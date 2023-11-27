import React, { createContext, useContext, useState } from 'react';
import { getTokenFromCookie, removeTokenFromCookie } from 'src/utils/CookieManager';

const UserContext = createContext()

export const useUser = () => useContext(UserContext)

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = getTokenFromCookie()
    const parseJwt = (token) => {
      try {
        return JSON.parse(atob(token.split(".")[1]));
      } catch (e) {
        return null;
      }
    };

    if(token) {
      try {
        const decodedToken = parseJwt(token)

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