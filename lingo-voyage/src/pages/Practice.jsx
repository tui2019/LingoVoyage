import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Practice() {
  const location = useLocation();
  const navigate = useNavigate();
  const topic = location.state?.topic;
  useEffect(() => {
    if (!topic) {
      navigate('/', { replace: true });
    }
  }, [topic, navigate]);

  if (!topic) return null;

  return (
    <div className="practice-page">
      <h1>Practice Page</h1>
      <p>Practicing topic: {topic.title}</p>
    </div>
  );
}

export default Practice;
