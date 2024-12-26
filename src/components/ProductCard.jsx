import React from "react";

const ProductCard = () => {
  return (
    <div className=" m-auto rounded-md p-5 border border-gray-200  flex items-center flex-col text-center ">
      <div className="flex justify-center items-center w-32 h-32 rounded-md">
        <img src="./images/R.png" className="w-10/12" alt="product" />
      </div>
      <div className="font-semibold">iPhone 14 Pro Max</div>
      <div className="text-red-500">240,000 LKR</div>
      <div className="text-gray-300 text-xs">IMERI26213HD</div>

      <div className="w-full flex gap-4 mt-2 justify-center">
        <div className="text-[8px] macBlueButton text-white px-4 py-1">
          USED
        </div>
        <div className="text-[8px] border  px-4 py-1 rounded-md">RED</div>
      </div>

      <div className="w-full flex justify-center mt-4">
        <div className="border rounded-full h-10 w-10 flex justify-center items-center shadow-md">
			<img src="./images/add.svg" alt="add"  />
		</div>
      </div>
    </div>
  );
};

export default ProductCard;
