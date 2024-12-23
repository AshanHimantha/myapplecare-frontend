import React from "react";
import ServiceCenterNav from "./components/ServiceCenterNav";
import SelectPoR from "./components/SelectPoR";
import Parts from "./components/Parts";

const ViewTicket = () => {

	// const [addItem, setAddItem] = React.useState(null);
  return (
    <>
      <ServiceCenterNav />

      <div className="w-full lg:h-screen h-full flex justify-center bg-slate-50">
        <div className="w-10/12 flex flex-col items-center">
          <div className="  w-full  flex justify-between bg-white border border-gray-200 rounded-md mt-10 ">
            <div className="flex  p-2 px-5 text-black lg:text-xl text-sm font-medium flex-col items-start justify-center">
              <div className="text-start">Ticket #1271</div>
              <div className="text-start font-normal text-xs">
                2024 Oct 29 12:40AM
              </div>
            </div>
            <div className="flex  p-2 px-5 text-black  lg:text-xl text-sm font-medium flex-col items-end justify-center">
              <div className="text-end">Ashan Himantha</div>
              <div className="text-end font-normal text-xs">0701705553</div>
            </div>
          </div>

          <div className=" w-full flex lg:flex-row flex-col bg-white border border-gray-200 rounded-md  p-5 mt-2 gap-5">

            <div className="lg:w-4/12 w-full">
			
			{/* <SelectPoR/> */}

			<Parts/>

            
			 
            </div>

            <div className="lg:w-8/12 w-full ">
              <div className="text-start w-full font-medium text-lg">
                Recent Invoices
              </div>
              <div className="w-full mx-auto mt-5 overflow-x-auto">
                <div className="min-w-[600px] border border-gray-200 rounded-md flex flex-col justify-center">
                  <div className="flex font-semibold text-xs p-3">
                    <div className="w-3/12">Item</div>
                    <div className="w-3/12 text-center">Qty</div>
                    <div className="w-3/12 text-center">Price</div>
                    <div className="w-2/12 text-center">Total</div>
                    <div className="w-1/12 text-center"></div>
                  </div>

                  <div className="shrink-0 max-w-full h-px border border-solid border-zinc-100 w-[95%] self-center" />
                  {/* Example row */}
                  <div className="flex border-b p-3 text-sm">
                    <div className="w-3/12 font-medium">iPhone 14 Pro Display
					
					</div>
                    <div className="w-3/12 text-gray-400 text-center">
                     Display
                    </div>
                    <div className="w-3/12 text-center text-gray-400 ">
                      4000 LKR
                    </div>
                    <div className="w-2/12 text-center text-gray-400">
                      4000 LKR
                    </div>

                    <div className="w-1/12 flex justify-center">
                      <button className="text-blue-500 text-center text-xs">
                        <img src="./images/bin.svg" alt="" srcset="" className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Add more rows as needed */}
                </div>
				<div className="text-start w-full font-medium text-lg mt-5 mb-2">
                Total
              </div>
				<div className="w-full border border-gray-200 rounded-md flex flex-col ">
					<div className="w-full flex justify-between p-3 text-xs">
						<span>Service Charge</span>
						<span>4000 LKR</span>
					</div>
					<div className="shrink-0 max-w-full h-px border border-solid border-zinc-100 w-[95%] self-center" />
					<div className="w-full flex  justify-between p-3 font-semibold text-xs">
						<span>Total Due</span>
						
						<span>13,000 LKR</span>
					</div>
				
				</div>
              </div>
            </div>
          </div>
		  
</div>
      </div>
    </>
  );
};

export default ViewTicket;
