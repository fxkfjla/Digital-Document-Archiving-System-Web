import 'src/styles/shared.sass'
import 'src/App.sass'
import Header from 'src/components/header/Header'
import FilesView from 'src/components/file/FilesView'
import Login from 'src/components/auth/Login'
import Register from 'src/components/auth/Register'
import PrivateRoutes from 'src/utils/PrivateRoutes'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [totalPages, setTotalPages] = useState(0)
  const [searchString, setSearchString] = useState('')

  const onSearch = (searchString, results, totalPages) => {
    setSearchResults(results)
    setTotalPages(totalPages)
    setSearchString(searchString)
  }

  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route element={( <>
            <Header onSearch={onSearch}/> 
            <div className="App__Main">
              <PrivateRoutes />
            </div> 
            </> )}>
            <Route element={ <FilesView searchResults={[searchString, searchResults, totalPages]} /> } path="/" exact />
          </Route>
          <Route element={ <Login /> } path="/login" />
          <Route element={ <Register /> } path="/register" />
        </Routes>
      </Router>
    </div>
  )
}

export default App
