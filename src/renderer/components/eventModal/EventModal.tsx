import React, { useState } from 'react';
import { NewEvent } from '../../App';
import './EventModal.css';

interface EventModalProps {
  onSave: (event: NewEvent) => void;
  onCancel: () => void;
  selectedDate: Date | null;
}

const EventModal: React.FC<EventModalProps> = ({ onSave, onCancel, selectedDate }) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() === '') return;
    
    onSave({
      title,
      description
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Event</h2>
        {selectedDate && (
          <p className="modal-date">
            {selectedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="event-title">Title:</label>
            <input
              id="event-title"
              type="text"
              className="event"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="event-description">Description:</label>
            <textarea
              id="event-description"
              className="event"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a description for your event"
              rows={4}
            />
          </div>
          <div className="modal-buttons">
            <button type="button" className="cancel-button" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="save-button">
              Save Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;