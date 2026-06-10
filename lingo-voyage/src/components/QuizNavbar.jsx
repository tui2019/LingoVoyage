import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/Navbar.css';

const QuizNavbar = () => {
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

  const handleQuit = () => {
    navigate('/');
  };

  return (
    <nav className="v-nav" ref={navRef} style={{ justifyContent: 'flex-end' }}>
      <div className="v-nav-glow" ref={glowRef}></div>
      <div
        className="v-logo"
        style={{
          opacity: 0.15,
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
          whiteSpace: 'nowrap'
        }}
      >
        LingoVoyage
      </div>

      <button
        type="button"
        className="v-btn v-btn-gray"
        onClick={handleQuit}
        style={{
          width: 'auto',
          height: '38px',
        }}
      >
        Quit
      </button>
    </nav>
  );
};

export default QuizNavbar;
