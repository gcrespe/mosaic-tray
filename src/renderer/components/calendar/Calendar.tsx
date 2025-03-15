import React, { useState } from 'react';
import './Calendar.css';
import { Item } from '../mainContent/MainContent';

interface CalendarProps {
  onDateSelect?: (date: Date) => void;
  items: Item[];
}

const Calendar: React.FC<CalendarProps> = ({ onDateSelect, items }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
 
  // Get current month data
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
 
  // Format month name
  let monthName = currentDate.toLocaleString('default', { month: 'long' });
  const capitalizedMonthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);
  monthName = capitalizedMonthName;
 
  // Handle month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };
 
  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Check if a date has events
  const hasEvents = (date: Date) => {
    return items.some(
      item => 
        item.date.getDate() === date.getDate() &&
        item.date.getMonth() === date.getMonth() &&
        item.date.getFullYear() === date.getFullYear()
    );
  };
 
  // Generate days array
  const days = [];
  // Add empty cells for days before first day of month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
  }
  
  // Add days of month
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(currentYear, currentMonth, i);
    const isToday =
      date.getDate() === new Date().getDate() &&
      date.getMonth() === new Date().getMonth() &&
      date.getFullYear() === new Date().getFullYear();
    
    const dateHasEvents = hasEvents(date);
   
    days.push(
      <div
        key={`day-${i}`}
        className={`calendar-day ${isToday ? 'today' : ''} ${dateHasEvents ? 'has-events' : ''}`}
        onClick={() => onDateSelect && onDateSelect(date)}
      >
        {i}
        {dateHasEvents && <span className="event-dot"></span>}
      </div>
    );
  }
 
  return (
    <div className="calendar-card">
      <div className="calendar-header">
        <button onClick={prevMonth}>&lt;</button>
        <h2>{monthName} {currentYear}</h2>
        <button onClick={nextMonth}>&gt;</button>
      </div>
     
      <div className="calendar-weekdays">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>
     
      <div className="calendar-days">
        {days}
      </div>
    </div>
  );
};

export default Calendar;