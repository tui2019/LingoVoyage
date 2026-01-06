import { createBrowserRouter, RouterProvider, Outlet, useLoaderData } from 'react-router-dom';
import { useState } from 'react'
import { checkAuth } from './utils/auth.js';
import { AuthContext } from './contexts/AuthContext';
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


function AuthLayout() {
  const initialUser = useLoaderData();

  const [user, setUser] = useState(initialUser);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Outlet />
    </AuthContext.Provider>
  );
}

const routes = createBrowserRouter([
  {
    element: <AuthLayout />,
    loader: checkAuth,
    children: [
      {
        path: "/",
        loader: checkAuth,
        element: <><Navbar /><Home /></>,
      },
      {
        path: "/settings",
        loader: checkAuth,
        element: <><Navbar /><Settings /></>,
      },
      {
        path: "/words_in_context",
        loader: checkAuth,
        element: <><QuizNavbar /><WordsInContext /></>,
      },
      {
        path: "/practice",
        loader: checkAuth,
        element: <><QuizNavbar /><Practice /></>,
      },
      {
        path: "/words_from_videos",
        loader: checkAuth,
        element: <><Navbar /><LearnFromVideos /></>,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
]);




function App() {
  return <RouterProvider router={routes} />;
}

export default App
