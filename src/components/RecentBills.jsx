import React from 'react';


const RecentBills = ({ onClose }) => {
  return (
    <div className="flex flex-col py-2 w-full bg-white border-[1px] border-neutral-200 overflow-scroll h-screen hide-scrollbar">
      {/* Header */}
      <div className="self-start text-center max-md:ml-2.5 flex justify-between w-full">
        <div className="text-start px-5">
          <h1 className="text-2xl font-bold text-black">Recent Bills</h1>
          <h2 className="self-start text-md font-medium tracking-normal text-stone-300">Today</h2>
        </div>
        <button className="rounded-full flex justify-center items-center h-full pr-5 lg:hidden" onClick={onClose}>
          <img src="./images/close.svg" className="object-contain shrink-0 w-6 h-6" alt="Close" />
        </button>
      </div>
      
      <div className="shrink-0 mt-4 max-w-full h-px border border-solid border-zinc-100 w-full" />

      {/* Bills List */}
      <div className="flex flex-col px-4 lg:px-8 mt-3 w-full">
      		{[1, 2, 3].map((cart) => (
		  <div key={cart} className="border border-gray-200 rounded-md p-3 mb-3 flex justify-between items-center hover:border-gray-300 transition-colors">
			<div>
			  <div className="font-medium text-sm">Cart #{cart}</div>
			  <div className="text-xs text-gray-400 mt-0.5">Today, 9:41 AM</div>
			</div>
			<button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
			  <img src="./images/close2.svg" className="w-3 h-3 opacity-50" alt="remove" />
			</button>
		  </div>
		))}
      </div>

      {/* Cart Button */}
      <div className="mt-auto px-4 lg:px-8 pb-6">
        <button className="w-full bg-black text-white rounded-md py-3 flex items-center justify-center gap-2">
		<span>Create Cart</span>
		  <img src="./images/cartWhite.svg" className="w-5 h-5" alt="cart" />
         
        </button>
      </div>
    </div>
  );
};

export default RecentBills;