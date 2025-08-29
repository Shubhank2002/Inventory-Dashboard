import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Login from './Components/Login'
import Signup from './Components/Signup'
import Email_validation from './Components/Forgot_password/Email_validation'
import Otp_validation from './Components/Forgot_password/Otp_validation'
import Create_New_password from './Components/Forgot_password/Create_New_password'
import Home from './Components/Home/Home'
import Setting from './Components/Setting/Setting'
import Dashboard from './Components/Dashboard'
import IndividualProduct from './Components/Product/IndividualProduct'

function App() {
  

  return (
    <>
      <Router>
        <Routes>
          <Route index element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/email_validation' element={<Email_validation/>}/>
          <Route path='/otp_validation' element={<Otp_validation/>}/>
          <Route path='/create_new_password' element={<Create_New_password/>}/>
          <Route path='/home' element={<Home/>}/>
          <Route path='/setting' element={<Setting/>}/>
          <Route path='/dashboard/:name' element={<Dashboard/>}/>
          <Route path='/dashboard/:name/individual-product' element={<IndividualProduct/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
