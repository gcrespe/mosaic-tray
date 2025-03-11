import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import TitleBar from './components/title/Title';
import Calendar from './components/calendar/Calendar';
import ItemList from './components/itemList/ItemList';
import './App.css';

export default function App() {
  const [titlebarOpacity, setTitlebarOpacity] = useState(1);
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const contentContainer = contentRef.current;
    if (!contentContainer) return;
    
    const handleScroll = () => {
      // Get current scroll position
      const scrollPos = contentContainer.scrollTop;
      
      // Define the scroll range where opacity changes
      const scrollThreshold = 150; // Adjust this value to control fade speed
      
      // Calculate opacity based on scroll position
      const newOpacity = Math.max(0, 1 - (scrollPos / scrollThreshold));
      
      setTitlebarOpacity(newOpacity);
    };
    
    contentContainer.addEventListener('scroll', handleScroll);
    return () => contentContainer.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <Router>
      <div className="app-container">
        <TitleBar opacity={titlebarOpacity} />
        <div 
          ref={contentRef}
          className="content-container"
        >
          <Routes>
            <Route path="/" element={<MainContent />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

function MainContent() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
 
  // Sample items - in a real app, you'd fetch these from a data source
  const sampleItems = [
    {
      id: 1,
      title: "Team Meeting",
      description: "Discuss project roadmap and delivery timelines",
      date: new Date(2025, 2, 12) // March 12, 2025
    },
    {
      id: 2,
      title: "Doctor Appointment",
      description: "Annual checkup",
      date: new Date(2025, 2, 15) // March 15, 2025
    },
    {
      id: 3,
      title: "Birthday Party",
      description: "Don't forget to bring a gift!",
      date: new Date(2025, 2, 20) // March 20, 2025
    }
  ];
 
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };
 
  return (
    <div className="main-content">
      <Calendar onDateSelect={handleDateSelect} />
      <ItemList items={sampleItems} selectedDate={selectedDate} />
    </div>
  );
}

function Settings() {
  return (
    <div>
      {/* Your settings content */}
    </div>
  );
}