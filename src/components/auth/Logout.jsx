import CookieManager from 'src/utils/CookieManager'

import React from 'react'

const Logout = () => {
  const logout = () => {
    CookieManager.removeCookie(CookieManager.TOKEN_COOKIE_NAME)
  }

  return (
    <div>Logout</div>
  )
}

export default Logout