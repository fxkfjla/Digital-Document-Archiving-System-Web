import { register } from 'src/api/AuthService'

import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router-dom'

const Register = () => {
  const [credentials, setCredentials] = useState( { email: '', password: '', rePassword: ''} )
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()

    if(credentials.email.length === 0) {

    }
    else if (credentials.password.length === 0) {

    } 
    else if (credentials.rePassword.length === 0) {

    }

    const response = await register(credentials)

    if(response.status === 200)
      navigate('/login')
    else {
      // popup co jest niepoprawne
    }
  }

  return (
    <div className="Wrapper">
      <Form className="Auth__Form" onSubmit={(handleRegister)}>
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

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Powtórz hasło</Form.Label>
          <Form.Control type="password" placeholder="Powtórz hasło"
            value={credentials.rePassword}
            onChange={(e) => setCredentials({ ...credentials, rePassword: e.target.value})}/>
        </Form.Group>

        <Link className="d-block mb-3" to="/login">
          Masz już konto? Zaloguj się
        </Link>

        <Button className="Auth__Button mx-auto d-block width" variant="primary" type="submit">
          Zarejestruj
        </Button>
      </Form>
    </div>
  )
}

export default Register