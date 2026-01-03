import { useNavigate } from 'react-router-dom';

function Navbar() {

  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <div className="navbar-logo">LingoVoyage</div>
      <div className="navbar-buttons">
        <button onClick={() => navigate('/')}>Home</button>
        <button onClick={() => navigate('/settings')}>Settings</button>
      </div>
    </nav>
  );
}

export default Navbar;
