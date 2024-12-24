import React from 'react';
import CartItem from './CartItem';
import CustomerForm from './CustomerForm';
import CartDetails from './CartDetails';

const cartItems = [
  {
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/37eebf5b0800059d8fc51f084fa2a5485c55b57113ec937bfc02e2822278bfb1?placeholderIfAbsent=true&apiKey=c34433104d1d4810a291d4706b6578c9",
    title: "iPhone 14 Pro Max",
    price: "LKR 24,000.00",
    subtitle: "IMEI572SJS67"
  },
  {
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/61856206a5e1d097fc3e872278e028d0166fc627551428b74def093ce37cfb9c?placeholderIfAbsent=true&apiKey=c34433104d1d4810a291d4706b6578c9",
    title: "iPhone 14 Pro Max Back Cover",
    price: "LKR 1,500.00",
    isDiscounted: true,
    discountedPrice: "LKR 1,000.00",
    availableQty: 5,
    quantity: 3
  },
  {
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/0cf837b6370db993ed88140cd2bf1707d4bfb986e4e3d3d21a9c9bd31f89bb36?placeholderIfAbsent=true&apiKey=c34433104d1d4810a291d4706b6578c9",
    title: "iPhone 14 Pro Max Tempared Glass",
    price: "LKR 1,000.00",
    availableQty: 20
  }
];

const Cart = () => {
  return (
    <div className="flex flex-col items-center  p-3  w-full bg-white overflow-y-auto h-screen border border-gray-200 hide-scrollbar"> 
      <div className="flex flex-col items-center  w-full ">
        <div className="flex flex-col w-full ">
          <div className="flex justify-between items-center w-full ">
            <div className="text-2xl font-semibold text-black">Cart</div>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/5b280a5fe87e26d84819be7a26881a240beddd928dd363bc6d60d30391261eb0?placeholderIfAbsent=true&apiKey=c34433104d1d4810a291d4706b6578c9"
              alt=""
              className="object-contain shrink-0 self-start mt-2 aspect-square w-[26px]"
            />
          </div>
          <div className="self-start  text-md font-medium tracking-normal text-center text-stone-300">#326
          </div>
          <div className="shrink-0 mt-5 h-px border border-solid border-zinc-100 " />
          <div className='h-64 overflow-y-auto hide-scrollbar'>
          {cartItems.map((item, index) => (
            <CartItem key={index} {...item} />
          ))}
          </div>
        </div>
        
        <div className="shrink-0 self-stretch  h-px border border-solid border-zinc-100 mb-2" />
        
        <CustomerForm />
        <CartDetails />
        
        <div className="shrink-0 mt-3 max-w-full h-px border border-dashed border-stone-300 w-[310px]" />
        <div className="flex gap-5 justify-between mt-6 w-full text-xl text-black max-w-[307px]">
          <div className="font-semibold">Total</div>
          <div className="font-bold">242000 LKR</div>
        </div>
        <button className="flex gap-4 justify-center  py-2 mt-5 w-full text-lg font-medium text-white rounded-lg bg-zinc-800 text-center">
          <div>Print Bill</div>
          <img
            src="./images/print.svg"
            alt="print"
            className="object-contain shrink-0 w-7 aspect-square"
          />
        </button>
        <button className="mt-5 text-base text-neutral-400 mb-5">
          Checkout Without Bill
        </button>
      </div>
    </div>
  );
};

export default Cart;