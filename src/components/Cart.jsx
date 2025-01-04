import React, { useState, useEffect } from "react";
import CartItem from "./CartItem";
import CustomerForm from "./CustomerForm";
import CartDetails from "./CartDetails";
import PrintInvoice from "./PrintInvoice";
import api from "../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Cart = ({ cartId, onClose }) => {
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const fetchCartItems = async () => {
    setCartLoading(true);
    try {
      const response = await api.get(`/cart/${cartId}`);
      if (response.data.status === 'success') {
        setCartItems(response.data.data.items || []);
        
      }
    } catch (err) {
      setCartError(err.response?.data?.message || "Failed to load cart");
      toast.error("Failed to load cart details");
    } finally {
      setCartLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [cartId]);

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    try {
      const response = await api.put(`/cart/${cartId}/item/${itemId}`, {
        quantity: newQuantity
      });
      if (response.data.status === 'success') {
        fetchCartItems();
      }
    } catch (err) {
      toast.error('Failed to update quantity');
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await api.delete(`/cart/${cartId}/item/${itemId}`);
      fetchCartItems();
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <>
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
            <div className="self-start  text-md font-medium tracking-normal text-center text-stone-300">
              #{cartId}
            </div>
            <div className="shrink-0 mt-5 h-px border border-solid border-zinc-100 " />
            <div className="h-64 overflow-y-auto hide-scrollbar">
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>
          </div>

          <div className="shrink-0 self-stretch  h-px border border-solid border-zinc-100 mb-2" />

          <CustomerForm />
          <CartDetails />

          <div className="shrink-0 mt-3 w-full h-px border border-dashed border-stone-300 " />
          <div className="flex gap-5 justify-between mt-6 w-full text-xl text-black ">
            <div className="font-semibold">Total</div>
            <div className="font-bold">242000 LKR</div>
          </div>
          <button
            onClick={() => setShowPrintModal(true)}
            className="flex gap-4 justify-center  py-2 mt-5 w-full text-lg font-medium text-white rounded-lg bg-zinc-800 text-center"
          >
            <div>Print Bill</div>
            <img
              src="./images/print.svg"
              alt="print"
              className="object-contain shrink-0 w-7 aspect-square"
            />
          </button>
          <button className="mt-5 text-base text-neutral-400 mb-5 bottom-0">
            Checkout Without Bill
          </button>
        </div>
      </div>

      <PrintInvoice
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        cartItems={cartItems}
        customerDetails={customerDetails}
        total={total}
      />
    </>
  );
};

export default Cart;
