import 'src/styles/fileView.sass'
import FileItem from 'src/components/file/FileItem'
import { findAllForUser, download, deleteFile, search } from 'src/api/FileService'

import React, { useState, useEffect, useCallback } from 'react'
import { Download, Trash, XCircle, ArrowUp, ArrowDown } from 'react-bootstrap-icons';
import { Pagination } from 'react-bootstrap';

const FilesView = ({ searchResults }) => {
  const [files, setFiles] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [resetSelectMode, setResetSelectMode] = useState(false)
  const [sortOrder, setSortOrder] = useState('asc') 
  const [sortBy, setSortBy] = useState('lastModified')
  const [searchString, setSearchString] = useState('')

  useEffect(() => {
    async function fetchData() {

      if(searchResults[1].length > 0) {
        setFiles(searchResults[1])
        setTotalPages(searchResults[2])
      }
      else {
        const response = await findAllForUser(sortBy, sortOrder, currentPage)
        const data = response.data.data

        setFiles(data.content)
        setTotalPages(data.totalPages)
      }
    }

    fetchData()
  }, [searchResults])

  const handleSortBy = async (value) => {
    let newSortBy
    let newSortOrder

    if(sortBy === value && sortOrder === 'desc') {
      newSortBy = 'lastModified'
      newSortOrder = 'asc'
    }
    else if(sortBy === value) {
      newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc'
    }
    else {
      newSortBy = value
      newSortOrder = 'asc'
    }

    if(newSortBy) {
      setSortBy(newSortBy)
    }

    setSortOrder(newSortOrder)

    const response = await findAllForUser(newSortBy, newSortOrder, currentPage)
    const data = response.data.data

    setFiles(data.content)
    setTotalPages(data.totalPages)
  }

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
          if(searchResults[1].length > 0) {
            const response = await search(searchResults[0], sortBy, sortOrder, currentPage)
            const data = response.data.data

            setFiles(data.content)
            setTotalPages(data.totalPages)
          }
          else {
            const response = await findAllForUser(sortBy, sortOrder, currentPage)
            const data = response.data.data

            setFiles(data.content)
            setTotalPages(data.totalPages)
          }
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

  const handlePageChange = async (newPage) => {
    if (newPage < 0) {
      newPage = 0
    }
    else if (newPage >= totalPages) {
      newPage = totalPages - 1
    }

    setCurrentPage(newPage)
  
    const response = await findAllForUser(sortBy, sortOrder, newPage)
    const data = response.data.data
  
    setFiles(data.content);
    setTotalPages(data.totalPages)
  }

  const renderPaginationItems = () => {
    const visiblePages = []
    const pagesToShow = 3
    const startPage = Math.max(currentPage - 1, 0)
    const endPage = Math.min(startPage + pagesToShow - 1, totalPages - 1)
  
    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(
        <Pagination.Item key={i} active={i === currentPage} onClick={() => handlePageChange(i)}>
          {i + 1}
        </Pagination.Item>
      );
    }
  
    return visiblePages;
  };

  return ( 
    <div className='FilesView'>
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
          <p onClick={ () => handleSortBy('name') }>Name {sortBy === 'name' && (
              <span>{ sortOrder === 'asc' ? <ArrowDown /> : <ArrowUp /> }</span>
            )}
          </p>
        </div> 
        <div className="FilesView__Titles--Right">
          <p onClick={ () => handleSortBy('lastModified') }>Last Modified {sortBy === 'lastModified' && (
              <span>{ sortOrder === 'asc' ? <ArrowDown /> : <ArrowUp /> }</span>
            )}
          </p>
          <p onClick={ () => handleSortBy('size') }>Files size {sortBy === 'size' && (
              <span>{ sortOrder === 'asc' ? <ArrowDown /> : <ArrowUp /> }</span>
            )}
          </p>
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
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-3">
          <Pagination>
            <Pagination.First onClick={() => handlePageChange(0)} />
            <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} />
              {renderPaginationItems()}
            <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} />
            <Pagination.Last onClick={() => handlePageChange(totalPages - 1)} />
          </Pagination>
        </div>
      )}
    </div>
  )
}

export default FilesView