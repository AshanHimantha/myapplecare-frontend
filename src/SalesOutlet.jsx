import React from "react";
import SalesOutletNav from "./components/SalesOutletNav";
import SegmentedPicker from "./components/SegmentedPicker";
import { AnimatePresence } from "framer-motion";
import ProductCard from "./components/ProductCard";

const SalesOutlet = () => {
  const handleSegmentChange = (option) => {
    console.log("Selected option:", option);
  };

  return (
    <>
      <SalesOutletNav />
      <div className="w-full lg:h-screen flex overflow-hidden">
        <div className="lg:w-3/4 w-full  h-full  justify-center mt-10">
          <div className="w-full  flex">
            <div className="w-full  flex">
              <div className="w-4/12"></div>

              <div className="w-4/12">
                <SegmentedPicker
                  options={["Phones", "Accessories"]}
                  onChange={handleSegmentChange}
                />
              </div>

              <div className="w-4/12 flex justify-end">
                <input
                  id="deviceModel"
                  type="text"
                  className="flex overflow-hidden duration-100 w-1/2 h-8 justify-between px-2 py-1 text-sm  rounded-md border border-solid border-black border-opacity-10 text-zinc-700 text-opacity-30"
                  placeholder="Search"
                />
              </div>
            </div>
          </div>

          <div className="w-full  grid grid-cols-5 gap-4 mt-10 ">
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
          </div>

        </div>

        <AnimatePresence></AnimatePresence>
      </div>
    </>
  );
};

export default SalesOutlet;
