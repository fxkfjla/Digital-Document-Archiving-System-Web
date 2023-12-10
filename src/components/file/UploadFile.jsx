import React, { useState, useRef } from 'react'
import { Upload } from 'react-bootstrap-icons'
import { Button, Modal, Form } from 'react-bootstrap';
import { upload } from 'src/api/FileService';

const UploadFile = ({onDoFileUpload}) => {
  const [file, setFile] = useState()
  const inputFile = useRef(null) 

  const [fileName, setFileName] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState([])

  const [editModalShow, setEditModalShow] = useState(false)

  const showFileBrowser = () => {
    inputFile.current.click();
    onDoFileUpload(false)
  }

  const handleUpload = (e) => {
    setFile(e.target.files[0])
    setFileName(e.target.files[0].name)
    setName(e.target.files[0].name)

    setEditModalShow(true)
  }

  const handleEditFile = async () => {
    await upload(file, name, description, tags)

    onDoFileUpload(true)
    setEditModalShow(false)
  }

  return (
    <>
      <Modal show={editModalShow} centered onHide={() => setEditModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edycja pliku: {fileName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Nazwa:</Form.Label>
            <Form.Control type="text" placeholder="Nazwa" defaultValue={fileName} onChange={(e) => setName(e.target.value)} />
          </Form.Group>
          <Form.Group className='mt-3'>
            <Form.Label>Opis:</Form.Label>
            <Form.Control as="textarea" rows={3} placeholder="Opis" onChange={(e) => setDescription(e.target.value)} />
          </Form.Group>
          <Form.Group className='mt-3'>
            <Form.Label>Tagi: (podawane po przecinku)</Form.Label>
            <Form.Control text="textarea" placeholder="Tagi" onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()))} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleEditFile}>
            Zapisz
          </Button>
        </Modal.Footer>
      </Modal>
      <Button variant="primary" onClick={showFileBrowser}>
        <Upload className='me-2'/>
        Prześlij plik 
      </Button>
      <input ref={inputFile} className="d-none" type="file" placeholder="UploadFile" accept=".pdf" onChange={e => handleUpload(e)}/>
    </>
  )
}

export default UploadFile