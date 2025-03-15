import React, { useState, useEffect, useRef } from 'react';
import './ItemList.css';
import { Item } from '../mainContent/MainContent';

interface ItemListProps {
  items: Item[];
  selectedDate: Date | null;
  onAddEvent: () => void;
}

const formatTime = (time: string | undefined): string => {
  if (!time) return ""; // Handle missing time
  
  try {
    const [hourStr, minuteStr] = time.split(':');
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    
    // Check if parsing resulted in valid numbers
    if (isNaN(hour) || isNaN(minute)) return "";
    
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12; // Convert 0 to 12 for 12 AM
    
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  } catch (error) {
    console.error("Error formatting time:", error);
    return "";
  }
};

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
                  {item.time && <p className="item-time">{formatTime(item.time)}</p>}
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