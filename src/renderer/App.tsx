import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import TitleBar from './components/title/Title';
import MainContent from './components/mainContent/MainContent';
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