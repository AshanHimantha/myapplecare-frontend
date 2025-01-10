import { useState } from 'react';
import * as React from "react";
import useAuthStore from '../stores/authStore';
import api from '../api/axios';
import { toast } from 'react-toastify';

const CartItem = ({ 
  item, 
  onUpdateQuantity, 
  onRemove, 
  onShowDiscountModal, 
  onUpdatePrice 
}) => {
  
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [discount, setDiscount] = useState('');
  const user = useAuthStore(state => state.user);

 
  const handlePriceUpdate = async () => {
    try {
      const response = await api.put(`/cart/items/${id}/price`, {
        price: discount
      });
      
      if (response.data.status === 'success') {
        onUpdatePrice(id, discount);
        setShowDiscountModal(false);
        setDiscount('');
        toast.success('Price updated successfully');
      }else if(response.data.status === 'error'){
        toast.error('Failed to update price');
      }
    } catch (err) {
      toast.error('Failed to update price');
    }
  };


  if (!item || !item.stock || !item.stock.product) return null;
  const {
    id,
    price,
    quantity,
    stock: {
      product: { name, image, device_category_id },
      selling_price,
      color,
      quantity: stockQuantity,
    },
  } = item;

  console.log('item:', item);

  return (
    <>
      <div className="flex gap-4 mt-1.5  ">
        <div className="flex flex-col justify-center items-center px-1 w-16 h-16 rounded-md bg-zinc-100">
          <div className="flex flex-col justify-center items-center px-1 w-14 h-14 bg-white rounded">
            <img
              loading="lazy"
              src={image}
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
              
            <img
            loading="lazy"
            src="/images/edit.png"
            alt="Edit price"
            className="object-contain shrink-0 w-3 aspect-square cursor-pointer hover:opacity-75"
            onClick={() => onShowDiscountModal(item.id)}
          />

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
                {price > 0 ? (
                  <>
                    <div className="grow text-neutral-400 line-through">LKR {selling_price}</div>
                    <div className="text-red-600">LKR {(selling_price-price)}</div>
                  </>
                ) : (
                  <div className="text-blue-600">LKR {selling_price}</div>
                )}
              </div>
              {stockQuantity && (
                <div className="self-start mt-1.5 text-xs text-neutral-400">
                  Available Qty : {stockQuantity}
                </div>
              )}
            </div>
            {device_category_id !== 1 && quantity && (
  <div className="flex gap-3 mt-2.5">
    <button
      className="flex shrink-0 bg-white rounded-full h-[13px] shadow-[0px_1px_2px_rgba(0,0,0,0.25)] w-[13px] flex-col justify-center items-center px-1"
      aria-label="Decrease quantity"
    >
      -
    </button>
    <div className="my-auto text-xs font-bold text-center text-black">
      {quantity}
    </div>
    <button
      className="flex flex-col justify-center items-center px-1 bg-white rounded-full h-[13px] shadow-[0px_1px_2px_rgba(0,0,0,0.25)] w-[13px]"
      aria-label="Increase quantity"
    >
      <img
        loading="lazy"
        src="/images/plus.svg"
        alt="increase"
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
};
export default CartItem;
