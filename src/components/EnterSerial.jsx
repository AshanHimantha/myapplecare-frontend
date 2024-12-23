import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EnterSerial = ({ isOpen, onClose, onSubmit }) => {
  const [serialNumber, setSerialNumber] = useState('');

  return (
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
            className="bg-white rounded-lg p-6 w-96 shadow-xl justify-center"
          >
            <div className="flex justify-between items-center mb-4 ">
              <h3 className="text-lg font-semibold">Enter Serial Number</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <img src="./images/close2.svg" alt="close" className="w-3 h-3" />
              </button>
            </div>

			<div className='justify-center items-center w-full flex flex-col'> <img src="./images/display.jpg" alt="display" className='w-20' /> 
			<div></div></div>
            
            <input
              type="text"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter serial number"
            />
            
            <div className="flex justify-end mt-4 space-x-2">
             
              <button
                onClick={() => {
                  onSubmit(serialNumber);
                  onClose();
                }}
                className="px-4 py-2 text-sm bg-black text-white rounded-md hover:bg-gray-800 w-full"
              >
                Submit
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EnterSerial;