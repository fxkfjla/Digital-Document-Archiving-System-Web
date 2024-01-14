import 'src/styles/fileView.sass'
import FileItem from 'src/components/file/FileItem'
import { findAllForUser, download, deleteFile, search } from 'src/api/FileService'

import React, { useState, useEffect, useCallback } from 'react'
import { Download, Trash, XCircle, ArrowUp, ArrowDown } from 'react-bootstrap-icons';
import { Pagination, Spinner } from 'react-bootstrap';
import UploadFile from './UploadFile';

const FilesView = ({ searchString }) => {
  const [files, setFiles] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [resetSelectMode, setResetSelectMode] = useState(false)
  const [sortOrder, setSortOrder] = useState('asc') 
  const [sortBy, setSortBy] = useState('lastModified')
  const [fileAmount, setFileAmount] = useState(0)
  const [loading, setLoading] = useState(false)

  async function fetchData(newSortBy, newSortOrder, newCurrentPage) {
    showLoadingSpinner()
    var response = null

    if(searchString.length > 0) {
      response = await search(searchString, newSortBy, newSortOrder, newCurrentPage)
    }
    else {
      response = await findAllForUser(newSortBy, newSortOrder, newCurrentPage)
    }
    const data = response.data.data

    setFiles(data.content)
    setTotalPages(data.totalPages)
    setFileAmount(data.totalElements)
    hideLoadingSpinner()
  }

  useEffect(() => {
    async function effectFetchData() {
      fetchData(sortBy, sortOrder, 0)
    }

    effectFetchData()
  }, [searchString])

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

    fetchData(newSortBy, newSortOrder, currentPage)
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
        })
      );
      fetchData(sortBy, sortOrder, 0)
      setCurrentPage(0)
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
  
    fetchData(sortBy, sortOrder, newPage)
    handleUnselect()
  }

  function showLoadingSpinner() {
    setLoading(true)
  }

  function hideLoadingSpinner() {
    setLoading(false) 
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
        <p>Wybrane pliki: {selectedFiles.length}</p>
        <div>
          <Download onClick={handleDownload} className="FilesView__SelectionBar__Icon" />
          <Trash onClick={handleDelete} className="FilesView__SelectionBar__Icon" />
          <XCircle onClick={handleUnselect} className="FilesView__SelectionBar__Icon" />
        </div>
      </div>
      ) : (
      <div className="FilesView__Titles">
        <div className="FilesView__Titles--Left">
          <p onClick={ () => handleSortBy('name') }>Nazwa{sortBy === 'name' && (
              <span>{ sortOrder === 'asc' ? <ArrowDown /> : <ArrowUp /> }</span>
            )}
          </p>
        </div> 
        <div className="FilesView__Titles--Right">
          <p onClick={ () => handleSortBy('lastModified') }>Ostatnia modyfikacja{sortBy === 'lastModified' && (
              <span>{ sortOrder === 'asc' ? <ArrowDown /> : <ArrowUp /> }</span>
            )}
          </p>
          <p onClick={ () => handleSortBy('size') }>Rozmiar pliku{sortBy === 'size' && (
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
            description={item.description}
            tags={item.tags}
            key={index} 
            handleFileSelectChange={handleFileSelectChange}
            resetSelectMode={resetSelectMode}
            onItemChange={fetchData}
            sortBy={sortBy}
            sortOrder={sortOrder}
            currentPage={currentPage}
          />
        ))
      }
      <div className="fixed-bottom d-flex flex-column justify-content-center align-items-center mt-3 mb-2">
        <div className="FilesView__Status mb-2">
          <p>Wszystkie pliki: {fileAmount}</p>
          <UploadFile fetchData={ fetchData } sortBy={ sortBy } sortOrder={ sortOrder } currentPage={ currentPage }/>
        </div>
        {totalPages > 1 && (
          <Pagination>
            <Pagination.First onClick={() => handlePageChange(0)} />
            <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} />
            {renderPaginationItems()}
            <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} />
            <Pagination.Last onClick={() => handlePageChange(totalPages - 1)} />
          </Pagination>
        )}
      </div>
      <div className='text-center'>
        {loading && (
          <div
            className="position-absolute top-50 start-50 translate-middle"
            style={{ zIndex: 1000 }}
          >
            <div className="bg-dark-opacity p-3 rounded">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FilesView