import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import TitleBar from './components/title/Title';
import Calendar from './components/calendar/Calendar';
import ItemList from './components/itemList/ItemList';
import EventModal from './components/eventModal/EventModal';
import './App.css';

export default function App() {
  const [titlebarOpacity, setTitlebarOpacity] = useState(1);
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const contentContainer = contentRef.current;
    if (!contentContainer) return;
    
    const handleScroll = () => {
      const scrollPos = contentContainer.scrollTop;
      const scrollThreshold = 100;
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

// Define interface for item objects
export interface Item {
  id: number;
  title: string;
  description: string;
  date: Date;
}

// Define interface for new event data from the modal
export interface NewEvent {
  title: string;
  description: string;
}

function MainContent() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [items, setItems] = useState<Item[]>([]);

  // Load saved items from localStorage on component mount
  useEffect(() => {
    const savedItems = localStorage.getItem('calendarItems');
    if (savedItems) {
      // Parse the saved items and convert date strings back to Date objects
      const parsedItems = JSON.parse(savedItems).map((item: any) => ({
        ...item,
        date: new Date(item.date)
      }));
      setItems(parsedItems);
    }
  }, []);

  // Save items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('calendarItems', JSON.stringify(items));
  }, [items]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddEvent = () => {
    setShowModal(true);
  };

  const handleSaveEvent = (newEvent: NewEvent) => {
    // Generate a unique ID for the new event
    const newId = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
    
    // Create the event with the selected date
    const eventWithDate: Item = {
      ...newEvent,
      id: newId,
      date: selectedDate || new Date()
    };
    
    // Add the new event to the items array
    setItems([...items, eventWithDate]);
    
    // Close the modal
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="main-content">
      <Calendar onDateSelect={handleDateSelect} items={items} />
      <ItemList 
        items={items} 
        selectedDate={selectedDate} 
        onAddEvent={handleAddEvent} 
      />
      {showModal && (
        <EventModal 
          onSave={handleSaveEvent} 
          onCancel={handleCloseModal}
          selectedDate={selectedDate}
        />
      )}
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