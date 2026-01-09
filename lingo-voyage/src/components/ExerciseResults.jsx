import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

function ExerciseResults({ score, total, onClose, visible }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const percentage = (score / total) * 100;

  useEffect(() => {
    // Start animation after mount
    setTimeout(() => setIsAnimating(true), 100);
  }, []);

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  if (!visible) return null;

  return createPortal(
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: '#1a1a1a',
        border: '1px solid #333',
        borderRadius: '1rem',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        padding: '40px',
        textAlign: 'center',
        maxWidth: '350px',
        width: '90%'
      }}>
        <h2 style={{ marginBottom: '30px', color: '#fff' }}>Results</h2>

        {/* Circular Progress */}
        <div style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto 30px' }}>
          <svg width="200" height="200" style={{ transform: 'rotate(-90deg)' }}>
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="#e0e0e0"
              strokeWidth="12"
            />
            {/* Progress circle */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke={percentage >= 70 ? '#4CAF50' : percentage >= 40 ? '#FF9800' : '#f44336'}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={isAnimating ? offset : circumference}
              style={{
                transition: 'stroke-dashoffset 1.5s ease-out'
              }}
            />
          </svg>

          {/* Score text in center */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '2.5em',
            fontWeight: 'bold',
            color: '#fff'
          }}>
            {score}/{total}
          </div>
        </div>

        {/* Percentage */}
        <p style={{ fontSize: '1.5em', color: '#ccc', marginBottom: '20px' }}>
          {Math.round(percentage)}%
        </p>

        {/* Message based on score */}
        <p style={{ fontSize: '1.2em', marginBottom: '30px', color: '#ddd' }}>

          {percentage >= 90 ? '🎉 Excellent!' :
           percentage >= 70 ? '👍 Great job!' :
           percentage >= 50 ? '👌 Good effort!' :
           '💪 Keep practicing!'}
        </p>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            padding: '12px 40px',
            fontSize: '1.1em',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#1976D2'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#2196F3'}
        >
          Close
        </button>
      </div>
    </div>,
    document.body
  );
}

export default ExerciseResults;
