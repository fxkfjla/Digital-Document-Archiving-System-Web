import 'src/styles/fileView.sass'
import FileItem from 'src/components/file/FileItem'
import FileCard from 'src/components/file/FileCard'

import React, { useState, useEffect } from 'react'

const FilesView = () => {
  // const [files, setFiles] = useState([])

  const files = [{ name: "test1", timestamp: null, size: 1024 }, { name: "test2", timestamp: null, size: 1024 }, { name: "test3", timestamp: null, size: 1024 }]

  return (
    <div className='FilesView'>
      <div className='FilesView__Row'>
        {
          files.slice(0, 5).map((item, index) => (
            <FileCard name={item.name} key={index}/>
          ))
        }
      </div>
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
          <FileItem caption={item.name} timestamp={item.timestamp} size={item.size} key={index} />
        ))
      }
    </div>
  )
}

export default FilesView