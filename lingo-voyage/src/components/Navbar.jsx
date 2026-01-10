import { useNavigate } from 'react-router-dom';
import AccountMenu from './AccountMenu.jsx';
import { useState } from 'react';
import { User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import './NavbarSVG.css';

function Navbar() {
  const { user } = useAuth();
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate('/')}>
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="lingo-voyage-svg">
          <defs>
            <linearGradient id="gradSunsetFinalFixed" x1="18" y1="138" x2="158" y2="38" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FF5F6D"/>
              <stop offset="100%" stopColor="#FFC371"/>
            </linearGradient>
            <linearGradient id="gradBendDirectFixed" x1="38" y1="118" x2="63" y2="153" gradientUnits="userSpaceOnUse">
              <stop offset="30%" stopColor="#FF5F6D"/>
              <stop offset="85%" stopColor="#0575E6"/>
            </linearGradient>
          </defs>
          <g id="LingoVoyage-Smooth-Spin">
            <rect x="10" y="10" width="180" height="180" rx="30" fill="#242424"/> {/*#FFF8F0*/}
            <g className="l-letter-group">
              <path d="M38,81 L38,133 C38,144.046 46.954,153 58,153 L117,153" stroke="url(#gradBendDirectFixed)" strokeWidth="16" strokeLinecap="butt" strokeLinejoin="round"/>
              <path d="M38,53 L29.76,83 L46.24,83 Z" fill="#FF5F6D"/>
              <path d="M145,153 L115,144.76 L115,161.24 Z" fill="#0575E6"/>
            </g>
            <path className="v-path" d="M143,73 L108,123 L73,73" stroke="url(#gradSunsetFinalFixed)" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/>
            <g transform="translate(123, 38)">
              <g className="bubble-animator" opacity="0.9">
                <path d="M25,0 C11.193,0 0,9.85 0,22 C0,34.15 11.193,44 25,44 C27.5,44 30,43.5 32.3,42.8 L45,50 L42.5,38.5 C47.5,34 50,28.5 50,22 C50,9.85 38.807,0 25,0 Z" fill="url(#gradSunsetFinalFixed)"/>
                <circle cx="15" cy="22" r="3" fill="white"/>
                <circle cx="25" cy="22" r="3" fill="white"/>
                <circle cx="35" cy="22" r="3" fill="white"/>
              </g>
            </g>
          </g>
        </svg>

      </div>
      <div className="navbar-buttons">
        <div className="navbar-profile-icon" onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}><User /></div>
        <AccountMenu isOpen={isAccountMenuOpen} closeMenu={() => setIsAccountMenuOpen(false)} user={user} />
      </div>
    </nav>
  );
}

export default Navbar;
