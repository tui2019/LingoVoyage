import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useLoaderData } from 'react-router-dom';
import { BookOpenText, MessageCircleMore, Clapperboard } from "lucide-react";
import TopicPicker from '../components/TopicPicker.jsx';

function Home() {
  const location = useLocation();
  const topics = useLoaderData();
  const navigate = useNavigate();

  const [selectedTopic, changeSelectedTopic] = useState(location.state?.topic || null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
      if (location.state?.topic) {
        navigate(location.pathname, { replace: true, state: {} });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  const handleTopicChange = (topic) => {
    changeSelectedTopic(topic);
    setIsOpen(false);
  }

  return (
    <div className="home-layout">

      <div className="home-content-left">
        <h1 className="huge-welcome">Welcome to LingoVoyage</h1>

        <div className="topic-section">
          <h2>Pick a Topic</h2>
          <div className="topic-picker">
            <button className={`topic-button ${selectedTopic === null && "topic-not-selected"}`} onClick={() => setIsOpen(true)}>
                {selectedTopic ? selectedTopic.title : 'Select Topic'}
              </button>
          </div>
        </div>
      </div>

      <div className={`home-content-right ${selectedTopic ? '' : 'home-content-right-disabled'}`}>
        <div onClick={() => navigate('/practice', { state: { topic: selectedTopic } })} className="lesson-button lesson-button-1 lesson-button-disablable"><BookOpenText className="lesson-button-icon" /><span className="lesson-button-text">Practice</span></div>
        <div onClick={() => navigate('/words_in_context', { state: { topic: selectedTopic } })} className="lesson-button lesson-button-2 lesson-button-disablable"><MessageCircleMore className="lesson-button-icon" /><span className="lesson-button-text">Words in context</span></div>
        <div onClick={() => navigate('/words_from_videos')} className="lesson-button lesson-button-3"><Clapperboard className="lesson-button-icon" /><span className="lesson-button-text">Learn words from videos</span></div>
      </div>
      <TopicPicker isOpen={isOpen} topicList={topics} currentTopic={selectedTopic} changeTopic={handleTopicChange} />
    </div>
  );
}

export default Home;
