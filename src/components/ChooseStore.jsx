import React from "react";

const ChooseStore = () => {

  return (
    <div className="lg:flex lg:flex-row items-center justify-center gap-10 pb-32 lg:mt-10 mt-1 ">
        <div className="flex flex-col lg:w-72 lg:h-72 w-60 h-60 mb-10 lg:mb-0" >
          <div
            className="flex flex-col items-center px-16 py-12 w-full text-xl font-medium leading-none text-center text-black bg-white rounded-xl border border-gray-200 border-solid max-md:px-5 max-md:mt-10"
            role="button"
            tabIndex={0}
          >
            <img
              loading="lazy"
              src={
                "./images/servicecenter.png"
              }
              alt="Service Center Icon"
              className="object-contain max-w-full rounded-none aspect-[0.91]  lg:w-32 w-16"
            />
            <div className="mt-8">
              <span className="leading-6">Service Center</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col  lg:w-72 lg:h-72 w-60 h-60">
          <div
            className="flex flex-col items-center px-16 py-12 w-full text-xl font-medium leading-none text-center text-black bg-white rounded-xl border border-gray-200 border-solid max-md:px-5 max-md:mt-10"
            role="button"
            tabIndex={0}
          >
            <img
              loading="lazy"
              src={
                "./images/store.svg"
              }
              alt="Sales outlet Icon"
              className="object-contain max-w-full rounded-none aspect-[0.91] lg:w-32 w-16"
            />
            <div className="mt-8">
              <span className="leading-6">Sales Outlet</span>
            </div>
          </div>
        </div>
      </div> 
  );
};

export default ChooseStore;

