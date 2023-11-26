import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './components/MainPage';
import TeamDashboard from './components/TeamDashboard';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/team/:shortName" element={<TeamDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;