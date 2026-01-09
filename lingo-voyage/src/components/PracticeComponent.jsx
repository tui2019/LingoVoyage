import { useState } from 'react';

function PracticeComponent({ word, setCorrectCount, reverse = false, isLastQuestion, nextQuestion, showResults }) {
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleCheck = () => {
    // If already answered, go to next question or show results
    if (feedback === 'correct') {
      if (isLastQuestion) {
        showResults();
      } else {
        nextQuestion();
      }
      return;
    }

    const normalizedUserAnswer = userAnswer.trim().toLowerCase();

    // In reverse mode, check against word; in normal mode, check against meaning
    const normalizedCorrectAnswer = reverse
      ? word.word.trim().toLowerCase()
      : word.meaning.trim().toLowerCase();

    // Split by "/" to get all acceptable answers
    const acceptableAnswers = normalizedCorrectAnswer
      .split('/')
      .map(answer => answer.trim())
      .filter(answer => answer.length > 0);

    // Check if user's answer matches any of the acceptable answers
    const isCorrect = acceptableAnswers.some(acceptable => {
      // Exact match
      if (normalizedUserAnswer === acceptable) return true;

      // Check if user answer matches without articles
      const withoutArticles = (str) => str.replace(/^(the|a|an|der|die|das|ein|eine)\s+/i, '').trim();
      if (withoutArticles(normalizedUserAnswer) === withoutArticles(acceptable)) return true;

      // Check if acceptable answer contains user's answer (for longer explanations)
      if (acceptable.includes(normalizedUserAnswer) && normalizedUserAnswer.length > 3) return true;

      return false;
    });

    if (isCorrect) {
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }
  };

  const handleRevealAnswer = () => {
    setShowAnswer(true);
    if (feedback !== 'correct') {
      setCorrectCount(prev => prev - 1);
    }
  };

  const handleInputChange = (e) => {
    setUserAnswer(e.target.value);
    // Reset feedback when user starts typing again
    if (feedback) {
      setFeedback('');
    }
  };

  // Determine what to show and what to ask for
  const questionText = reverse ? word.meaning : word.word;
  const promptText = reverse ? "What is this word?" : "What does this word mean?";
  const answerText = reverse ? word.word : word.meaning;

  // Determine button text
  const getButtonText = () => {
    if (feedback !== 'correct') return 'Check Answer';
    if (isLastQuestion) return 'Show Results';
    return 'Next →';
  };

  return (
    <div style={{
      border: '2px solid #ddd',
      borderRadius: '8px',
      padding: '30px',
      marginBottom: '20px',
    }}>
      <h3 style={{ fontSize: '2em', marginBottom: '20px' }}>
        {questionText}
      </h3>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
          {promptText}
        </label>
        <input
          type="text"
          value={userAnswer}
          onChange={handleInputChange}
          placeholder="Type your answer..."
          disabled={feedback === 'correct'}
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '16px',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        />
      </div>

      {/* Feedback message */}
      {feedback === 'correct' && (
        <p style={{ color: 'green', fontWeight: 'bold', marginBottom: '10px' }}>
          ✅ Correct!
        </p>
      )}
      {feedback === 'incorrect' && (
        <p style={{ color: 'red', fontWeight: 'bold', marginBottom: '10px' }}>
          ❌ Not quite. Try again or reveal the answer.
        </p>
      )}

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={handleCheck}
          disabled={!userAnswer.trim() && feedback !== 'correct'}
          style={{
            padding: '10px 20px',
            cursor: (userAnswer.trim() || feedback === 'correct') ? 'pointer' : 'not-allowed',
            opacity: (userAnswer.trim() || feedback === 'correct') ? 1 : 0.5,
            backgroundColor: feedback === 'correct' ? '#2196F3' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          {getButtonText()}
        </button>

          <button
            onClick={handleRevealAnswer}
            style={{
              padding: '10px 20px',
              cursor: 'pointer',
              backgroundColor: '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Reveal Answer
          </button>
      </div>

      {/* Show answer section */}
      {showAnswer && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          borderRadius: '4px'
        }}>
          <p><strong>Answer:</strong> {answerText}</p>
        </div>
      )}
    </div>
  );
}

export default PracticeComponent;
