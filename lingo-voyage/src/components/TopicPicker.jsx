import { createPortal } from 'react-dom';
import './TopicPicker.css';

function TopicPicker({ isOpen, topicList, currentTopic, changeTopic }) {
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
          <button className="topic-button topic-generate-new">
            Generate New Topic
          </button>
        </div>
        <div className="modal-grid">
          {topicList.length === 0 && (<p className="modal-no-topics">No topics available</p>)}
          {topicList.map((topic) => (
            <button
              key={topic}
              onClick={() => changeTopic(topic)}
              className="topic-button"
            >
              {topic}
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default TopicPicker;
