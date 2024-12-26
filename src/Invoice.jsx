import React from "react";
import ServiceCenterNav from "./components/ServiceCenterNav";

const Invoice = () => {
  return (
    <>
      <ServiceCenterNav />

	

      <div className="w-full lg:h-screen h-full flex justify-center">
     
        <div className="w-8/12 ">
          <div className=" w-full flex justify-between bg-white border border-gray-200 rounded-md mt-10">
            <div className="flex justify-between items-center p-2 px-5 text-black text-2xl font-medium">
              Invoice
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
            <div className="text-start w-full font-medium text-lg">
              Recent Invoices
            </div>
            <div className="w-full mx-auto mt-5 overflow-x-auto">
              <div className="min-w-[800px] border border-gray-200 rounded-md flex flex-col justify-center">
                <div className="flex font-semibold text-xs p-3">
                  <div className="w-2/12">Invoice ID</div>
                  <div className="w-3/12 text-center">Customer</div>
                  <div className="w-3/12 text-center">Date</div>
                  <div className="w-2/12 text-center">Contact No</div>
                  <div className="w-2/12 text-center">More Details</div>
                </div>

                <div className="shrink-0 max-w-full h-px border border-solid border-zinc-100 w-[95%] self-center" />
                {/* Example row */}
                <div className="flex border-b p-3 text-sm">
                  <div className="w-2/12 font-medium">#12388</div>
                  <div className="w-3/12 text-gray-600 text-center">
                    John Doe
                  </div>
                  <div className="w-3/12 text-center text-red-500 font-semibold">
                    2024-12-05
                  </div>
                  <div className="w-2/12 text-center text-gray-600">
                    0701705553
                  </div>

                  <div className="w-2/12 flex justify-center">
                    <a className="text-blue-500 text-center text-xs" href="view-ticket">
                      View
                    </a>
                  </div>
                </div>

                {/* Add more rows as needed */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Invoice;
