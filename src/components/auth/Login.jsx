import 'src/styles/auth.sass'
import { TOKEN_COOKIE_NAME } from 'src/utils/CookieManager'
import { useUser } from 'src/context/UserContext'
import { login } from 'src/api/AuthService'

import React, { useState } from 'react'
import { useCookies } from "react-cookie";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

const Login = () => {
  const [credentials, setCredentials] = useState( { email: '', password: ''} )
  const { updateUser } = useUser()
  const [, setCookie] = useCookies([TOKEN_COOKIE_NAME])
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    if(credentials.email.length === 0) {

    }
    else if (credentials.password.length === 0) {

    } 

    const response = await login(credentials)
    const token = response.data.data
    const decoded = jwtDecode(token)

    updateUser(decoded)

    setCookie(TOKEN_COOKIE_NAME, token, 
      { path: '/', maxAge: decoded.exp * 1000, sameSite: 'None', secure: true })
    
    if(response.status === 200)
      navigate('/')
    else {
      // popup co jest niepoprawne
    }
  }

  return (
    <div className='Wrapper'>
      <Form className="Auth__Form" onSubmit={(handleLogin)}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Adres email</Form.Label>
          <Form.Control type="email" placeholder="Podaj email" 
            value={credentials.email}
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}/>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Hasło</Form.Label>
          <Form.Control type="password" placeholder="Podaj hasło"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value})}/>
        </Form.Group>

        <Link className="d-block mb-3" to="/register">
          Nie masz konta? Zarejestruj się
        </Link>

        <Button className="Auth__Button mx-auto d-block width" variant="primary" type="submit">
          Zaloguj
        </Button>
      </Form>
    </div>
  )
}

export default Login