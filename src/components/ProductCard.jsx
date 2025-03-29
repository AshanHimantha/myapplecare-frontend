import { motion } from "framer-motion";
import React, { useState } from "react";

const ProductCard = ({
  id,
  image,
  name,
  price,
  serialNumber,
  condition,
  color,
  onAddClick,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    await onAddClick(id);
    setTimeout(() => setIsLoading(false), 700);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="m-auto rounded-md p-5 border mb-2 border-gray-200 min-w-48  flex items-center flex-col text-center hover:shadow-lg transition-all"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center items-center w-32  h-32 rounded-md bg-gray-50 bg-opacity-5"
      >
        {image ? (
          <img src={image} className="w-10/12 object-contain rounded-md" alt={name} />
        ) : (
          <svg
            className="w-16 h-16 text-[#86868B]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="font-semibold mt-3"
      >
        {name}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-red-500"
      >
        {new Intl.NumberFormat("si-LK", {
          style: "currency",
          currency: "LKR",
        }).format(price)}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-gray-400 text-xs"
      >
        aa{serialNumber}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="w-full flex gap-1 mt-2 justify-center"
      >
        <div
          className={`text-[8px] px-4 py-1 rounded-md uppercase
          ${
            condition === "new"
              ? "macGreenButton text-white"
              : condition === "used"
              ? "macBlueButton text-white"
              : "bg-yellow-500 text-white"
          }`}
        >
          {condition}
        </div>
        <div className="text-[8px] border px-2 py-1 rounded-md uppercase border-gray-200">
          Color :{" "}
          <div
            style={{ background: color }}
            className="w-2 h-2 rounded-full inline-block ml-1"
          />
        </div>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        disabled={isLoading}
        className="mt-4 border rounded-full h-10 w-10 flex justify-center items-center shadow-md
                 hover:bg-[#F5F5F7] transition-colors disabled:opacity-50"
      >
        {isLoading ? (
          <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        )}
      </motion.button>
    </motion.div>
  );
};

export default ProductCard;
