import 'src/styles/fileItem.sass'

import { download } from 'src/api/FileService'

import React, { useCallback, useState } from 'react'
import { FileEarmarkFill } from 'react-bootstrap-icons'
import { Modal, Button } from 'react-bootstrap'

const monthNames = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ]

const FileItem = ({ id, caption, timestamp, size}) => {
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

  const openModal = useCallback(async () => {
    const response = await download(id)
    setPdfContent(response.data)

    setModalShow(true)
  }, [id])

  const closeModal = useCallback(() => {
    setModalShow(false)
  }, []);

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

  return (
    <div className="FileItem">
      <div>
        <div className="FileItem--Left" onClick={openModal} style={{cursor: 'pointer'}}>
          <FileEarmarkFill />
          <p>{caption}</p>
        </div>

        <div className="FileItem--Right">
          <p>{fileDate}</p>
          <p>{getReadableFileSize(size)}</p>
        </div>
      </div>

      <Modal show={modalShow} onHide={closeModal} dialogClassName='modal-lg'>
        <Modal.Header closeButton>
          <Modal.Title>{caption}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {pdfContent && (
            <iframe
              title="PDF Viewer"
              src={pdfContent && URL.createObjectURL(new Blob([pdfContent], { type: 'application/pdf' }))}
              width="100%"
              height="650px"
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={downloadFile}>
            Download PDF
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default FileItem