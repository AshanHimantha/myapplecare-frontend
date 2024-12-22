import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CreateTicketForm from "./components/CreateTicketForm";
import SegmentedPicker from "./components/SegmentedPicker";
import TopMenu from "./components/TopMenu";
const ServiceCenter = () => {
  const [isCreateTicketVisible, setIsCreateTicketVisible] = useState(true);

  const handleCreateTicketClick = () => {
    setIsCreateTicketVisible(!isCreateTicketVisible);
  };

  const handleSegmentChange = (option) => {
    console.log("Selected option:", option);
  };

  const drawerVariants = {
    hidden: { x: "100%" },
    visible: { x: 0 },
  };
  return (
    <>
      <TopMenu />
      <div className="w-full lg:h-screen flex overflow-hidden">
        <div className="lg:w-3/4 w-full  h-full flex justify-center ">
          <div className="w-11/12 ">
            <div className=" w-full flex justify-between bg-white border border-gray-200 rounded-md mt-10">
              <div className="flex justify-between items-center p-2 px-5 text-black text-2xl font-medium">
                Tickets
              </div>
              <div className="flex justify-between items-center p-5 text-white  ">
                <input
                  id="deviceModel"
                  type="text"
                  className="flex overflow-hidden duration-100 gap-5 justify-between px-2 py-1 text-sm w-full rounded-md border border-solid border-black border-opacity-10 text-zinc-700 text-opacity-30"
                  placeholder="Search"
                />
              </div>
            </div>

            <div className=" w-full flex flex-col  bg-white border border-gray-200 rounded-md items-center p-5 mt-2">
              <div className="lg:w-10/12 w-full">
                <SegmentedPicker
                  options={["All", "Pending", "Ongoing", "Completed"]}
                  onChange={handleSegmentChange}
                />
              </div>

              <div className="w-11/12 mx-auto mt-10 overflow-x-auto">
                <div className="min-w-[800px] border border-gray-200 rounded-md flex flex-col justify-center">
                  <div className="flex font-semibold text-xs p-3">
                    <div className="w-3/12">Device</div>
                    <div className="w-2/12">Customer</div>
                    <div className="w-1/12 text-center">Priority</div>
                    <div className="w-2/12 text-center">Contact No</div>
                    <div className="w-2/12 text-center">Category</div>
                    <div className="w-1/12 text-center">Status</div>
                    <div className="w-1/12 text-center"></div>
                  </div>

                  <div className="shrink-0 max-w-full h-px border border-solid border-zinc-100 w-[95%] self-center" />
                  {/* Example row */}
                  <div className="flex border-b p-3 text-sm">
                    <div className="w-3/12 font-medium">iPhone 12 pro max</div>
                    <div className="w-2/12 text-gray-600">John Doe</div>
                    <div className="w-1/12 text-center text-red-500 font-semibold">
                      High
                    </div>
                    <div className="w-2/12 text-center text-gray-600">
                      0701705553
                    </div>
                    <div className="w-2/12 text-center text-gray-600">
                      iPhone
                    </div>
                    <div className="w-1/12 text-center text-yellow-400 font-semibold">
                      Pending
                    </div>
                    <div className="w-1/12 flex justify-center">
                      <button className="text-blue-500 text-center text-xs">
                        View
                      </button>
                    </div>
                  </div>

                  {/* Add more rows as needed */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {isCreateTicketVisible && (
            <motion.div
              className="lg:w-1/4 w-10/12 bg-gray-300 h-full absolute right-0 lg:block"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={drawerVariants}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <CreateTicketForm onClose={handleCreateTicketClick} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default ServiceCenter;
