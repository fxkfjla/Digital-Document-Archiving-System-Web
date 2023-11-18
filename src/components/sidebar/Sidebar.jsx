import 'src/styles/sidebar.sass'
import React from 'react'
import { Button, Container, Offcanvas } from 'react-bootstrap';  
// import { Nav, Container, Offcanvas, Button } from 'react-bootstrap'

const Sidebar = () => {
  return (
    <>  
    <Container className='p-4'>  
      <Button variant="primary" onClick={showSidebar}>  
        Launch Sidebar  
      </Button>  
      <Offcanvas show={show} onHide={closeSidebar}>  
        <Offcanvas.Header closeButton>  
          <Offcanvas.Title>Sidebar Title</Offcanvas.Title>  
        </Offcanvas.Header>  
        <Offcanvas.Body>  
          Some dummy text, we can have any text or element at at this place.  
        </Offcanvas.Body>  
      </Offcanvas>  
      </Container>  
    </>  
  )
}

export default Sidebar