import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpenText, MessageCircleMore, Brain, NotebookPen } from "lucide-react";
import TopicPicker from '../components/TopicPicker.jsx';

function Home() {
  const [selectedTopic, changeSelectedTopic] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const topics = ['Travel', 'Food', 'Culture', 'Technology', 'Business', 'Health', 'Education', 'Entertainment', 'Sports', 'Environment', 'History', 'Art', 'Science', 'Politics', 'Fashion', 'Music', 'Literature', 'Philosophy', 'Psychology', 'Economics', 'Religion', 'Languages', 'Nature', 'Photography', 'Cinema', 'Theater', 'Architecture', 'Design', 'Fitness', 'Wellness', 'Adventure', 'Relationships', 'Hobbies', 'DIY', 'Gardening', 'Cooking', 'Parenting', 'Travel Tips', 'World News', 'Current Events', 'Social Issues', 'Innovation', 'Startups'];

  const handleTopicChange = (topic) => {
    changeSelectedTopic(topic);
    setIsOpen(false);
  }

  const navigate = useNavigate();
  return (
    <div className="home-layout">

      <div className="home-content-left">
        <h1 className="huge-welcome">Welcome to LingoVoyage</h1>

        <div className="topic-section">
          <h2>Pick a Topic</h2>
          <div className="topic-picker">
            <button className={`topic-button ${selectedTopic === null && "topic-not-selected"}`} onClick={() => setIsOpen(true)}>
                {selectedTopic ? selectedTopic : 'Select Topic'}
              </button>
          </div>
        </div>
      </div>

      <div className={`home-content-right ${selectedTopic ? '' : 'home-content-right-disabled'}`}>
        <div onClick={() => navigate('/new_words')} className="lesson-button lesson-button-1"><BookOpenText className="lesson-button-icon" /><span className="lesson-button-text">Learn words</span></div>
        <div onClick={() => navigate('/words_in_context')} className="lesson-button lesson-button-2"><MessageCircleMore className="lesson-button-icon" /><span className="lesson-button-text">Words in context</span></div>
        <div onClick={() => navigate('/practice')} className="lesson-button lesson-button-3"><Brain className="lesson-button-icon" /><span className="lesson-button-text">Practice</span></div>
        <div onClick={() => navigate('/quiz')} className="lesson-button lesson-button-4"><NotebookPen className="lesson-button-icon" /><span className="lesson-button-text">Quiz</span></div>
      </div>
      <TopicPicker isOpen={isOpen} topicList={topics} currentTopic={selectedTopic} changeTopic={handleTopicChange} />
    </div>
  );
}

export default Home;
