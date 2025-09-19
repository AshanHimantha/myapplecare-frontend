import { useState } from "react";
import * as React from "react";
import useAuthStore from "../stores/authStore";


const CartItem = ({
  item,
  onUpdateQuantity,
  onRemove,
  onShowDiscountModal,
}) => {
  const roles = useAuthStore((state) => state.roles);
  const [animating, setAnimating] = useState(false);

  const handleQuantityUpdate = async (newQuantity) => {
    if (newQuantity < 1) return;
    if (newQuantity > item.stock.quantity) {
     
      setAnimating(true);
      setTimeout(() => setAnimating(false), 1000);
    }

    
    await onUpdateQuantity(item.id, newQuantity);
   
  };

  if (!item || !item.stock || !item.stock.product) return null;
  const {
    id,
    price,
    quantity,
    stock: {
      product: { name, image, device_category_id },
      selling_price,
      serial_number,
      quantity: stockQuantity,
    },
  } = item;



  return (
    <>
      <div className="flex gap-4 mt-1.5  ">
        <div className="flex flex-col justify-center items-center px-1 w-16 h-16 rounded-md bg-zinc-100">
          <div className="flex flex-col justify-center items-center px-1 w-14 h-14 bg-white rounded">            <img
              loading="lazy"
              src={image 
                ? `${process.env.REACT_APP_API_BASE_URL}/storage/${image}`
                : '/images/Apple-ID.png'
              }
              alt={name}
              className="object-contain aspect-[1.02] w-[41px]"
            />
          </div>
        </div>
        <div className="flex flex-col grow shrink-0 my-auto basis-0 w-fit">
          <div className="flex gap-10 w-full">
            <div className="grow shrink text-xs font-semibold text-start text-black w-[171px]">
              {name}
            </div>
            <div className="flex gap-3 self-start">
                           
              
              {roles?.includes('admin') && (
                <img
                  loading="lazy"
                  src="/images/edit.png"
                  alt="Edit price"
                  className="object-contain shrink-0 w-3 aspect-square cursor-pointer hover:opacity-75"
                  onClick={() => onShowDiscountModal(item.id)}
                />
              )}

              <img
                onClick={() => onRemove(id)}
                loading="lazy"
                src="/images/close.png"
                alt=""
                className="object-contain shrink-0 w-3 aspect-square"
              />
            </div>
          </div>
          <div className="flex gap-5 justify-between items-start mt-1.5 w-full">
            <div className="flex flex-col text-center">
              <div className="flex gap-2 text-xs">
                {price !== 0 ? (
                  <>
                    <div className="grow text-neutral-400 line-through">
                      LKR {selling_price}
                    </div>
                    <div className="text-red-600">
                      LKR {selling_price - price}
                    </div>
                  </>
                ) : (
                  <div className="text-blue-600">LKR {selling_price}</div>
                )}
              </div>
              {stockQuantity && (
                <div className="self-start mt-1.5 text-xs text-neutral-400">
                 
                  {device_category_id === 1?('IMEI : ' +serial_number):('Available Qty :'+ stockQuantity)}
                </div>
              )}
            </div>
            {device_category_id !== 1 && quantity && (
              <div className="flex gap-3 mt-2.5">
                <button
                  onClick={() => handleQuantityUpdate(quantity - 1)}
                  disabled={quantity <= 1}
                  className="flex shrink-0 bg-white rounded-full h-[13px] shadow-[0px_1px_2px_rgba(0,0,0,0.25)] w-[13px] flex-col justify-center items-center px-1 disabled:opacity-50"
                >
                  -
                </button>
                <div className="my-auto text-xs font-bold text-center text-black">
                  {quantity}
                </div>
                <button
                  onClick={() => handleQuantityUpdate(quantity + 1)}
                  className={`flex flex-col justify-center items-center px-1 rounded-full h-[13px] w-[13px] transition-colors duration-300
                    ${animating ? 'bg-red-500 animate-bounce' : 'bg-white'} 
                    shadow-[0px_1px_2px_rgba(0,0,0,0.25)] disabled:opacity-50`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-6 w-6 p-0.5 transition-colors duration-300 ${animating ? 'text-white' : 'text-black'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="shrink-0 mt-1.5 h-px border border-solid border-zinc-100" />
    </>
  );
};
export default CartItem;
