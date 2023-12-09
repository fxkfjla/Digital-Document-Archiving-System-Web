import React, { useState, useRef } from 'react'
import { Upload } from 'react-bootstrap-icons'
import { Button } from 'react-bootstrap';

const UploadFile = () => {
  const [file, setFile] = useState()
  const inputFile = useRef(null) 

  const showFileBrowser = () => {
    inputFile.current.click();
  }

  return (
    <>
      <Button variant="primary" onClick={showFileBrowser}>
        <Upload className='me-2'/>
        Prześlij plik 
      </Button>
      <input ref={inputFile} className="d-none" type="file" placeholder="UploadFile" accept=".xml" />
    </>
  )
}

export default UploadFile