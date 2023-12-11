import { register } from 'src/api/AuthService'
import ErrorPopup from 'src/error/ErrorPopup';

import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const [credentials, setCredentials] = useState( { email: '', password: '', rePassword: ''} )
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    }

    const response = await register(credentials)

    if(response.status === 200)
      navigate('/login')
    else {
      if(form.checkValidity() === true) {
          setErrorMessage("Adres email jest zajęty")
          setShowError(true)
      }
    }

    setValidated(true)
  };

  const handleCloseError = () => {
    setShowError(false)
  };

  return (
    <div className="Wrapper">
      <Form className="Auth__Form" noValidate validated={validated} onSubmit={handleSubmit}>
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

        <Form.Group className="mb-3" controlId="formPassword">
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

       <Form.Group className="mb-3" controlId="formBasicPassword">
         <Form.Label>Powtórz hasło</Form.Label>
         <Form.Control type="password" placeholder="Powtórz hasło"
          required
          pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
          value={credentials.rePassword}
          onChange={e => {
            const rePassword = e.target.value
            setCredentials({ ...credentials, rePassword })

            const passwordsMatch = rePassword === credentials.password

            e.target.setCustomValidity(passwordsMatch ? '' : 'Hasła muszą być identyczne')
          }}/>
          <Form.Control.Feedback type="invalid">
            Hasła muszą być identyczne
          </Form.Control.Feedback>
       </Form.Group>

       <Link className="Link d-block mb-3" to="/login">
          Masz już konto? Zaloguj się
        </Link>

        <Button className="Auth__Button mx-auto d-block width" variant="primary" type="submit">
          Zarejestruj
        </Button>
      </Form>

      <ErrorPopup show={showError} handleClose={handleCloseError} errorMessage={errorMessage} />
    </div>
  )
}

export default Register