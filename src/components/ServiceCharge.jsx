import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

const ServiceCharge = ({ isOpen, onClose, onSubmit }) => {
  const { id } = useParams();
  const [cost, setCost] = useState('');
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await api.put(`/tickets/${id}`, {
        service_charge: parseFloat(cost),
        "status": "in_progress",
      });

      if (response.data.status === 'success') {
        onSubmit();
        onClose();
        
      }
    } catch (error) {
      console.error('Error adding service charge:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    
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
                  <img src="../images/close2.svg" alt="close" className="w-3 h-3" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Service Charge</label>
                  <input
                    type="number"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-md"
                    placeholder="Enter Service Charge"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-2 text-sm bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add Service Charge'}
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