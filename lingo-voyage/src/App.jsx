import { createBrowserRouter, RouterProvider, Outlet, useLoaderData } from 'react-router-dom';
import { useState } from 'react'
import { checkAuth, getUserData } from './utils/auth.js';
import { fetchTopics } from './utils/topics.js';
import { AuthContext } from './contexts/AuthContext';
import './App.css'
import Home from './pages/Home.jsx'
import Settings from './pages/Settings.jsx'
import Navbar from './components/Navbar.jsx'
import QuizNavbar from './components/QuizNavbar.jsx';
import WordsInContext from './pages/WordsInContext.jsx';
import Practice from './pages/Practice.jsx';
import LearnFromVideos from './pages/LearnFromVideos.jsx';
import NewTopic from './pages/NewTopic.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';


function RootLayout() {
  const initialUser = useLoaderData();

  const [user, setUser] = useState(initialUser);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Outlet />
    </AuthContext.Provider>
  );
}

function RegularLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function QuizLayout() {
  return (
    <>
      <QuizNavbar />
      <Outlet />
    </>
  );
}

const routes = createBrowserRouter([
  {
    element: <RootLayout />,
    loader: getUserData,
    path: "/",
    children: [
      {
        // Routes with regular Navbar
        element: <RegularLayout />,
        loader: checkAuth,
        children: [
          {
            index: true,
            element: <Home />,
            loader: fetchTopics,
          },
          {
            path: "settings",
            element: <Settings />,
          },
          {
            path: "words_from_videos",
            element: <LearnFromVideos />,
          },
          {
            path: "new_topic",
            element: <NewTopic />,
          },
        ],
      },
      {
        // Routes with QuizNavbar
        element: <QuizLayout />,
        loader: checkAuth,
        children: [
          {
            path: "words_in_context",
            element: <WordsInContext />,
          },
          {
            path: "practice",
            element: <Practice />,
          },
        ],
      },
      {
        // Public routes
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
]);




function App() {
  return <RouterProvider router={routes} />;
}

export default App
