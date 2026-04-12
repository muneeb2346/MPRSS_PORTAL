import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import './index.css';

function App() {
  const [activeItem, setActiveItem] = useState('dashboard');

  // For single-page app, we'll always show dashboard
  // but we can add scroll to sections based on nav click
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="App">
      <Sidebar activeItem={activeItem} setActiveItem={(item) => {
        setActiveItem(item);
        scrollToSection(item);
      }} />
      <Dashboard />
    </div>
  );
}

export default App;