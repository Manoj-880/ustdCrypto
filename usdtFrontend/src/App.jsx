import React from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/startingPages/login';
import Register from './pages/startingPages/register';
import UserLayout from './pages/userPages/userLayout';
import AdminLayout from './pages/adminPages/adminLayout';
import ProtectedRoute from './pages/protectedRoute'; // ✅ create inside components folder

function App() {
  return (
    <>
      <div className="app col-sm-12">
        <Router>
          {/* <ToastContainer position='top-right' autoClose={3000} /> */}
            <Routes>
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/admin/*' element={<AdminLayout />} />

              {/* Protected user routes */}
              <Route
                path='/*'
                element={
                  <ProtectedRoute>
                    <UserLayout />
                  </ProtectedRoute>
                }
              />
            </Routes>
        </Router>
      </div>
    </>
  )
}

export default App