import React, { useState } from 'react';
import ServiceCharge from './ServiceCharge';

const SelectPoR = ({ onSelect, selectedItem }) => {
  const [isServiceChargeOpen, setIsServiceChargeOpen] = useState(false);

  const handleServiceSubmit = (serviceDetails) => {
    console.log('Service details:', serviceDetails);
    // Handle the service submission
  };

  return (
    <>
      <div className="text-start w-full font-medium text-lg">
        Add Part or Repair
      </div>
      <div className="w-full mx-auto mt-5 overflow-x-auto">
        <div className="border border-gray-200 rounded-md flex flex-col justify-center p-5 gap-2">
          <div 
            onClick={() => onSelect('parts')}
            className={`border-gray-200 border rounded-md flex justify-center items-center h-12 font-semibold gap-1 cursor-pointer ${
              selectedItem === 'parts' ? 'border-black border-2' : ''
            }`}
          >
            <img
              src="./images/part.svg"
              alt="part"
              className="w-5 h-5"
            />
            <span>Part</span>
          </div>

          <div 
            onClick={() => onSelect('repair')}
            className={`border-gray-200 border rounded-md flex justify-center items-center h-12 font-semibold gap-1 cursor-pointer ${
              selectedItem === 'repair' ? 'border-black border-2' : ''
            }`}
          >
            <img
              src="./images/repair.svg"
              alt="repair"
              className="w-5 h-5"
            />
            <span>Repair</span>
          </div>

          <div 
            onClick={() => setIsServiceChargeOpen(true)}
            className={`border-gray-200 border rounded-md flex justify-center items-center h-12 font-semibold gap-1 cursor-pointer`}
          >
            <img
              src="./images/scharge.svg"
              alt="service"
              className="w-5 h-5"
            />
            <span>Service Charge</span>
          </div>
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