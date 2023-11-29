import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './components/MainPage';
import TeamDashboard from './components/TeamDashboard';
import InfoTeam from './components/InfoTeam';
import ErrorPage from "./components/ErrorPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/team/:shortName" element={<TeamDashboard />} />
        <Route path="/2023/:teamInfoId" element={<InfoTeam />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
};

export default App;