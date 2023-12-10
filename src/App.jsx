import 'src/styles/shared.sass'
import 'src/App.sass'
import Header from 'src/components/header/Header'
import FilesView from 'src/components/file/FilesView'
import Register from 'src/components/auth/Register'
import Login from 'src/components/auth/Login'
import PrivateRoutes from 'src/utils/PrivateRoutes'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'

function App() {
  const [searchString, setSearchString] = useState('')
  const [doFileUpload, setDoFileUpload] = useState(false)

  const onSearch = (searchString) => {
    setSearchString(searchString)
  }

  const onDoFileUpload = (state) => {
    setDoFileUpload(state)
  }

  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route element={( <>
            <Header onSearch={onSearch} onDoFileUpload={onDoFileUpload}/> 
            <div className="App__Main">
              <PrivateRoutes />
            </div> 
            </> )}>
            <Route element={ <FilesView searchString={searchString} doFileUpload={doFileUpload} /> } path="/" exact />
          </Route>
          <Route element={ <Login /> } path="/login" />
          <Route element={ <Register /> } path="/register" />
        </Routes>
      </Router>
    </div>
  )
}

export default App
