import { useUser } from 'src/context/UserContext'

import { Outlet, Navigate } from 'react-router-dom'

const PrivateRoutes = () => {
  const { user } = useUser()
    
  return (
    user ? <Outlet /> : <Navigate to="/login" />
  )
}

export default PrivateRoutes