import React, { useState, useRef, useEffect } from 'react';

/**
 * WICPracticeComponent
 * Handles multiple blanks independently using arrays for state.
 * Each input field auto-expands based on its specific content.
 * Improved validation compares the reconstructed sentence to the correct example.
 */
function WICPracticeComponent({ word, setCorrectCount, isLastQuestion, nextQuestion, showResults }) {
  // 1. Identify how many gaps (___) are in the sentence
  const parts = word.exampleWithGaps1.split('___');
  const numGaps = parts.length - 1;

  // 2. Initialize states as arrays to keep inputs independent
  const [userAnswers, setUserAnswers] = useState(Array(numGaps).fill(''));
  const [inputWidths, setInputWidths] = useState(Array(numGaps).fill('60px'));

  const [showAnswer, setShowAnswer] = useState(false);
  const [feedback, setFeedback] = useState('');

  // Ref for the hidden mirror used to calculate text width
  const mirrorRef = useRef(null);

  // 3. Update widths for all inputs whenever any answer changes
  useEffect(() => {
    if (mirrorRef.current) {
      const newWidths = userAnswers.map((val) => {
        // Measure the current value or a short placeholder string
        mirrorRef.current.textContent = val || "type...";
        // Add 8px buffer for padding and to prevent jitter
        return `${mirrorRef.current.offsetWidth + 8}px`;
      });
      setInputWidths(newWidths);
    }
  }, [userAnswers]);

  const handleCheck = () => {
    // If correct, navigate to next
    if (feedback === 'correct') {
      if (isLastQuestion) {
        showResults();
      } else {
        nextQuestion();
      }
      return;
    }

    // Normalization helper to make matching more robust (ignores case, punctuation, and extra whitespace)
    const normalize = (str) =>
      str.toLowerCase()
         .replace(/[.,!?;:]/g, '') // Remove basic punctuation
         .replace(/\s+/g, ' ')      // Normalize multiple spaces to one
         .trim();

    // Validation Logic:
    // We check against both the infinitive list (word.word)
    // AND the full example sentence (word.exampleSentence1)

    // 1. Reconstruct the sentence with user inputs
    const reconstructedSentence = parts.reduce((acc, part, i) => {
      return acc + part + (userAnswers[i] || '');
    }, '');

    const isSentenceMatch = normalize(reconstructedSentence) === normalize(word.exampleSentence1);

    // 2. Fallback: Check if the combined answers match the infinitive 'word.word'
    const combinedUserAnswer = userAnswers.map(a => a.trim()).join(' ').toLowerCase();
    const normalizedCorrectAnswer = word.word.trim().toLowerCase();
    const acceptableAnswers = normalizedCorrectAnswer.split('/').map(a => a.trim().toLowerCase());

    const isWordMatch = acceptableAnswers.some(acceptable => {
      if (combinedUserAnswer === acceptable) return true;
      const withoutArticles = (str) => str.replace(/^(the|a|an|der|die|das|ein|eine)\s+/i, '').trim();
      return withoutArticles(combinedUserAnswer) === withoutArticles(acceptable);
    });

    if (isSentenceMatch || isWordMatch) {
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }
  };

  const handleInputChange = (index, value) => {
    // Create a copy of the array and update only the specific index
    const updatedAnswers = [...userAnswers];
    updatedAnswers[index] = value;
    setUserAnswers(updatedAnswers);

    if (feedback) {
      setFeedback('');
    }
  };

  const handleRevealAnswer = () => {
    setShowAnswer(true);
    if (feedback !== 'correct') {
      setCorrectCount(prev => prev - 1);
    }
  };

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
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h3 style={{ fontSize: '2em', marginBottom: '20px' }}>
        {word.meaning}
      </h3>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
          Fill in the blank:
        </label>

        <div style={{
          fontSize: '1.2em',
          padding: '15px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          marginBottom: '15px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '5px',
          lineHeight: '1.6'
        }}>
          {/* Shared hidden mirror element for width calculation */}
          <span
            ref={mirrorRef}
            style={{
              position: 'absolute',
              visibility: 'hidden',
              whiteSpace: 'pre',
              fontSize: '1em',
              fontFamily: 'inherit'
            }}
          ></span>

          {parts.map((part, index) => (
            <React.Fragment key={index}>
              <span>{part}</span>
              {index < numGaps && (
                <input
                  type="text"
                  value={userAnswers[index]}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  disabled={feedback === 'correct'}
                  autoFocus={index === 0}
                  style={{
                    padding: '2px 4px',
                    fontSize: '1em',
                    border: 'none',
                    borderBottom: feedback === 'correct' ? '2px solid #4CAF50' : '2px solid #2196F3',
                    backgroundColor: 'transparent',
                    cursor: feedback === 'correct' ? 'not-allowed' : 'text',
                    width: inputWidths[index],
                    outline: 'none',
                    transition: 'width 0.1s ease-out',
                    fontFamily: 'inherit',
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {feedback === 'correct' && (
        <p style={{ color: 'green', fontWeight: 'bold', marginBottom: '10px' }}>
          ✅ Correct!
        </p>
      )}
      {feedback === 'incorrect' && (
        <p style={{ color: 'red', fontWeight: 'bold', marginBottom: '10px' }}>
          ❌ Not quite. Try again.
        </p>
      )}

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button
          onClick={handleCheck}
          disabled={!userAnswers.some(a => a.trim()) && feedback !== 'correct'}
          style={{
            padding: '10px 20px',
            cursor: 'pointer',
            backgroundColor: feedback === 'correct' ? '#2196F3' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            opacity: (!userAnswers.some(a => a.trim()) && feedback !== 'correct') ? 0.5 : 1
          }}
        >
          {getButtonText()}
        </button>

        {feedback !== 'correct' && (
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
        )}
      </div>

      {showAnswer && (
        <div style={{
          marginTop: '10px',
          padding: '15px',
          borderRadius: '4px',
          borderLeft: '4px solid #FF9800'
        }}>
          <p><strong>Answer:</strong> {word.word}</p>
          <p style={{ marginTop: '10px', fontSize: '0.9em', color: '#666' }}>
            <strong>Full sentence:</strong> {word.exampleSentence1}
          </p>
        </div>
      )}
    </div>
  );
}

export default WICPracticeComponent;
