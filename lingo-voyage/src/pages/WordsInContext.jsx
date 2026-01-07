import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function WordsInContext() {
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
      <div>
          <h1>Words In Context Page</h1>
          <p>Word in context: {topic.title}</p>
      </div>
  );
}

export default WordsInContext;
