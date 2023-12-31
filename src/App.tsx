import { useAuth0 } from '@auth0/auth0-react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { PageLoading } from './component/PageLoader'
import { AuthenticationGuard } from './component/AuthenticationGuard'
import { ProfilePage } from './page/ProfilePage'
import AttractionList from './page/AttractionList'
import AttractionDetail from './page/AttractionDetail'
import Passport from './page/Passport'
import { CallbackPage } from './page/CallbackPage'
import { NotFoundPage } from './page/NotFound'
import { StampPage } from './page/StampEditPage'

import './App.css'

export const App = () => {
  const { isLoading } = useAuth0()

  if (isLoading) {
    return (
      <div className='page-layout'>
        <PageLoading />
      </div>
    )
  }
  const DefaultNavigate = <Navigate to='/place' />

  return (
    <Routes>
      <Route path='/' element={DefaultNavigate} />
      <Route path='/place' element={<AttractionList />} />
      <Route path='/place/:placeId' element={<AttractionDetail />} />
      <Route path='/passport/share/:shareUserId' element={<Passport />} />
      <Route
        path='/passport'
        element={<AuthenticationGuard component={Passport} />}
      />
      <Route
        path='/profile'
        element={<AuthenticationGuard component={ProfilePage} />}
      />
      <Route
        path='/stamp'
        element={<AuthenticationGuard component={StampPage} />}
      />
      <Route
        path='/stamp/:stampId'
        element={<AuthenticationGuard component={StampPage} />}
      />
      <Route path='/callback' element={<CallbackPage />} />
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  )
}
