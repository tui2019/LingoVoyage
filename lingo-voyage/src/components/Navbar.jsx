import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import AccountMenu from './AccountMenu.jsx';
import '../assets/Navbar.css';

function Navbar() {
  const { user } = useAuth();
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const navigate = useNavigate();
  const navRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const navbar = navRef.current;
    const glow = glowRef.current;

    if (!navbar || !glow) return;

    const handleMouseMove = (e) => {
      const rect = navbar.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const percentage = (x / rect.width) * 100;

      // Calculate intensity based on distance from top (0 to 1)
      const maxDistance = rect.height;
      const intensity = Math.max(0, 1 - (y / maxDistance));

      navbar.style.setProperty('--mouse-x', `${percentage}%`);
      navbar.style.setProperty('--shine-intensity', intensity);
      glow.style.setProperty('--mouse-x', `${percentage}%`);
      glow.style.setProperty('--shine-intensity', intensity);
    };

    navbar.addEventListener('mousemove', handleMouseMove);

    return () => {
      navbar.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <nav className="v-nav" ref={navRef}>
      <div className="v-nav-glow" ref={glowRef}></div>
      <div className="v-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        LingoVoyage
      </div>
      <div className="v-profile-circle" onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}>
        <User size={20} />
      </div>
      <AccountMenu isOpen={isAccountMenuOpen} closeMenu={() => setIsAccountMenuOpen(false)} user={user} />
    </nav>
  );
}

export default Navbar;
