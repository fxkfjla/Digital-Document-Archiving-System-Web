import 'src/styles/fileItem.sass'

import { download, editFile} from 'src/api/FileService'

import React, { useCallback, useState, useEffect } from 'react'
import { FileEarmarkFill } from 'react-bootstrap-icons'
import { Modal, Button, Badge, Form } from 'react-bootstrap'

const monthNames = [ 'STY', 'LUT', 'MAR', 'KWI', 'MAJ', 'CZE', 'LIP', 'SIE', 'WRZ', 'PAZ', 'LIS', 'GRU' ]

const FileItem = ({ id, caption, timestamp, size, description, tags, handleFileSelectChange, resetSelectMode, onItemChange}) => {
  timestamp = new Date(timestamp)
  const fileDate = `${timestamp?.getDate()} ${monthNames[timestamp?.getMonth()]} ${timestamp?.getFullYear()}`

  const getReadableFileSize = (fileSizeInBytes) => {
    const byteUnits = [ ' kB', ' MB', ' GB', ' TB' ]

    let i = -1
    do{
      fileSizeInBytes /= 1024
      i++
    }
    while(fileSizeInBytes > 1024)

    return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i]
  }

  const [modalShow, setModalShow] = useState(false)
  const [pdfContent, setPdfContent] = useState(null)
  const [selectMode, setSelectMode] = useState(false)

  useEffect(() => {
    setSelectMode(false)
  }, [resetSelectMode])

  const openModal = useCallback(async () => {
    const response = await download(id)
    setPdfContent(response.data)

    setModalShow(true)
  }, [id])

  const closeModal = useCallback(() => {
    setModalShow(false)
  }, []);

  function onFileClick() {
    const [click, setClick] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            // simple click
            if (click === 1) {
              setSelectMode(!selectMode)
              handleFileSelectChange(id)  
            }

            setClick(0);
        }, 150);

        if (click === 2) 
          openModal()

        return () => clearTimeout(timer);
        
    }, [click]);

    return () => setClick(prev => prev + 1);
  }

  const downloadFile = useCallback(async () => {
    const response = await download(id);

    const blob = new Blob([response.data], { type: 'application/pdf' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${caption}.pdf`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    closeModal()
  }, [id, caption, closeModal])

  const [editModalShow, setEditModalShow] = useState(false)
  const [newName, setNewName] = useState(caption)
  const [newDescription, setNewDescription] = useState(description)
  var array = []
  tags.forEach(tag => array.push(tag.name))
  const [newTags, setNewTags] = useState(array)

  const openEditModal = useCallback(() => {
    setEditModalShow(true)
    setModalShow(false)
  }, []);

  const closeEditModal = useCallback(() => {
    setEditModalShow(false)
    openModal()
  }, [])

  const handleEditFile = useCallback(async () => {
    await editFile(id, newName, newDescription, newTags)
    onItemChange()

    closeEditModal();
  }, [closeEditModal, id, newName, newDescription, newTags]);

  return (
    <div className={`FileItem${selectMode ? '--Highlighted' : ''}`}>
      <div>
        <div className="FileItem--Left" onClick={onFileClick()} style={{cursor: 'pointer'}}>
          <FileEarmarkFill />
          <p>{caption}</p>
        </div>

        <div className="FileItem--Right">
          <p>{fileDate}</p>
          <p>{getReadableFileSize(size)}</p>
        </div>
      </div>

      <Modal show={modalShow} onHide={closeModal} dialogClassName='modal-xl'>
        <Modal.Header closeButton>
          <Modal.Title>{caption}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="ModalContent">
            <div className="PdfContent">
              {pdfContent && (
                <iframe
                  title="PDF Viewer"
                  src={pdfContent && URL.createObjectURL(new Blob([pdfContent], { type: 'application/pdf' }))}
                  width="100%"
                  height="650px"
                />
              )}
            </div>

            <div className="AdditionalInfo">
              <p>Opis: {description}</p>
              {tags.length > 0 && (
                <p>
                  Tagi: {' '}
                  {tags.map(tag => (
                    <Badge key={tag.id} variant="secondary" style={{ marginRight: '5px', marginBottom: '5px' }}>
                      {tag.name}
                    </Badge>
                  ))}
                </p>
              )}
              <p>Ostatnia modyfikacja: {timestamp?.getDate()}{"."}{timestamp?.getMonth() + 1}{"."}{timestamp?.getFullYear()}</p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={openEditModal}>
            Edytuj
          </Button>
          <Button variant="primary" onClick={downloadFile}>
            Pobierz PDF
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={editModalShow} onHide={closeEditModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edycja pliku: {caption}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Nazwa:</Form.Label>
            <Form.Control type="text" placeholder="Nazwa" defaultValue={caption} onChange={(e) => setNewName(e.target.value)} />
          </Form.Group>
          <Form.Group className='mt-3'>
            <Form.Label>Opis:</Form.Label>
            <Form.Control as="textarea" rows={3} placeholder="Opis" defaultValue={description} onChange={(e) => setNewDescription(e.target.value)} />
          </Form.Group>
          <Form.Group className='mt-3'>
            <Form.Label>Tagi: (podawane po przecinku)</Form.Label>
            <Form.Control text="textarea" placeholder="Tagi" defaultValue={tags.map(tag => tag.name).join(', ')}  onChange={(e) => setNewTags(e.target.value.split(',').map(tag => tag.trim()))} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleEditFile}>
            Zapisz
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default FileItem