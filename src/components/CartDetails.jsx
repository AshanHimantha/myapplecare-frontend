import * as React from "react";

 function CartDetails() {
  return (
    <div className="flex gap-4 mt-5 w-full font-semibold p-2">
      <div className="flex flex-col flex-1 items-start text-sm text-zinc-400">
        <button className="flex gap-3 text-sm self-stretch px-8 py-1.5  text-black whitespace-nowrap bg-white rounded-md border-2 border-black border-solid">
          <div>CASH</div>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/bbb19d02d40169b5ac5c157ed4d12a8fc45793bb6d39b09f1a672fab3aeb676a?placeholderIfAbsent=true&apiKey=c34433104d1d4810a291d4706b6578c9"
            alt=""
            className="object-contain shrink-0 self-start w-5 aspect-[0.95]"
          />
        </button>
        <div className="mt-5">Sub Total</div>
        <div className="mt-3">Discount</div>
        <div className="mt-3">Items</div>
      </div>
      <div className="flex flex-col flex-1">
        <button className="flex gap-3 px-7 py-1.5 text-sm whitespace-nowrap bg-white rounded-md border border-solid border-zinc-100 text-zinc-300">
          <div>CARD</div>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/03ae443c737ead92c6cc4c873e1306738c0b43f02f91bf03b1fbb211638688ec?placeholderIfAbsent=true&apiKey=c34433104d1d4810a291d4706b6578c9"
            alt=""
            className="object-contain shrink-0 aspect-[0.95] w-[18px]"
          />
        </button>
        <div className="flex flex-col items-end pr-1 pl-7 mt-6 text-sm text-stone-300">
          <div>242500 LKR</div>
          <div className="mt-3">500 LKR</div>
          <div className="mt-3">3</div>
        </div>
      </div>
    </div>
  );

}

export default CartDetails;