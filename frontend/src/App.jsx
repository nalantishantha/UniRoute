import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Universities from './components/Universities'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/universities" element={<Universities />} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path= "/register" element={<RegisterPage></RegisterPage>}/>
      </Routes>
    </Router>
  )
}

export default App