import CookieManager from 'src/utils/CookieManager'
import { useUser } from 'src/context/UserContext'
import { login } from 'src/api/AuthService'

import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { jwtDecode } from 'jwt-decode'

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: ''})
  const { updateUser } = useUser()

  const handleLogin = async (e) => {
    e.preventDefault()

    const response = await login(credentials)
    const token = response.data.data
    const decoded = jwtDecode(token)

    updateUser(decoded)

    CookieManager.setCookie(CookieManager.TOKEN_COOKIE_NAME, token, 
      { path: '/', expires: decoded.exp * 1000 })
  }

  return (
    <Form onSubmit={(handleLogin)}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" 
          value={credentials.email}
          onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value})}/>
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  )
}

export default Login