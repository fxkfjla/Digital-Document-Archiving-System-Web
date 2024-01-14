import 'src/styles/header.sass'
import UploadFile from "src/components/file/UploadFile";
import Logout from 'src/components/auth/Logout';

import React, { useState } from 'react'
import { Navbar, Nav, Form, FormControl, Container } from 'react-bootstrap';

const Header = ({ onSearch }) => {
  const [searchString, setSearchString] = useState('')

  const searchFiles = async (e) => {
    e.preventDefault()

    onSearch(searchString)
  }

  return (
    <Navbar expand="lg">
      <div className="HeaderWrapper d-flex w-100 justify-content-between align-items-center">
        <Navbar.Brand className='ms-3'href="#">
          <img src="src/media/logo_ddas.png" height="80" alt="" className='mb-1'/>
        </Navbar.Brand>
        <Form className="d-flex flex-grow-1 mx-auto" onSubmit={(e) => searchFiles(e)}>
          <FormControl 
            type="text" className='SearchBar' placeholder="Szukaj" 
            value={searchString} onChange={(e) => setSearchString(e.target.value)}
          />
        </Form>
        <Nav.Item className='me-3'>
          <Logout />
        </Nav.Item>
      </div>
    </Navbar>
  );
}

export default Header