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
import ErrorPopup from 'src/error/ErrorPopup'

const Login = () => {
  const [credentials, setCredentials] = useState( { email: '', password: ''} )
  const { updateUser } = useUser()
  const [, setCookie] = useCookies([TOKEN_COOKIE_NAME])
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate()

  const handleLogin = async (event) => {
    event.preventDefault()
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    }

    const response = await login(credentials)

    if(response.status === 200){
      const token = response.data.data
      const decoded = jwtDecode(token)
      updateUser(decoded)

      setCookie(TOKEN_COOKIE_NAME, token, 
        { path: '/', maxAge: decoded.exp * 1000, sameSite: 'None', secure: true })
      navigate('/')
    }
    else {
      if(form.checkValidity() === true) {
        setErrorMessage("Niepoprawny email bądź hasło")
        setShowError(true);
      }
    }

    setValidated(true)
  }

  const handleCloseError = () => {
    setShowError(false)
  };

  return (
    <div className='Wrapper'>
      <Form className="Auth__Form" noValidate validated={validated} onSubmit={(handleLogin)}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Adres email</Form.Label>
          <Form.Control type="email" placeholder="Podaj email" 
            required
            value={credentials.email}
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}/>
          <Form.Control.Feedback type="invalid">
            Podaj poprawny adres email
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Hasło</Form.Label>
          <Form.Control type="password" placeholder="Podaj hasło"
            required
            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value})}/>
          <Form.Control.Feedback type="invalid">
            Podaj poprawne hasło (min. 1 duża litera, 1 cyfra i znak specjalny)
          </Form.Control.Feedback>
        </Form.Group>

        <Link className="Link d-block mb-3" to="/register">
          Nie masz konta? Zarejestruj się
        </Link>

        <Button className="Auth__Button mx-auto d-block width" variant="primary" type="submit">
          Zaloguj
        </Button>
      </Form>

      <ErrorPopup show={showError} handleClose={handleCloseError} errorMessage={errorMessage} />
    </div>
  )
}

export default Login