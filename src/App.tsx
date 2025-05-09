import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Login  from './pages/login'
import Profile from './pages/userProfile'
import UserRoute from './pages/userRoute';
import GraphMap from './components/graphMap';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/userRoute" element={<UserRoute />} />
        <Route path="/map" element={<GraphMap/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
