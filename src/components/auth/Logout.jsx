import { logout } from 'src/api/AuthService'
import { removeTokenFromCookie, getTokenFromCookie } from 'src/utils/CookieManager'
import { TOKEN_COOKIE_NAME } from 'src/utils/CookieManager'

import { useNavigate } from 'react-router-dom'
import React from 'react'
import { Button } from 'react-bootstrap'

const Logout = () => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    const token = getTokenFromCookie()
    await logout(token);
    removeTokenFromCookie(TOKEN_COOKIE_NAME)

    navigate("/login")
  }

  return (
    <Button variant="primary" onClick={handleLogout}>
      Wyloguj
    </Button>
  )
}

export default Logout