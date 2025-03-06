import React, { useState } from 'react';
import ServiceCharge from './ServiceCharge';

const SelectPoR = ({ onSelect, selectedItem, handleServiceSubmit, disabled = false }) => {
  const [isServiceChargeOpen, setIsServiceChargeOpen] = useState(false);

  return (
    <>
      <div className="text-start w-full font-medium text-lg">
        Add Parts or Repair
      </div>
      <div className="w-full mx-auto mt-5 overflow-x-auto">
        <div className="border border-gray-200 rounded-md flex flex-col justify-center p-5 gap-2">
          <button
            onClick={() => onSelect('parts')}
            disabled={disabled}
            className={`border-gray-200 border rounded-md flex justify-center items-center h-12 font-semibold gap-1 ${
              selectedItem === 'parts' ? 'border-black border-2' : ''
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <img
              src="../images/part.svg"
              alt="part"
              className="w-5 h-5"
            />
            <span>Part</span>
          </button>

          <button
            onClick={() => onSelect('repair')}
            disabled={disabled}
            className={`border-gray-200 border rounded-md flex justify-center items-center h-12 font-semibold gap-1 ${
              selectedItem === 'repair' ? 'border-black border-2' : ''
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <img
              src="../images/repair.svg"
              alt="repair"
              className="w-5 h-5"
            />
            <span>Repair</span>
          </button>

          <button
            onClick={() => setIsServiceChargeOpen(true)}
            disabled={disabled}
            className={`border-gray-200 border rounded-md flex justify-center items-center h-12 font-semibold gap-1 ${
              disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <img
              src="../images/scharge.svg"
              alt="service"
              className="w-5 h-5"
            />
            <span>Service Charge</span>
          </button>
        </div>
      </div>

      <ServiceCharge
        isOpen={isServiceChargeOpen}
        onClose={() => setIsServiceChargeOpen(false)}
        onSubmit={handleServiceSubmit}
      />
    </>
  );
};

export default SelectPoR;