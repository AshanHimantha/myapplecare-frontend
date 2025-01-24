import React, { useState, useCallback, useEffect } from "react";
import AddNewRepair from "./AddNewRepair";
import debounce from "lodash/debounce";
import api from "../api/axios";
import { useParams } from "react-router-dom";

const Repair = ({ onBack, onRepairAdd }) => {
  const [isAddRepairOpen, setIsAddRepairOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [repairs, setRepairs] = useState([]);
  const { id } = useParams(); // Get ticketId from URL params

  const fetchRepairs = async () => {
    try {
      setLoading(true);
      const response = await api.get("/repairs-search");
      if (response.data.status === "success") {
        // Ensure repairs is always an array
        setRepairs(Array.isArray(response.data.data) ? response.data.data : []);
      }
    } catch (err) {
      console.error("Failed to fetch repairs:", err);
      setRepairs([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleRepairSubmit = (repairDetails) => {
    console.log("Repair details:", repairDetails);
    // Handle the repair submission
  };

  const handleSearch = useCallback(
    debounce(async (term) => {
      if (!term.trim()) {
        fetchRepairs();
        return;
      }

      try {
        setLoading(true);
        const response = await api.get("/repairs-search", {
          params: { search: term },
        });

        if (response.data.status === "success") {
          setRepairs(response.data.data);
        }
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    fetchRepairs();
  }, []);



  const handleAddRepair = async (repair) => {
    try {
      const response = await api.post('/ticket-items', {
        ticket_id: parseInt(id), // from useParams
        type: 'repair',
        repair_id: repair.id
      });

      if (response.data.status === 'success') {
        onRepairAdd(true);
       
      }
    } catch (error) {
      console.error('Failed to add repair:', error);
    }
  };

  return (
    <div className="w-full flex flex-col">
      <div className="text-start w-full font-medium text-lg">Add Repair</div>
      <div className="w-full mx-auto mt-5 overflow-x-auto">
        <div className=" border border-gray-200 rounded-md flex flex-col justify-center p-5 gap-2">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-medium mb-4 hover:opacity-70"
          >
            <img src="../images/arrow-left.svg" alt="back" className="w-4 h-4" />
            <span>Back</span>
          </button>
          <div className="flex justify-between items-center p-5 text-white pt-1 ">
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

          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="space-y-2">
              {Array.isArray(repairs) && repairs.map((repair) => (
                <div 
                  key={repair.id}
                  className="border border-gray-200 hover:border-black rounded-md flex p-3 items-center justify-between gap-4 transition-all duration-200"
                >
                  <div className="flex flex-col">
                    <div className="font-medium text-sm text-gray-900">
                      {repair.repair_name}
                    </div>
                    <div className="text-sm font-medium mt-1 text-gray-700">
                      {repair.cost} LKR
                    </div>

                  </div>
            
                  <div
                    className="w-8 h-8 rounded-full border border-gray-200 hover:border-black hover:bg-gray-50 flex justify-center items-center cursor-pointer transition-all duration-200"
                    onClick={() => handleAddRepair(repair)}
                  >
                    <img src="../images/add.svg" className="w-4" alt="add repair" />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="w-full">
            <button
              onClick={() => setIsAddRepairOpen(true)}
              className="border border-gray-200 rounded text-xs text-center w-full py-2 font-medium"
            >
              Add New Repair
            </button>
          </div>
        </div>
      </div>

      <AddNewRepair
        isOpen={isAddRepairOpen}
        onClose={() => setIsAddRepairOpen(false)}
        onSubmit={handleRepairSubmit}
      />
    </div>
  );
};

export default Repair;
