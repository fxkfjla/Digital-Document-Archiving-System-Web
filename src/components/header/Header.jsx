import 'src/styles/header.sass'
import UploadFile from "src/components/file/UploadFile";

import React from 'react'
import { Navbar, Nav, Form, FormControl } from 'react-bootstrap';

const Header = () => {
  return (
    <Navbar bg="light" expand="lg" className='justify-content-between'>
      <Navbar.Brand className='ms-3'href="#">
        <img src="" alt="" />
        <span>DDAS</span>
      </Navbar.Brand>
      <Form className="d-flex mx-auto">
        <FormControl type="text" className='search-bar' placeholder="Search" />
      </Form>
      <Nav.Item className='me-3'>
        <UploadFile />
      </Nav.Item>
    </Navbar>
  );
}

export default Header