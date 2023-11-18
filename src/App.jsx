import 'src/styles/shared.sass'
import 'src/App.sass'
import Header from 'src/components/header/Header'
import FilesView from 'src/components/file/FilesView'
import Login from 'src/components/auth/Login'
import Register from 'src/components/auth/Register'
import PrivateRoutes from 'src/utils/PrivateRoutes'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {

  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route element={( <>
            <Header /> 
            <div className="App__Main">
              <PrivateRoutes />
            </div> 
            </> )}>
            <Route element={ <FilesView />} path="/" exact />
          </Route>
          <Route element={ <Login /> } path="/login" />
          <Route element={ <Register /> } path="/register" />
        </Routes>
      </Router>
    </div>
    // <div className='App'>
    //   <Router>
    //     <div className="App__Main">
    //       <Routes>
    //         <Route element={ <PrivateRoutes /> }>
    //           <Route element={ <Header /> } path="/" />
    //           <Route element={ <FilesView />} path="/" exact />
    //         </Route>
    //       </Routes>
    //     </div>
    //     <Routes>
    //       <Route element={ <Login /> } path="/login" />
    //       <Route element={ <Register /> } path="/register" />
    //     </Routes>
    //   </Router>
    // </div>
    // <div className='App'>
    // {
    //   user ? (
    //     <>
    //       <Header />
    //       <div className="App__Main">
    //         <FilesView />
    //       </div>
    //     </>
    //   ) : (
    //     <>
    //       <Login />
    //     </>
    //   )
    // }
    // </div> 
  )
}

export default App
