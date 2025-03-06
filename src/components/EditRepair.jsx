import React, { useState } from 'react';
import api from '../api/axios';
import Alert from './Alert';

const EditRepair = ({ isOpen, onClose, repair }) => {
  const [repairDetails, setRepairDetails] = useState({
    repair_name: repair.repair_name,
    device_category: repair.device_category,
    cost: repair.cost,
    description: repair.description || ''
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRepairDetails({ ...repairDetails, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required field validation
    if (!repairDetails.repair_name) newErrors.repair_name = 'Repair name is required';
    if (!repairDetails.device_category) newErrors.device_category = 'Device category is required';
    if (!repairDetails.cost) newErrors.cost = 'Cost is required';
    
    // Cost validation
    if (parseFloat(repairDetails.cost) <= 0) {
      newErrors.cost = 'Cost must be greater than zero';
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const response = await api.put(`/repairs/${repair.id}`, {
        repair_name: repairDetails.repair_name,
        device_category: repairDetails.device_category.toLowerCase(),
        cost: repairDetails.cost,
        description: repairDetails.description?.trim() || null
      });
      
      if (response.status === 200 || response.status === 201) {
        setAlertMessage('Repair service updated successfully!');
        setShowAlert(true);
        
        // Close modal after short delay
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (error) {
      console.error('Error updating repair service:', error);
      setAlertMessage(error.response?.data?.message || 'Error updating repair service');
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Repair Service</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {showAlert && <Alert message={alertMessage} onClose={() => setShowAlert(false)} />}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Repair Name</label>
              <input
                type="text"
                name="repair_name"
                value={repairDetails.repair_name}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.repair_name && <p className="text-red-500 text-xs mt-1">{errors.repair_name}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Device Category</label>
              <select
                name="device_category"
                value={repairDetails.device_category}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Category</option>
                <option value="iphone">iPhone</option>
                <option value="android">Android</option>
                <option value="other">Other</option>
              
              </select>
              {errors.device_category && <p className="text-red-500 text-xs mt-1">{errors.device_category}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cost (Rs.)</label>
              <input
                type="number"
                name="cost"
                value={repairDetails.cost}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.cost && <p className="text-red-500 text-xs mt-1">{errors.cost}</p>}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <textarea
              name="description"
              value={repairDetails.description}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            ></textarea>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#0071E3] text-white rounded hover:bg-blue-700 flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRepair;