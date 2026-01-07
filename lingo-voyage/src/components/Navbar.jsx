import { useNavigate } from 'react-router-dom';
import AccountMenu from './AccountMenu.jsx';
import { useState } from 'react';
import { User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';

function Navbar() {
  const { user } = useAuth();
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate('/')}>LingoVoyage</div>
      <div className="navbar-buttons">
        <div className="navbar-profile-icon" onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}><User /></div>
        <AccountMenu isOpen={isAccountMenuOpen} closeMenu={() => setIsAccountMenuOpen(false)} user={user} />
      </div>
    </nav>
  );
}

export default Navbar;
