import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import './TopicPicker.css';

function TopicPicker({ isOpen, topicList, currentTopic, changeTopic }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay">
      <div className="modal-backdrop" onClick={() => changeTopic(currentTopic)} />
      <div className="modal-content">
        <button className="modal-close" onClick={() => changeTopic(currentTopic)}>
          ✕
        </button>
        <h2 className="modal-title">Select a Topic</h2>
        <div className="modal-new-button">
          <button onClick={() => navigate('/new_topic')} className="topic-button topic-generate-new">
            Generate New Topic
          </button>
        </div>
        <div className="modal-grid">
          {topicList.length === 0 && (<p className="modal-no-topics">No topics available</p>)}
          {topicList.map((topic) => (
            <button
              key={topic._id}
              onClick={() => changeTopic(topic)}
              className="topic-button"
            >
              {topic.title}
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default TopicPicker;
