import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './Login';
import ChooseStore from './components/ChooseStore';
import SalesOutlet from './SalesOutlet';
import ServiceCenter from './ServiceCenter';
import Invoice from './Invoice';
import ViewTicket from './ViewTicket';
import UnauthorizedPage from './components/UnauthorizedPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/" element={<Login />} />
        
        <Route path="/choose-store" element={
          <ProtectedRoute accessType="admin">
            <ChooseStore />
          </ProtectedRoute>
        } />
        
        <Route path="/service-center" element={
          <ProtectedRoute accessType="technician">
            <ServiceCenter />
          </ProtectedRoute>
        } />
        
        <Route path="/sales-outlet" element={
          <ProtectedRoute accessType={['admin', 'cashier']}>
            <SalesOutlet />
          </ProtectedRoute>
        } />
        
        <Route path="/invoice" element={
          <ProtectedRoute>
            <Invoice />
          </ProtectedRoute>
        } />
        
        <Route path="/view-ticket" element={
          <ProtectedRoute accessType="technician">
            <ViewTicket />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

export default App;