import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Login  from './pages/login'
import Profile from './pages/profile'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
