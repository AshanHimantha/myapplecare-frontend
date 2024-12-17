import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import ChooseStore from './components/ChooseStore';
import ServiceCenter from './components/ServiceCenter'; // Import ServiceCenter component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/choose-store" element={<ChooseStore />} />
        <Route path="/service-center" element={<ServiceCenter />} /> {/* Add route for ServiceCenter */}
      </Routes>
    </Router>
  );
};

export default App;