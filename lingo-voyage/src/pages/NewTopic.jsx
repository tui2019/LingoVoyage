import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function NewTopic() {
  const navigate = useNavigate();

  const [topic, setTopic] = useState('');
  const [entryMode, setEntryMode] = useState('ai'); // 'ai' or 'manual'
  const [comment, setComment] = useState('');
  const [words, setWords] = useState(['']); // Start with one empty word field

  const handleWordChange = (index, value) => {
    const newWords = [...words];
    newWords[index] = value;

    // If user types in the last field and we haven't reached 10 fields yet, add a new empty field
    if (index === words.length - 1 && value.trim() !== '' && words.length < 10) {
      newWords.push('');
    }

    setWords(newWords);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      topic,
      entryMode,
      ...(entryMode === 'ai' ? { comment } : { words: words.filter(w => w.trim() !== '') })
    };
    try {
      const response = await fetch('http://localhost:4000/api/topics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const data = await response.json();
        navigate('/', { state: { topic: data.topic } });
      } else {
        console.error('Failed to create topic');
      }
    } catch (error) {
      console.error('Error creating topic:', error);
    }

  };

  const formStyle = {
    maxWidth: '500px',
    margin: '40px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    fontFamily: 'sans-serif'
  };

  const fieldStyle = {
    marginBottom: '20px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    boxSizing: 'border-box',
    borderRadius: '4px',
    border: '1px solid #ccc'
  };

  return (
    <div style={formStyle}>
      <h1>Create a New Topic</h1>
      <form onSubmit={handleSubmit}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Topic</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
            placeholder="e.g., Travel Vocabulary"
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Generation Mode</label>
          <div style={{ display: 'flex', gap: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', fontWeight: 'normal' }}>
              <input
                type="radio"
                name="entryMode"
                value="ai"
                checked={entryMode === 'ai'}
                onChange={() => setEntryMode('ai')}
                style={{ marginRight: '8px' }}
              />
              AI Generation
            </label>
            <label style={{ display: 'flex', alignItems: 'center', fontWeight: 'normal' }}>
              <input
                type="radio"
                name="entryMode"
                value="manual"
                checked={entryMode === 'manual'}
                onChange={() => setEntryMode('manual')}
                style={{ marginRight: '8px' }}
              />
              Manual Entry
            </label>
          </div>
        </div>

        {entryMode === 'ai' ? (
          <div style={fieldStyle}>
            <label style={labelStyle}>Comment (Instructions for AI)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g., Focus on formal greetings and business etiquette."
              style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
            />
          </div>
        ) : (
          <div style={fieldStyle}>
            <label style={labelStyle}>Words (Max 10)</label>
            {words.map((word, index) => (
              <div key={index} style={{ marginBottom: '8px' }}>
                <input
                  type="text"
                  value={word}
                  onChange={(e) => handleWordChange(index, e.target.value)}
                  placeholder={`Word ${index + 1}`}
                  style={inputStyle}
                />
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Generate and Save
        </button>
      </form>
    </div>
  );
}

export default NewTopic;
