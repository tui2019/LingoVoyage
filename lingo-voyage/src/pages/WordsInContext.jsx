import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ExerciseResults from "../components/ExerciseResults.jsx";
import WICPracticeComponent from "../components/WICPracticeComponent.jsx";

function WordsInContext() {
  const location = useLocation();
  const navigate = useNavigate();
  const [words, setWords] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [correctCount, setCorrectCount] = useState(0);
  const topic = location.state?.topic;

  useEffect(() => {
    async function fetchWords() {
      if (!topic) {
        navigate('/', { replace: true });
      } else {
        try {
          const response = await fetch(
            `http://localhost:4000/api/topics/${topic._id}/words`,
            { credentials: "include" }
          );
          if (!response.ok) {
            navigate('/', { replace: true });
          }
          const data = await response.json();
          setWords(data);
          setCorrectCount(data.length); // Only one pass
        } catch (error) {
          console.error("Error fetching words:", error);
          navigate('/', { replace: true });
        } finally {
          setLoading(false);
        }
      }
    }
    fetchWords();
  }, [topic, navigate]);

  if (!topic) return null;
  if (loading) return <div>Loading...</div>;

  const currentWord = words[currentIndex];
  const isLastQuestion = currentIndex === words.length - 1;

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <title>LingoVoyage - Practice</title>
      <h2>Words in Context: {topic.title}</h2>
      <p style={{ color: '#666' }}>Word {currentIndex + 1} of {words.length}</p>

      <WICPracticeComponent
        word={currentWord}
        setCorrectCount={setCorrectCount}
        key={currentWord._id}
        isLastQuestion={isLastQuestion}
        nextQuestion={handleNext}
        showResults={() => setShowResults(true)}
      />

      <ExerciseResults
        visible={showResults}
        score={correctCount}
        total={words.length}
        onClose={() => navigate('/')}
      />
    </div>
  );
}

export default WordsInContext;
