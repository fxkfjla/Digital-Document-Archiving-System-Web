import 'src/styles/header.sass'
import UploadFile from "src/components/file/UploadFile";
import Logout from 'src/components/auth/Logout';

import React, { useState } from 'react'
import { Navbar, Nav, Form, FormControl } from 'react-bootstrap';

const Header = ({ onSearch }) => {
  const [searchString, setSearchString] = useState('')

  const searchFiles = async (e) => {
    e.preventDefault()

    onSearch(searchString)
  }

  return (
    <Navbar bg="light" expand="lg" className='justify-content-between'>
      <Navbar.Brand className='ms-3'href="#">
        <img src="" alt="" />
        <span>DDAS</span>
      </Navbar.Brand>
      <Form className="d-flex mx-auto" onSubmit={(e) => searchFiles(e)}>
        <FormControl 
          type="text" className='search-bar' placeholder="Szukaj" 
          value={searchString} onChange={(e) => setSearchString(e.target.value)}
        />
      </Form>
      <Nav.Item className='me-3'>
        <UploadFile />
        <Logout />
      </Nav.Item>
    </Navbar>
  );
}

export default Header