import { useNavigate } from 'react-router-dom';

function QuizNavbar() {

  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate('/')}>LingoVoyage</div>      <div className="navbar-buttons">
        <button onClick={() => navigate('/')}>Quit</button>
      </div>
    </nav>
  );
}

export default QuizNavbar;
