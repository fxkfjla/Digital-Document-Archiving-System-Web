import 'src/styles/fileView.sass'
import FileItem from 'src/components/file/FileItem'
import FileCard from 'src/components/file/FileCard'
import { findAllForUser } from 'src/api/FileService'
import { useUser } from 'src/context/UserContext'

import React, { useState, useEffect } from 'react'
import Sidebar from 'src/components/sidebar/Sidebar'

const FilesView = ({ searchResults }) => {
  // const { user } = useUser()
  const [files, setFiles] = useState([])

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
      <div className="FilesView__Titles">
        <div className="FilesView__Titles--Left">
          <p>Name</p>
        </div> 
        <div className="FilesView__Titles--Right">
          <p>Last Modified</p>
          <p>Files size</p>
        </div>
      </div>
      {
        files.map((item, index) => (
          <FileItem id={item.id} caption={item.name} timestamp={item.lastModified} size={item.size} key={index} />
        ))
      }
    </div>
  )
}

export default FilesView