import * as React from "react";

function CartItem({ image, title, price, subtitle, quantity, isDiscounted = false, discountedPrice, availableQty }) {
  return (
    <>
      <div className="flex gap-4 mt-1.5  ">
        <div className="flex flex-col justify-center items-center px-1 w-14 h-14 rounded-md bg-zinc-100">
          <div className="flex flex-col justify-center items-center px-1 w-12 h-12 bg-white rounded">
            <img
              loading="lazy"
              src={image}
              alt={title}
              className="object-contain aspect-[1.02] w-[41px]"
            />
          </div>
        </div>
        <div className="flex flex-col grow shrink-0 my-auto basis-0 w-fit">
          <div className="flex gap-10 w-full">
            <div className="grow shrink text-xs font-semibold text-start text-black w-[171px]">
              {title}
            </div>
            <div className="flex gap-3 self-start">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/0f7281df02c81b011525d9dd165946f041b8647d91355e683978d96c0a7632df?placeholderIfAbsent=true&apiKey=c34433104d1d4810a291d4706b6578c9"
                alt=""
                className="object-contain shrink-0 w-3 aspect-square"
              />
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/f2f430f88e74dd8856e704ee8946a03fdfa260e528fe02acb5a846fc2bf16847?placeholderIfAbsent=true&apiKey=c34433104d1d4810a291d4706b6578c9"
                alt=""
                className="object-contain shrink-0 w-3 aspect-square"
              />
            </div>
          </div>
          <div className="flex gap-5 justify-between items-start mt-1.5 w-full">
            <div className="flex flex-col text-center">
              <div className="flex gap-2 text-xs">
                {isDiscounted ? (
                  <>
                    <div className="grow text-neutral-400">{price}</div>
                    <div className="text-red-600">{discountedPrice}</div>
                  </>
                ) : (
                  <div className="text-blue-600">{price}</div>
                )}
              </div>
              {availableQty && (
                <div className="self-start mt-1.5 text-xs text-neutral-400">
                  Available Qty : {availableQty}
                </div>
              )}
            </div>
            {quantity && (
              <div className="flex gap-3 mt-2.5">
                <button className="flex shrink-0 bg-white rounded-full h-[13px] shadow-[0px_1px_2px_rgba(0,0,0,0.25)] w-[13px]" aria-label="Decrease quantity" />
                <div className="my-auto text-xs font-bold text-center text-black">
                  {quantity}
                </div>
                <button className="flex flex-col justify-center items-center px-1 bg-white rounded-full h-[13px] shadow-[0px_1px_2px_rgba(0,0,0,0.25)] w-[13px]" aria-label="Increase quantity">
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/52acf41708e259cd7892605dfeb9d8a9d2304065edeba28b24eef56188f73ceb?placeholderIfAbsent=true&apiKey=c34433104d1d4810a291d4706b6578c9"
                    alt=""
                    className="object-contain w-1.5 aspect-square"
                  />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="shrink-0 mt-1.5 h-px border border-solid border-zinc-100" />
    </>
  );
}
export default CartItem;