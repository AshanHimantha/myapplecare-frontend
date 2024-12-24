import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Alert from './Alert';

const ServiceCharge = ({ isOpen, onClose, onSubmit }) => {
  const [serviceDetails, setServiceDetails] = useState({
    type: '',
    description: '',
    cost: ''
  });
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(serviceDetails);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error adding service charge:', error);
    }
  };

  return (
    <>
      <Alert 
        isVisible={showAlert}
        onClose={() => setShowAlert(false)}
        message="Service Charge Added Successfully"
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
              className="bg-white rounded-lg p-6 w-96 shadow-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Add Service Charge</h3>
                <button onClick={onClose}>
                  <img src="./images/close2.svg" alt="close" className="w-3 h-3" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Service Type</label>
                  <input
                    type="text"
                    value={serviceDetails.type}
                    onChange={(e) => setServiceDetails({...serviceDetails, type: e.target.value})}
                    className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-md"
                    placeholder="Enter Service Type"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700">Cost</label>
                  <input
                    type="number"
                    value={serviceDetails.cost}
                    onChange={(e) => setServiceDetails({...serviceDetails, cost: e.target.value})}
                    className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-md"
                    placeholder="Enter Cost"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700">Description</label>
                  <textarea
                    value={serviceDetails.description}
                    onChange={(e) => setServiceDetails({...serviceDetails, description: e.target.value})}
                    className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-md"
                    rows="3"
                    placeholder="Enter Description"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-2 text-sm bg-black text-white rounded-md hover:bg-gray-800"
                >
                  Add Service Charge
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ServiceCharge;