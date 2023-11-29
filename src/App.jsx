import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './components/MainPage';
import TeamDashboard from './components/TeamDashboard';
import InfoTeam from './components/InfoTeam';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/team/:shortName" element={<TeamDashboard />} />
        <Route path="/2023/:teamInfoId" element={<InfoTeam />} />
      </Routes>
    </Router>
  );
};

export default App;