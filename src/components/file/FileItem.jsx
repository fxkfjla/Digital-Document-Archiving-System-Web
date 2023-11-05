import 'src/styles/fileItem.sass'

import React from 'react'
import { FileEarmarkFill } from 'react-bootstrap-icons'

const monthNames = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ]

const FileItem = ({ caption, timestamp, size}) => {
  const fileDate = `${timestamp?.toDate().getDate()} ${monthNames[timestamp?.toDate().getMonth() + 1]} ${timestamp?.toDate().getFullYear()}`

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

  return (
    <div className="FileItem">
      <a href='' target='_blank' download>
        <div className="FileItem--Left">
          <FileEarmarkFill />
          <p>{caption}</p>
        </div>

        <div className="FileItem--Right">
          <p>{fileDate}</p>
          <p>{getReadableFileSize(size)}</p>
        </div>
      </a>
    </div>
  )
}

export default FileItem