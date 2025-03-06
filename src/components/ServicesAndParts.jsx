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
        <>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Repair Services</h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Repair Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Device Category</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Cost</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Description</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {services.length > 0 ? (
                  services.map((service) => (
                    <tr key={service.id}>
                      <td className="px-4 py-3">{service.repair_name}</td>
                      <td className="px-4 py-3">{service.device_category}</td>
                      <td className="px-4 py-3">Rs.{service.cost}</td>
                      <td className="px-4 py-3">{service.description || 'N/A'}</td>
                      <td className="px-4 py-3">
                        <button 
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => handleOpenEditRepairModal(service)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-3 text-center">No repair services found</td>
                  </tr>
                )}
              </tbody>
            </table>
            
            <div className="mt-4">
              <button 
                className="bg-[#0071E3] text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleOpenAddRepairModal}
              >
                Add New Repair Service
              </button>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Parts</h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Part Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Image</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Device Category</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Quantity</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Selling Price</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Grade</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {parts.length > 0 ? (
                  parts.map((part) => (
                    <tr key={part.id}>
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
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => handleOpenEditPartModal(part)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-4 py-3 text-center">No parts found</td>
                  </tr>
                )}
              </tbody>
            </table>
            
            <div className="mt-4">
              <button 
                className="bg-[#0071E3] text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleOpenAddPartModal}
              >
                Add New Part
              </button>
            </div>
          </div>
        </>
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