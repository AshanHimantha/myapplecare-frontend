import React, { useState, useEffect } from 'react';
import EnterSerial from './EnterSerial';
import AddNewPart from './AddNewPart';
import debounce from 'lodash.debounce';
import api from '../api/axios';



const Parts = ({onBack,onPartAdd}) => {
  const [isSerialModalOpen, setIsSerialModalOpen] = useState(false);
  const [isAddPartModalOpen, setIsAddPartModalOpen] = useState(false);
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPart, setSelectedPart] = useState(null);




  const handlePartSubmit = () => {
    onPartAdd(true);
  };

  const fetchParts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/parts-search');
      if (response.data.status === 'success') {
        setParts(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch parts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = debounce(async (term) => {
    try {
      setLoading(true);
      const response = await api.get('/parts-search', {
        params: { search: term }
      });
      if (response.data.status === 'success') {
        setParts(response.data.data);
      }
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  }, 500);

  useEffect(() => {
    fetchParts();
  }, []);

  return (
    <div className="w-full flex flex-col">
      <div className="text-start w-full font-medium text-lg">Add Part</div>
      <div className="w-full mx-auto mt-5 overflow-x-auto">
        <div className=" border border-gray-200 rounded-md flex flex-col justify-center p-5 gap-2">
        <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-medium mb-4 hover:opacity-70"
          >
            <img src="../images/arrow-left.svg" alt="back" className="w-4 h-4" />
            <span>Back</span>
          </button>
          <div className="flex justify-between items-center p-5 pt-1 text-white  ">
            <input
              id="deviceModel"
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleSearch(e.target.value);
              }}
              className="flex overflow-hidden duration-100 gap-5 justify-between px-2 py-1 text-sm w-full rounded-md border border-solid border-black border-opacity-10 text-zinc-700 text-opacity-30"
              placeholder="Search Part"
            />
          </div>

          <div className="grid gap-4 mt-4">
            {loading && <div className="text-center">Loading...</div>}
            {parts.map(part => (
              <div key={part.id} className="border border-gray-200 rounded-md flex p-2 items-center justify-between gap-2">
                <div className="flex gap-2">
                  <div className="w-16 h-16 rounded border-4 border-gray-100 flex justify-center items-center overflow-hidden ">
                                       <img 
                      src={
                        !part.part_image || part.part_image === "not available" 
                          ? "../images/Apple-ID.png" 
                          : `http://localhost:8000/api/part-images/${part.part_image}`
                      }
                      onError={(e) => {
                        e.target.src = "../images/Apple-ID.png";
                      }}
                      className="object-cover rounded-md"
                      alt={part.part_name || "Part image"}
                    />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{part.part_name}</div>
                    <div className="text-gray-400 text-xs mt-0.5">
                      <span>Available: {part.quantity}</span>
                      <span className="text-white bg-black px-2 rounded-sm text-[10px] py-0.5 mx-2 font-medium">
                        {part.device_category}
                      </span>
                    </div>
                    <div className="text-xs mt-0.5">{part.selling_price} LKR</div>
                  </div>
                </div>
                
                <div 
                  className="w-8 h-8 rounded-full border border-gray-200 flex justify-center items-center mr-3 cursor-pointer"
                  onClick={() => {
                    setSelectedPart(part);
                    setIsSerialModalOpen(true);
                  }}
                >
                  <img src="../images/add.svg" className="w-4" alt="add" />
                </div>
              </div>
            ))}
          </div>

          <div className="w-full">
            <button 
              onClick={() => setIsAddPartModalOpen(true)}
              className="border border-gray-200 rounded text-xs text-center w-full py-2 font-medium"
            >
              Add New Part
            </button>
          </div>
        </div>
      </div>

      <EnterSerial
        isOpen={isSerialModalOpen}
        onClose={() => {
          setIsSerialModalOpen(false);
          setSelectedPart(null);
          onPartAdd(true);
        }}
       
        part={selectedPart}
      />

      <AddNewPart
        isOpen={isAddPartModalOpen}
        onClose={() => setIsAddPartModalOpen(false)}
        onSubmit={handlePartSubmit}
      />
    </div>
  );
};

export default Parts;
