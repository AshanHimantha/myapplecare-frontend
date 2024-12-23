import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import ChooseStore from './components/ChooseStore';
import SalesOutlet from './SalesOutlet';
import ServiceCenter from './ServiceCenter'; // Import ServiceCenter component
import Invoice from './Invoice';
import ViewTicket from './ViewTicket';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/choose-store" element={<ChooseStore />} />
        <Route path="/service-center" element={<ServiceCenter />} /> {/* Add route for ServiceCenter */}
        <Route path="/sales-outlet" element={<SalesOutlet/>} />
        <Route path="/invoice" element={<Invoice/>} />
        <Route path="/view-ticket" element={<ViewTicket/>} />
      </Routes>
    </Router>
  );
};

export default App;