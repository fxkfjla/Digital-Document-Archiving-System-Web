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

    await register(credentials)

    navigate('/login')
  }

  return (
    <div className="Wrapper">
      <Form className="Auth__Form" onSubmit={(handleRegister)}>
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

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Repeat password</Form.Label>
          <Form.Control type="password" placeholder="Repeat password"
            value={credentials.rePassword}
            onChange={(e) => setCredentials({ ...credentials, rePassword: e.target.value})}/>
        </Form.Group>

        <Link className="d-block mb-3" to="/login">
          Login here
        </Link>

        <Button className="Auth__Button mx-auto d-block width" variant="primary" type="submit">
          Register
        </Button>
      </Form>
    </div>
  )
}

export default Register