import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';

const ChooseStore = () => {
  const navigate = useNavigate(); // Hook to navigate

  const handleServiceCenterClick = () => {
    // Start exit animation
    setIsExiting(true);
    // Navigate after 1 second
    setTimeout(() => {
      navigate('/service-center');
    }, 1000);
  };

  const [isExiting, setIsExiting] = React.useState(false);

  const containerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    },
    exit: { opacity: 0, y: 50, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      className="lg:flex lg:flex-row items-center justify-center gap-10 pb-32 lg:mt-10 mt-1"
      initial="hidden"
      animate={isExiting ? "exit" : "visible"}
      variants={containerVariants}
    >
      <motion.div
        className="flex flex-col lg:w-72 lg:h-72 w-60 h-60 mb-10 lg:mb-0"
        onClick={handleServiceCenterClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div
          className="flex flex-col items-center px-16 py-12 w-full text-xl font-medium leading-none text-center text-black bg-white rounded-xl border border-gray-200 border-solid max-md:px-5 max-md:mt-10"
          role="button"
          tabIndex={0}
        >
          <img
            loading="lazy"
            src="./images/servicecenter.png"
            alt="Service Center Icon"
            className="object-contain max-w-full rounded-none aspect-[0.91] lg:w-32 w-16"
          />
          <div className="mt-8">
            <span className="leading-6">Service Center</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="flex flex-col lg:w-72 lg:h-72 w-60 h-60"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div
          className="flex flex-col items-center px-16 py-12 w-full text-xl font-medium leading-none text-center text-black bg-white rounded-xl border border-gray-200 border-solid max-md:px-5 max-md:mt-10"
          role="button"
          tabIndex={0}
        >
          <img
            loading="lazy"
            src="./images/store.svg"
            alt="Sales Outlet Icon"
            className="object-contain max-w-full rounded-none aspect-[0.91] lg:w-32 w-16"
          />
          <div className="mt-8">
            <span className="leading-6">Sales Outlet</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ChooseStore;