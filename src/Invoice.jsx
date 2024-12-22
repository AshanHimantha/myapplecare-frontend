import React from 'react'

const Invoice = () => {
  return (
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
  )
}

export default Invoice