import 'src/styles/fileView.sass'
import FileItem from 'src/components/file/FileItem'
import FileCard from 'src/components/file/FileCard'
import { findAllForUser, download, deleteFile } from 'src/api/FileService'

import React, { useState, useEffect, useCallback } from 'react'
import { Download, Trash, XCircle } from 'react-bootstrap-icons';
import Sidebar from 'src/components/sidebar/Sidebar'
import { Button } from 'react-bootstrap'

const FilesView = ({ searchResults }) => {
  const [files, setFiles] = useState([])
  const [selectedFiles, setSelectedFiles] = useState([])
  const [resetSelectMode, setResetSelectMode] = useState(false)

  useEffect(() => {
    async function fetchData() {
      if(searchResults.length > 0)
      {
        setFiles(searchResults)
      }
      else
      {
        const response = await findAllForUser()
        setFiles(response.data.data)
      }
    }

    fetchData()
  }, [searchResults])

  const handleFileSelectChange = (fileId) => {
    if (selectedFiles.includes(fileId)) {
      setSelectedFiles((prevSelected) => prevSelected.filter(id => id !== fileId))
    }
    else {
      setSelectedFiles((prevSelected) => [...prevSelected, fileId])
    }
  }

  const handleDownload = useCallback(async () => {
    try {
      await Promise.all(
        selectedFiles.map(async id => {
          const response = await download(id);
          const blob = new Blob([response.data], { type: 'application/pdf' })
  
          const selectedFile = files.find(file => file.id === id)

          const link = document.createElement('a')
          link.href = URL.createObjectURL(blob)
          link.download = `${selectedFile.name}.pdf`
  
          document.body.appendChild(link)
          link.click();
          document.body.removeChild(link)
        })
      );
    } catch (error) {
      console.error('Error downloading files:', error)
    }
  })

  const handleDelete = useCallback(async() => {
    try {
      await Promise.all(
        selectedFiles.map(async id => {
          handleUnselect()
          await deleteFile(id)
          const response = await findAllForUser()
          setFiles(response.data.data)
        })
      );
    } catch (error) {
      console.error('Error downloading files:', error)
    }
  })

  const handleUnselect = () => {
    setSelectedFiles([])
    setResetSelectMode(!resetSelectMode)
  }

  return ( 
    <div className='FilesView'>
      {/* <Sidebar /> */}
      {/* <div className='FilesView__Row'>
        {
          files.slice(0, 5).map((item, index) => (
            <FileCard name={item.name} key={index}/>
          ))
        }
      </div> */}
      {selectedFiles.length > 0 ? (
      <div className="FilesView__SelectionBar">
        <p>{selectedFiles.length} File(s) selected</p>
        <div>
          <Download onClick={handleDownload} className="FilesView__SelectionBar__Icon" />
          <Trash onClick={handleDelete} className="FilesView__SelectionBar__Icon" />
          <XCircle onClick={handleUnselect} className="FilesView__SelectionBar__Icon" />
        </div>
      </div>
      ) : (
      <div className="FilesView__Titles">
        <div className="FilesView__Titles--Left">
          <p>Name</p>
        </div> 
        <div className="FilesView__Titles--Right">
          <p>Last Modified</p>
          <p>Files size</p>
        </div>
      </div>
      )}
      {
        files.map((item, index) => (
          <FileItem 
            id={item.id} 
            caption={item.name} 
            timestamp={item.lastModified}
            size={item.size}
            key={index} 
            handleFileSelectChange={handleFileSelectChange}
            resetSelectMode={resetSelectMode}
          />
        ))
      }
    </div>
  )
}

export default FilesView