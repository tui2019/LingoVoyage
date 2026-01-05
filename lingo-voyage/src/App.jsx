import { Routes, Route } from 'react-router-dom';
import './App.css'
import Home from './pages/Home.jsx'
import Settings from './pages/Settings.jsx'
import Navbar from './components/Navbar.jsx'
import QuizNavbar from './components/QuizNavbar.jsx';
import WordsInContext from './pages/WordsInContext.jsx';
import Practice from './pages/Practice.jsx';
import LearnFromVideos from './pages/LearnFromVideos.jsx';

function App() {
  // const [currentPage, setCurrentPage] = useState('home');

  return (
    <div>
          <main>
            <Routes>
              <Route path="/" element={<><Navbar /><Home /></>} />
              <Route path="/settings" element={<><Navbar /><Settings /></>} />
              <Route path="/words_in_context" element={<><QuizNavbar /><WordsInContext /></>} />
              <Route path="/practice" element={<><QuizNavbar /><Practice /></>} />
              <Route path="/words_from_videos" element={<><QuizNavbar /><LearnFromVideos /></>} />
            </Routes>
          </main>
        </div>
  )
}

export default App
