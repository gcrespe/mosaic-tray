import { useCallback } from 'react';
import './Title.css';

interface TitleBarProps {
  opacity?: number; // Add opacity prop with default value of 1
}

const TitleBar = ({ opacity = 1 }: TitleBarProps) => {
  const handleClose = useCallback(() => {
    window.electron.ipcRenderer.sendMessage('app-close');
  }, []);
  
  const handleSettings = useCallback(() => {
    // You could navigate to settings page or open a modal
    window.electron.ipcRenderer.sendMessage('open-settings', []);
  }, []);
  
  return (
    <div 
      className="titlebar"
      style={{ 
        opacity,
        pointerEvents: opacity < 0.1 ? 'none' : 'auto'
      }}
    >
      <div className="window-title-container">
      </div>
      <div className="titlebar-buttons">
        <button
          type="button"
          className="titlebar-button settings-button"
          onClick={handleSettings}
        >
          ⚙️
        </button>
        <button
          type="button"
          className="titlebar-button close-button"
          onClick={handleClose}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default TitleBar;