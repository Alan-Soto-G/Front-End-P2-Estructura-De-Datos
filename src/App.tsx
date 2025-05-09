import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Login  from './pages/login'

import UserRoute from './pages/userRoute';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/userRoute" element={<UserRoute/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
