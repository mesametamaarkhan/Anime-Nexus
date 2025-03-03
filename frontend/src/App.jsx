import React, { useState } from 'react';
import { Routes, Route, Router, useNavigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import CharacterList from './pages/CharacterList.jsx';
import Navbar from './components/Navbar.jsx';

const App = () => {
  const [darkMode, setDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode}/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/characters" element={<CharacterList />} />
        </Routes>
    </div>
  );
}

export default App;