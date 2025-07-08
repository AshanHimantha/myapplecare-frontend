import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Alert = ({ isVisible, onClose, message, type = 'success' }) => {
  const images = {
    success: '../images/success.gif',
    error: '../images/error.gif'
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="h-full w-full fixed top-0 left-0 backdrop-blur-sm flex justify-center items-center bg-black bg-opacity-10 z-[9999]"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="lg:w-96 lg:h-80 w-80 h-72 bg-white rounded-xl shadow-md"
          >
            <div className="w-full flex justify-end">
              <button onClick={onClose}>
                <img
                  src="../images/close2.svg"
                  alt="Close"
                  className="w-3 h-3 m-4 hover:opacity-70 transition-opacity"
                />
              </button>
            </div>

            <div className="w-full flex justify-center items-center">
              <img
                src={images[type]}
                alt={type}
                className="lg:w-52 w-44 m-4 rounded-full"
              />
            </div>
            
            <div className="w-full flex justify-center items-center flex-col">
              <div className="text-3xl font-semibold text-gray-700 capitalize">
                {type}!
              </div>
              <div className="text-xs text-gray-300 mt-2">{message}</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alert;