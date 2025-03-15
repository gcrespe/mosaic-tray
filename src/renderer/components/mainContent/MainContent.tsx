import { useState, useEffect } from 'react';
import Calendar from '../calendar/Calendar';
import ItemList from '../itemList/ItemList';
import EventModal from '../eventModal/EventModal';

// Define interface for item objects
export interface Item {
  id: number;
  title: string;
  description: string;
  date: Date;
  time: string; // Store time in HH:MM format
  notified: boolean; // Track if notification was sent
}

// Define interface for new event data from the modal
export interface NewEvent {
  title: string;
  description: string;
  time: string; // Store time in HH:MM format
}

function MainContent() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [items, setItems] = useState<Item[]>([]);
  const [notificationPermission, setNotificationPermission] = useState<boolean>(false);

  // Load saved items from localStorage on component mount
  useEffect(() => {
    const savedItems = localStorage.getItem('calendarItems');
    if (savedItems) {
      // Parse the saved items and convert date strings back to Date objects
      const parsedItems = JSON.parse(savedItems).map((item: any) => ({
        ...item,
        date: new Date(item.date),
        notified: item.notified || false, // Ensure notified property exists
        time: item.time || "12:00" // Ensure time property exists with a default value
      }));
      setItems(parsedItems);
    }
    
    // Request notification permission
    if ("Notification" in window) {
      Notification.requestPermission().then(permission => {
        setNotificationPermission(permission === "granted");
      });
    }
  }, []);

  // Save items to localStorage whenever they change and check for upcoming events
  useEffect(() => {
    localStorage.setItem('calendarItems', JSON.stringify(items));
    
    // Set up notification check
    const checkForUpcomingEvents = () => {
      const now = new Date();
      
      items.forEach(item => {
        if (item.notified) return; // Skip if already notified
        
        const eventDate = new Date(item.date);
        const [hours, minutes] = item.time.split(':').map(Number);
        
        // Set event time
        eventDate.setHours(hours, minutes, 0, 0);
        
        // Calculate time difference in minutes
        const timeDiffMinutes = (eventDate.getTime() - now.getTime()) / (1000 * 60);
        
        // If event is 10 minutes away and notification permission granted
        if (timeDiffMinutes <= 10 && timeDiffMinutes > 0 && notificationPermission) {
          // Show notification
          new Notification(`Reminder: ${item.title}`, {
            body: `Event in ${Math.round(timeDiffMinutes)} minutes: ${item.description}`,
            icon: '/favicon.ico'
          });
          
          // Mark as notified
          setItems(prevItems => 
            prevItems.map(prevItem => 
              prevItem.id === item.id ? { ...prevItem, notified: true } : prevItem
            )
          );
        }
      });
    };
    
    // Check every minute
    const intervalId = setInterval(checkForUpcomingEvents, 60000);
    
    // Initial check
    checkForUpcomingEvents();
    
    // Clean up interval
    return () => clearInterval(intervalId);
  }, [items, notificationPermission]);

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
      date: selectedDate || new Date(),
      notified: false
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

export default MainContent;