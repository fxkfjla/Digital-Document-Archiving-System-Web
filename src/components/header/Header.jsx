import 'src/styles/header.sass'
import UploadFile from "src/components/file/UploadFile";
import { search } from 'src/api/FileService';

import React, { useState } from 'react'
import { Navbar, Nav, Form, FormControl } from 'react-bootstrap';

const Header = ({ onSearch }) => {
  const [searchString, setSearchString] = useState('')

  const searchFiles = async (e) => {
    e.preventDefault()

    const response = await search(searchString)
    onSearch(searchString, response.data.data.content, response.data.data.totalPages)
  }

  return (
    <Navbar bg="light" expand="lg" className='justify-content-between'>
      <Navbar.Brand className='ms-3'href="#">
        <img src="" alt="" />
        <span>DDAS</span>
      </Navbar.Brand>
      <Form className="d-flex mx-auto" onSubmit={(e) => searchFiles(e)}>
        <FormControl 
          type="text" className='search-bar' placeholder="Search" 
          value={searchString} onChange={(e) => setSearchString(e.target.value)}
        />
      </Form>
      <Nav.Item className='me-3'>
        <UploadFile />
      </Nav.Item>
    </Navbar>
  );
}

export default Header