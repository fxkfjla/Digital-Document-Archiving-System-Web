import 'src/styles/fileView.sass'
import FileItem from 'src/components/file/FileItem'
import { findAllForUser, download, deleteFile, search } from 'src/api/FileService'

import React, { useState, useEffect, useCallback } from 'react'
import { Download, Trash, XCircle, ArrowUp, ArrowDown } from 'react-bootstrap-icons';
import { Pagination } from 'react-bootstrap';

const FilesView = ({searchString}) => {
  const [files, setFiles] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [resetSelectMode, setResetSelectMode] = useState(false)
  const [sortOrder, setSortOrder] = useState('asc') 
  const [sortBy, setSortBy] = useState('lastModified')

  async function fetchData(newSortBy, newSortOrder, newCurrentPage) {
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
          fetchData(sortBy, sortOrder, currentPage)
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
  
    fetchData(sortBy, sortOrder, newPage)
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