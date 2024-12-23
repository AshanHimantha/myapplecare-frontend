import React, { useState } from 'react';
import EnterSerial from './EnterSerial';

const Parts = () => {
  const [isSerialModalOpen, setIsSerialModalOpen] = useState(false);

  const handleSerialSubmit = (serialNumber) => {
    console.log('Serial number submitted:', serialNumber);
    // Handle the serial number submission
  };

  return (
    <>
      <div className="text-start w-full font-medium text-lg">Add Part</div>
      <div className="w-full mx-auto mt-5 overflow-x-auto">
        <div className=" border border-gray-200 rounded-md flex flex-col justify-center p-5 gap-2">
          <div className="flex justify-between items-center p-5 text-white  ">
            <input
              id="deviceModel"
              type="text"
              className="flex overflow-hidden duration-100 gap-5 justify-between px-2 py-1 text-sm w-full rounded-md border border-solid border-black border-opacity-10 text-zinc-700 text-opacity-30"
              placeholder="Search Part"
            />
          </div>

          <div className="border border-gray-200 rounded-md flex p-2 items-center justify-between gap-2">
            <div className="flex gap-2">
              <div className="w-16 h-16 rounded border-4 border-gray-200 flex justify-center items-center">
                <img src="./images/display.jpg" className="w-14" alt="display" />
              </div>
              <div>
                <div className="font-medium text-sm">iPhone 14 Pro Display</div>
                <div className="text-gray-400 text-xs mt-0.5">
                  <span>Available Stock : 5</span>
                  <span className="text-white bg-black px-4 rounded-sm  text-[10px] py-0.5 mx-2 font-medium">
                    Display
                  </span>
                </div>
                <div className=" text-xs mt-0.5">5700LKR</div>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex justify-center items-center mr-3">
              <img src="./images/add.svg" className="w-4"alt="add" />
            </div>
          </div>

          <div className="w-full">
            <button 
              onClick={() => setIsSerialModalOpen(true)}
              className="border border-gray-200 rounded text-xs text-center w-full py-2 font-medium"
            >
              Add New Part
            </button>
          </div>
        </div>
      </div>

      <EnterSerial
        isOpen={isSerialModalOpen}
        onClose={() => setIsSerialModalOpen(false)}
        onSubmit={handleSerialSubmit}
      />
    </>
  );
};

export default Parts;
