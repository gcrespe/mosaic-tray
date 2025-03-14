import React, { useState, useEffect, useRef } from 'react';
import './ItemList.css';
import { Item } from '../../App';

// Define props interface
interface ItemListProps {
  items: Item[];
  selectedDate: Date | null;
  onAddEvent: () => void;
}

const ItemList: React.FC<ItemListProps> = ({ items, selectedDate, onAddEvent }) => {
  // Add a key state to force re-render and animation reset
  const [animationKey, setAnimationKey] = useState(0);
 
  // Reference to previous date to detect changes
  const prevDateRef = useRef<Date | null>(null);
 
  // Update the key whenever selectedDate changes
  useEffect(() => {
    // Only trigger animation if the date actually changed
    if (selectedDate?.getTime() !== prevDateRef.current?.getTime()) {
      setAnimationKey(prev => prev + 1);
      prevDateRef.current = selectedDate;
    }
  }, [selectedDate]);

  // Filter items based on selected date
  const filteredItems = selectedDate
    ? items.filter(
        (item) =>
          item.date.getDate() === selectedDate.getDate() &&
          item.date.getMonth() === selectedDate.getMonth() &&
          item.date.getFullYear() === selectedDate.getFullYear()
      )
    : [];

  // Format date for display
  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Select a date';

  return (
    <div className="item-list-container">
      <div className="date-header-container">
        <h2 className="date-header">{formattedDate}</h2>
        <button className="add-event-button" onClick={onAddEvent}>
          <span className="add-icon">+</span>
        </button>
      </div>
     
      <div className="items-wrapper">
        {selectedDate ? (
          filteredItems.length > 0 ? (
            <ul key={animationKey} className="items-list">
              {filteredItems.map((item) => (
                <li key={item.id} className="item-card">
                  <h3 className="item-title">{item.title}</h3>
                  <p className="item-description">{item.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div key={animationKey} className="no-items-message">
              <p>No events scheduled for this day.</p>
            </div>
          )
        ) : (
          <div key={animationKey} className="no-date-selected">
            <p>Please select a date to view events.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemList;