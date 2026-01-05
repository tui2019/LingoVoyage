import { useNavigate } from 'react-router-dom';

function Navbar({ user }) {

  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <div className="navbar-logo">LingoVoyage</div>
      <div className="navbar-buttons">
        <button onClick={() => navigate('/')}>Home</button>
        <button onClick={() => navigate('/settings')}>Settings</button>
        {user ? (
            <span>Welcome, {user.username}</span>
          ) : (
            <button onClick={() => navigate('/login')}>Login</button>
          )}
      </div>
    </nav>
  );
}

export default Navbar;
