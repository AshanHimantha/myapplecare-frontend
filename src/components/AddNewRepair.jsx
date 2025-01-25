import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Alert from './Alert';
import api from "../api/axios";

const AddNewRepair = ({ isOpen, onClose, onSubmit }) => {
  const [repairDetails, setRepairDetails] = useState({
    repair_name: '',
    device_category: '',
    cost: '',
    description: ''
  });
  const [showAlert, setShowAlert] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
     
      const formattedData = {
        repair_name: repairDetails.repair_name,
        device_category: repairDetails.device_category.toLowerCase(),
        cost: parseFloat(repairDetails.cost),
        description: repairDetails.description
      };

      const response = await api.post('/repairs', formattedData);

      if (response.data.status === 'success') {
        setShowAlert(true);
        setRepairDetails({
          repair_name: '',
          device_category: '',
          cost: '',
          description: ''
        });
        setTimeout(() => {
          setShowAlert(false);
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error('Error adding repair:', error);
    } finally {
     
    }
  };

  return (
    <>
      <Alert 
        isVisible={showAlert}
        onClose={() => setShowAlert(false)}
        message="Repair Added Successfully"
        type="success"
      />
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-lg p-6 w-80 lg:w-96 shadow-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Add New Repair</h3>
                <button onClick={onClose}>
                  <img src="../images/close2.svg" alt="close" className="w-3 h-3" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Repair Name</label>
                  <input
                    type="text"
                    value={repairDetails.repair_name}
                    onChange={(e) => setRepairDetails({...repairDetails, repair_name: e.target.value})}
                    className="mt-1 w-full px-3 py-1 border border-gray-200 rounded-md placeholder:text-gray-300 placeholder:text-xs"
                    placeholder="Enter Repair Name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700">Device Category</label>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    {[
                      { name: 'iPhone', icon: 'iphoneIcon.svg' },
                      { name: 'Android', icon: 'androidIcon.svg' },
                      { name: 'Other', icon: null }
                    ].map((category) => (
                      <label
                        key={category.name}
                        className={`flex justify-center items-center gap-2 p-2 border rounded-md cursor-pointer ${
                          repairDetails.device_category === category.name 
                            ? 'border-black border-2' 
                            : 'border-gray-200'
                        }`}
                      >
                        <input
                          type="radio"
                          name="category"
                          value={category.name}
                          checked={repairDetails.device_category === category.name}
                          onChange={(e) => setRepairDetails({...repairDetails, device_category: e.target.value})}
                          className="sr-only"
                          required
                        />
                        {category.icon && (
                          <img
                            src={`./images/${category.icon}`}
                            className="w-4 h-4 object-contain"
                            alt=""
                          />
                        )}
                        <span className="text-sm">{category.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700">Cost</label>
                  <input
                    type="number"
                    value={repairDetails.cost}
                    onChange={(e) => setRepairDetails({...repairDetails, cost: e.target.value})}
                    className="mt-1 w-full px-3 py-1 border border-gray-200 rounded-md placeholder:text-gray-300 placeholder:text-xs"
                    placeholder="Enter Cost"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700">Description</label>
                  <textarea
                    value={repairDetails.description}
                    onChange={(e) => setRepairDetails({...repairDetails, description: e.target.value})}
                    className="mt-1 w-full px-3 py-1 border border-gray-200 rounded-md placeholder:text-gray-300 placeholder:text-xs"
                    rows="3"
                    placeholder="Enter Description"
                    
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-1 text-sm bg-black text-white rounded-md hover:bg-gray-800"
                >
                  Add Repair
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AddNewRepair;
