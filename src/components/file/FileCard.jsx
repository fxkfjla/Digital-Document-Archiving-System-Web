import 'src/styles/fileCard.sass'

import React from 'react'
import { FileEarmarkFill } from 'react-bootstrap-icons'

const FileCard = ({name}) => {
  return (
    <div className="FileCard">
      <div className="FileCard--Top">
        <FileEarmarkFill style={{ fontSize: 75}}/>
      </div>
      <div className="FileCard--Bottom">
        <p>{name}</p>
      </div>
    </div>
  )
}

export default FileCard