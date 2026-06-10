import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useLoaderData } from 'react-router-dom';
import { BookOpenText, MessageCircleMore, Clapperboard, ChevronDown, ArrowRight } from "lucide-react";
import TopicPicker from '../components/TopicPicker.jsx';
import '../assets/Home.css';

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
  }, [location, navigate]);

  const handleTopicChange = (topic) => {
    changeSelectedTopic(topic);
    setIsOpen(false);
  }

  const isMissionDisabled = !selectedTopic;

  return (
    <main className="home-container">

      {/* Left Column: Branding & Topic Selection */}
      <div className="v-card welcome-section">
        <div>
          <h1 className="welcome-title">JOURNEY<br />BEGINS.</h1>
        </div>

        <div style={{ marginTop: "2rem" }}>
          <span className="v-label">Current Objective</span>
          <button
            className="v-btn v-btn-mission v-btn-gray"
            style={{ width: "100%", maxWidth: "320px", justifyContent: "space-between" }}
            onClick={() => setIsOpen(true)}
          >
            <span style={{ fontWeight: 500 }}>
              {selectedTopic ? selectedTopic.title : 'Select Topic'}
            </span>
            <ChevronDown size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Right Column: Mission Grid */}
      <div className="lesson-grid">

        {/* Practice Mission */}
        <button
          onClick={() => !isMissionDisabled && navigate('/practice', { state: { topic: selectedTopic } })}
          className={`v-btn v-btn-mission v-btn-green mission-card ${isMissionDisabled ? 'v-btn-disabled' : ''}`}
          disabled={isMissionDisabled}
        >
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div className="mission-icon-box">
              <BookOpenText size={22} strokeWidth={2.5} />
            </div>
            <div className="mission-text">
              <h3>Practice</h3>
              <p>Master active vocabulary recall.</p>
            </div>
          </div>
          <ArrowRight className="arrow-icon" size={18} strokeWidth={3} />
        </button>

        {/* Words in Context Mission */}
        <button
          onClick={() => !isMissionDisabled && navigate('/words_in_context', { state: { topic: selectedTopic } })}
          className={`v-btn v-btn-mission v-btn-blue mission-card ${isMissionDisabled ? 'v-btn-disabled' : ''}`}
          disabled={isMissionDisabled}
        >
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div className="mission-icon-box">
              <MessageCircleMore size={22} strokeWidth={2.5} />
            </div>
            <div className="mission-text">
              <h3>Words in Context</h3>
              <p>Fill the blank — choose the best word.</p>
            </div>
          </div>
          <ArrowRight className="arrow-icon" size={18} strokeWidth={3} />
        </button>

        {/* Video Immersion (Always enabled in your original logic) */}
        <button
          onClick={() => navigate('/words_from_videos')}
          className="v-btn v-btn-mission v-btn-red mission-card"
        >
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div className="mission-icon-box">
              <Clapperboard size={22} strokeWidth={2.5} />
            </div>
            <div className="mission-text">
              <h3>Video Immersion</h3>
              <p>Learn from real-world media.</p>
            </div>
          </div>
          <ArrowRight className="arrow-icon" size={18} strokeWidth={3} />
        </button>

      </div>

      <TopicPicker
        isOpen={isOpen}
        topicList={topics}
        currentTopic={selectedTopic}
        changeTopic={handleTopicChange}
      />
    </main>
  );
}

export default Home;
