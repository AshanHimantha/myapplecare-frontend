import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import { useParams } from "react-router-dom";

const EnterSerial = ({ isOpen, part, onClose, onSuccess }) => {
  const { id } = useParams(); // Get ticketId from URL params
  const [serialNumber, setSerialNumber] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setError(null);
    try {
      setLoading(true);
      const payload = {
        ticket_id: parseInt(id),
        type: "part",
        part_id: part.id,
        quantity: quantity,
      };

      // Only add serial if it exists and not empty
      if (serialNumber?.trim()) {
        payload.serial = serialNumber; // Changed from serial_number to serial
      }

      const response = await api.post("/ticket-items", payload);
console.log('response',response)
      if (response.data.status === "success") {
        onClose();
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to add part");
    } finally {
      setLoading(false);
    }
  };

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
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Enter Serial Number</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <img
                  src="../images/close2.svg"
                  alt="close"
                  className="w-3 h-3"
                />
              </button>
            </div>

            <div className="justify-center items-center w-full flex flex-col">
              <img
                src={
                  part?.part_image
                    ? `http://localhost:8000/api/part-images/${part.part_image}`
                    : "../images/Apple-ID.png"
                }
                alt={part?.part_name || "display"}
                className="w-20"
              />
              <div className="text-lg font-medium mt-2 mb-2">
                {part?.part_name}
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 mt-2">
                Serial Number
              </label>
              <input
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter serial number (Optional)"
              />
              <label className="text-xs text-gray-400 mt-2 text-center w-full">
                Quantity
              </label>
              <div className="flex items-center space-x-2 ">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="w-8 h-8 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  -
                </button>

                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                  placeholder="Enter quantity"
                />

                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="w-8 h-8 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>
            {error && (
              <div className="text-red-500 text-xs mt-2 text-center">
                {error}
              </div>
            )}
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 text-sm bg-black text-white rounded-md hover:bg-gray-800 w-full disabled:opacity-50"
              >
                {loading ? "Adding..." : "Submit"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EnterSerial;
