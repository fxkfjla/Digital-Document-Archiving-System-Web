import 'src/styles/shared.sass'
import 'src/App.sass'

import Header from 'src/components/header/Header'
import FilesView from 'src/components/file/FilesView'
import Login from 'src/components/auth/Login'
import { useUser } from 'src/context/UserContext'

function App() {
  const { user } = useUser()

  return (
    <div className='App'>
    {
      user ? (
        <>
          <Header />
          <div className="App__Main">
            <FilesView />
          </div>
        </>
      ) : (
        <>
          <Login />
        </>
      )
    }
    </div> 
  )
}

export default App
