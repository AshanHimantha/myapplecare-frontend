import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ServiceCenterNav = ({setVisible}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
  
    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date) => {
    const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate();
    const time = date.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true 
    });
    
    return `${weekday} ${month} ${day}  ${time}`;
  };

  return (
    <div className="flex justify-between items-center h-6 bg-gray-100 text-black px-4">
      {/* Left side */}
      <div className="flex items-center space-x-4">
        <img src="/images/apple-logo.svg" alt="Logo" className="lg:w-4 lg:h-4 w-3 h-3" />
        <a className="text-sm font-semibold cursor-pointer" href='/service-center'>Service Center</a>
        <div className="flex space-x-4 text-xs font-semibold">
          <a className="hover:text-gray-600  px-2 py-0.5 rounded cursor-pointer" href='/invoice'>Invoice</a>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <img 
              src="/images/profile-circle.svg" 
              alt="Profile" 
              className="w-4 h-4 cursor-pointer" 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            />
            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute -right-20 mt-2 w-40 bg-white rounded-md shadow-lg z-50"
                >
                  <div className="py-1">
                    
                    <button className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-gray-100">
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <img src="/images/cart.svg " alt="Profile" className="w-4 h-4 cursor-pointer lg:hidden block" onClick={setVisible}/>
          <span className="text-xs font-semibold lg:block hidden">
            {formatDateTime(currentTime)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ServiceCenterNav;