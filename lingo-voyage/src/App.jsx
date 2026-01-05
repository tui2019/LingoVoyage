import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css'
import Home from './pages/Home.jsx'
import Settings from './pages/Settings.jsx'
import Navbar from './components/Navbar.jsx'
import QuizNavbar from './components/QuizNavbar.jsx';
import WordsInContext from './pages/WordsInContext.jsx';
import Practice from './pages/Practice.jsx';
import LearnFromVideos from './pages/LearnFromVideos.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import { useState, useEffect } from 'react';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetch("http://localhost:4000/api/check-auth", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setUser(data.user);
        } else {
          setUser(null);
          if (location.pathname !== '/login' && location.pathname !== '/register') {
            navigate('/login');
          }
        }
      })
      .catch((err) => {
        console.log("Auth check failed:", err.message);
        setUser(null);
      });
  }, []);


  return (
    <div>
          <main>
            <Routes>
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route path="/register" element={<Register setUser={setUser} />} />

              <Route path="/" element={<><Navbar user={user} /><Home /></>} />
              <Route path="/settings" element={<><Navbar user={user} /><Settings /></>} />
              <Route path="/words_in_context" element={<><QuizNavbar /><WordsInContext /></>} />
              <Route path="/practice" element={<><QuizNavbar /><Practice /></>} />
              <Route path="/words_from_videos" element={<><Navbar user={user} /><LearnFromVideos /></>} />
            </Routes>
          </main>
        </div>
  )
}

export default App
