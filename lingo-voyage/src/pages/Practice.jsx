import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ExerciseResults from "../components/ExerciseResults.jsx";
import PracticeComponent from "../components/PracticeComponent.jsx";

function Practice() {
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
          const response = await fetch(`http://localhost:4000/api/topics/${topic._id}/words`, { credentials: "include" });
          if (!response.ok) {
            navigate('/', { replace: true });
          }
          const data = await response.json();
          setWords(data);
          setCorrectCount(data.length*2);
        }
        catch (error) {
          console.error("Error fetching words:", error);
          navigate('/', { replace: true });
        }
        finally {
          setLoading(false);
        }
      }
    }
    fetchWords();
  }, [topic, navigate]);

  if (!topic) return null;
  if (loading) return <div>Loading...</div>;

  // const currentWord = words[currentIndex];
  // const isLastWord = currentIndex === words.length - 1;

  const totalQuestions = words.length * 2;
  const isReverse = currentIndex >= words.length;
  const wordIndex = isReverse ? currentIndex - words.length : currentIndex;
  const actualWord = words[wordIndex];
  const isLastQuestion = currentIndex === totalQuestions - 1;


  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentIndex(currentIndex + 1);
    }
  };


  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
          <h2>Practice: {topic.title}</h2>
          <p style={{ color: '#666' }}>Word {currentIndex + 1} of {totalQuestions}</p>

      <PracticeComponent word={actualWord} setCorrectCount={setCorrectCount} reverse={isReverse} key={`${actualWord._id}-${isReverse}`} isLastQuestion={isLastQuestion} nextQuestion={handleNext} showResults={() => setShowResults(true)} />
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between' }}>
        {/* {isLastQuestion ? (<button onClick={} disabled={!answered}>Show Results</button>) : (<button onClick={handleNext} disabled={!answered}>
               Next →
             </button>)}*/}
      </div>
      <ExerciseResults
              visible={showResults}
              score={correctCount}
              total={totalQuestions}
              onClose={() => navigate('/')}
            />
         </div>
  );
}

export default Practice;
