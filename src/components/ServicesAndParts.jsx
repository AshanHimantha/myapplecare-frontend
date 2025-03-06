import React, { useState, useEffect } from 'react';
import api from '../api/axios';

import AddNewPart from './AddNewPart';
import AddNewRepair from './AddNewRepair';
import EditPart from './EditPart';
import EditRepair from './EditRepair';

const ServicesAndParts = () => {
  const [services, setServices] = useState([]);
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [isAddPartModalOpen, setAddPartModalOpen] = useState(false);
  const [isAddRepairModalOpen, setAddRepairModalOpen] = useState(false);
  
  // Edit modal states
  const [isEditPartModalOpen, setEditPartModalOpen] = useState(false);
  const [isEditRepairModalOpen, setEditRepairModalOpen] = useState(false);
  const [currentPart, setCurrentPart] = useState(null);
  const [currentRepair, setCurrentRepair] = useState(null);

  // Function to fetch data from API
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const servicesRes = await api.get('/repairs');
      const partsRes = await api.get('/parts');
      
      console.log('Services data:', servicesRes.data);
      console.log('Parts data:', partsRes.data);
      
      // The services data is nested with data.data.data
      setServices(servicesRes.data.data?.data || []);
      
      // The parts data is directly in data.data array
      setParts(partsRes.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Handle part modal
  const handleOpenAddPartModal = () => {
    setAddPartModalOpen(true);
  };

  const handleCloseAddPartModal = () => {
    setAddPartModalOpen(false);
    fetchData(); // Refresh data
  };

  // Handle repair modal
  const handleOpenAddRepairModal = () => {
    setAddRepairModalOpen(true);
  };

  const handleCloseAddRepairModal = () => {
    setAddRepairModalOpen(false);
    fetchData(); // Refresh data
  };
  
  // Handle edit part modal
  const handleOpenEditPartModal = (part) => {
    setCurrentPart(part);
    setEditPartModalOpen(true);
  };

  const handleCloseEditPartModal = () => {
    setEditPartModalOpen(false);
    setCurrentPart(null);
    fetchData(); // Refresh data
  };

  // Handle edit repair modal
  const handleOpenEditRepairModal = (repair) => {
    setCurrentRepair(repair);
    setEditRepairModalOpen(true);
  };

  const handleCloseEditRepairModal = () => {
    setEditRepairModalOpen(false);
    setCurrentRepair(null);
    fetchData(); // Refresh data
  };

  return (
    <div className="space-y-6">
    
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>Error: {error}</p>
          <p className="text-sm">Please check your API endpoints and server configuration.</p>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0071E3]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {/* SERVICES SECTION */}
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-500">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Repair Services</h2>
              <button 
                className="bg-[#0071E3] text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
                onClick={handleOpenAddRepairModal}
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Repair Service
              </button>
            </div>
            
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Repair Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {services.length > 0 ? (
                  services.map((service) => (
                    <tr key={service.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{service.repair_name}</td>
                      <td className="px-4 py-3 capitalize">{service.device_category}</td>
                      <td className="px-4 py-3">Rs.{service.cost}</td>
                      <td className="px-4 py-3">{service.description || 'N/A'}</td>
                      <td className="px-4 py-3">
                        <button 
                          className="text-blue-600 hover:text-blue-800 flex items-center"
                          onClick={() => handleOpenEditRepairModal(service)}
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-3 text-center text-gray-500">No repair services found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* PARTS SECTION */}
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Parts Inventory</h2>
              <button 
                className="bg-[#0071E3] text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
                onClick={handleOpenAddPartModal}
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Part
              </button>
            </div>
            
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Part Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selling Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {parts.length > 0 ? (
                  parts.map((part) => (
                    <tr key={part.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{part.part_name}</td>
                      <td className="px-4 py-3">
                        {part.part_image && (
                          <img 
                            src={`http://localhost:8000/api/part-images/${part.part_image}`} 
                            alt={part.part_name} 
                            className="h-10 w-10 object-cover rounded"
                          />
                        )}
                      </td>
                      <td className="px-4 py-3 capitalize">{part.device_category}</td>
                      <td className="px-4 py-3">{part.quantity}</td>
                      <td className="px-4 py-3">Rs.{part.selling_price}</td>
                      <td className="px-4 py-3 uppercase">{part.grade}</td>
                      <td className="px-4 py-3">
                        <button 
                          className="text-blue-600 hover:text-blue-800 flex items-center"
                          onClick={() => handleOpenEditPartModal(part)}
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-4 py-3 text-center text-gray-500">No parts found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add modal components */}
      {isAddPartModalOpen && (
        <AddNewPart 
          isOpen={isAddPartModalOpen} 
          onClose={handleCloseAddPartModal} 
        />
      )}

      {isAddRepairModalOpen && (
        <AddNewRepair
          isOpen={isAddRepairModalOpen}
          onClose={handleCloseAddRepairModal}
        />
      )}
      
      {/* Edit modal components */}
      {isEditPartModalOpen && currentPart && (
        <EditPart
          isOpen={isEditPartModalOpen}
          onClose={handleCloseEditPartModal}
          part={currentPart}
        />
      )}
      
      {isEditRepairModalOpen && currentRepair && (
        <EditRepair
          isOpen={isEditRepairModalOpen}
          onClose={handleCloseEditRepairModal}
          repair={currentRepair}
        />
      )}
    </div>
  );
};

export default ServicesAndParts;