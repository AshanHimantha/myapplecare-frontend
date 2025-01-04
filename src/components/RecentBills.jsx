import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAuthStore from '../stores/authStore';

const RecentBills = ({ onClose , onCartSelect }) => {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createLoading, setCreateLoading] = useState(false);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    fetchCarts();
  }, []);

  const fetchCarts = async () => {
    try {
      const response = await api.get('/cart');
      if (response.data.status === 'success') {
        // Convert single object to array if needed
        const cartsData = response.data.data;
        const cartsArray = Array.isArray(cartsData) ? cartsData : [cartsData];
        
        // Filter out any null/undefined values
        const validCarts = cartsArray.filter(cart => cart && cart.id);
        
        setCarts(validCarts);
      }
    } catch (err) {
      setError('Failed to load carts');
      setCarts([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCart = async (cartId) => {
    try {
      await api.delete(`/cart/${cartId}`);
      fetchCarts();
    } catch (err) {
      setError('Failed to delete cart');
    }
  };

  const handleCreateCart = async () => {
    setCreateLoading(true);
    try {
      const response = await api.post('/cart/create', {
        user_id: user.id
      });
      if (response.data.status === 'success') {
        // Refresh cart list
        toast.success('New cart created');
        onCartSelect(response.data.data.id);
       
      }
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error('Please login first');
      } else {
        toast.error('Failed to create cart');
      }
    } finally {
      setCreateLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(new Date(dateString));
  };

  return (
    <div className="flex flex-col py-2 w-full bg-white border-[1px] border-neutral-200 overflow-scroll h-screen hide-scrollbar">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Header */}
      <div className="self-start text-center max-md:ml-2.5 flex justify-between w-full">
        <div className="text-start px-5">
          <h1 className="text-2xl font-bold text-black">Recent Bills</h1>
          <h2 className="self-start text-md font-medium tracking-normal text-stone-300">
            Today
          </h2>
        </div>
        <button
          className="rounded-full flex justify-center items-center h-full pr-5 lg:hidden"
          onClick={onClose}
        >
          <img
            src="./images/close.svg"
            className="object-contain shrink-0 w-6 h-6"
            alt="Close"
          />
        </button>
      </div>

      <div className="shrink-0 mt-4 max-w-full h-px border border-solid border-zinc-100 w-full" />

      {/* Bills List */}
      <div className="flex flex-col px-4 lg:px-8 mt-3 w-full">
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : Array.isArray(carts) && carts.length > 0 ? (
          carts.map((cart) => (
            <div
              key={cart.id}
              onClick={() =>{onCartSelect(cart.id)} }
              className="border border-gray-200 rounded-md p-3 mb-3 flex justify-between items-center 
                        hover:border-gray-300 transition-colors cursor-pointer hover:bg-gray-50"
            >
              <div>
                <div className="font-medium text-sm">Cart #{cart.id}</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {formatDate(cart.created_at)}
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation(); // Prevent cart selection when deleting
                  handleDeleteCart(cart.id);
                }}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <img
                  src="./images/close2.svg"
                  className="w-3 h-3 opacity-50"
                  alt="remove"
                />
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-4">No recent bills found</div>
        )}
      </div>

      {/* Cart Button */}
      <div className="mt-auto px-4 lg:px-8 pb-6">
        <button 
          onClick={handleCreateCart}
          disabled={createLoading}
          className="w-full bg-black text-white rounded-md py-3 flex items-center justify-center gap-2 
                     hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          <span>{createLoading ? 'Creating...' : 'Create Cart'}</span>
          <img src="./images/cartWhite.svg" className="w-5 h-5" alt="cart" />
        </button>
      </div>
    </div>
  );
};

export default RecentBills;
