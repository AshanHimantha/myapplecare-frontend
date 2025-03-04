import React, { useState, useEffect, useCallback } from "react";
import CartItem from "./CartItem";
import PrintInvoice from "./PrintInvoice";
import api from "../api/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";

const Cart = ({ cartId, onClose, change }) => {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [cartError, setCartError] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [customerDetails, setCustomerDetails] = useState({
    firstName: "",
    lastName: "",
    contactNo: "",
  });
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [discount, setDiscount] = useState("");
  const [invoiceId, setInvoiceId] = useState(null);

  const showToast = (message, type = "success") => {
    toast[type](message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const fetchCartItems = useCallback(async () => {
    try {
      const response = await api.get(`/cart/${cartId}`);
      if (response.data.status === "success") {
        setCartItems(response.data.data.items || []);
      }
    } catch (err) {
      setCartError(err.response?.data?.message || "Failed to load cart");
      showToast("Failed to load cart details", "error");
    }
  }, [cartId, showToast]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems, change]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    try {
      await api.put(`/cart/items/${itemId}`, {
        quantity: newQuantity,
      });

      fetchCartItems();
    } catch (err) {
      showToast("Failed to update quantity", "error");
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      // Remove item from UI immediately
      setCartItems((prev) => prev.filter((item) => item.id !== itemId));

      await api.delete(`/cart/items/${itemId}`);
    } catch (err) {
      // Restore item if request fails
      setCartItems((prev) => [
        ...prev,
        cartItems.find((item) => item.id === itemId),
      ]);
      showToast("Failed to remove item", "error");
    }
  };

  const handleUpdatePrice = async (itemId, price) => {
    try {
      const response = await api.put(`/cart/items/${itemId}`, {
        price: price,
      });

      if (response.data.status === "success") {
        fetchCartItems();
        setShowDiscountModal(false);
        setDiscount("");
      } else if (response.data.status === "error") {
        showToast("Failed to update price", "error");
      }
    } catch (err) {
      setCartError("Discount higher than the original price or invalid price");
    }
  };

  const handleShowDiscountModal = (itemId) => {
    setSelectedItemId(itemId);
    setShowDiscountModal(true);
  };

  const Totaldiscount = cartItems.reduce(
    (sum, item) => sum + (parseFloat(item.price) || 0),
    0
  );

  const Subtotal = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.stock.selling_price) || 0;
    const quantity = parseInt(item.quantity) || 0;
    return sum + price * quantity;
  }, 0);

  const totalItems = cartItems.length;
  const total = Subtotal - Totaldiscount;

  const handleCheckout = async () => {
    // Validate required fields
    if (!customerDetails.firstName?.trim()) {
      showToast("First name is required", "error");
      return;
    }

    if (!customerDetails.lastName?.trim()) {
      showToast("Last name is required", "error");
      return;
    }

    if (!customerDetails.contactNo?.trim()) {
      showToast("Contact number is required", "error");
      return;
    }

    // Validate contact number format (10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(customerDetails.contactNo)) {
      showToast("Invalid contact number format", "error");
      return;
    }

    // Validate cart has items and total
    if (!cartItems.length || total <= 0) {
      showToast("Cart is empty or invalid total", "error");
      return;
    }

    try {
      const checkoutData = {
        cart_id: cartId,
        first_name: customerDetails.firstName.trim(),
        last_name: customerDetails.lastName.trim(),
        contact_number: customerDetails.contactNo,
        payment_method: paymentMethod,
        total_amount: total,
      };

      const response = await api.post("/cart/checkout", checkoutData);

      if (response.data.status === "success") {
        setInvoiceId(response.data.data.invoice.id);
        setShowPrintModal(true);
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Checkout failed", "error");
    }
  };

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="flex flex-col items-center p-3 w-full bg-white overflow-y-auto h-screen border border-gray-200 hide-scrollbar"
        >
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
            style={{
              width: "auto",
              marginLeft: "30%",
              marginTop: "10px",
              maxWidth: "90%",
              "@media (min-width: 768px)": {
                width: "400px",
              },
            }}
          />

          <div className="flex flex-col items-center w-full">
            <div className="flex flex-col w-full ">
              <div className="flex justify-between items-center w-full ">
                <div className="text-2xl font-semibold text-black">Cart</div>
                <img
                  onClick={onClose}
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
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CartItem
                        key={item.id}
                        item={item}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemove={handleRemoveItem}
                        onShowDiscountModal={handleShowDiscountModal}
                        onUpdatePrice={handleUpdatePrice}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <div className="shrink-0 self-stretch  h-px border border-solid border-zinc-100 mb-2" />

            <div className="w-full p-2">
              <div className="flex gap-4 w-full text-xs text-opacity-30">
                <div className="flex-1">
                  <label htmlFor="firstName" className="sr-only">
                    First Name
                  </label>
                  <input
                    value={customerDetails.firstName}
                    onChange={(e) =>
                      setCustomerDetails((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    type="text"
                    className="w-full px-1.5 py-2 rounded-md border border-solid border-black border-opacity-10"
                    placeholder="First Name"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="lastName" className="sr-only">
                    Last Name
                  </label>
                  <input
                    value={customerDetails.lastName}
                    onChange={(e) =>
                      setCustomerDetails((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    type="text"
                    className="w-full px-1.5 py-2 rounded-md border border-solid border-black border-opacity-10"
                    placeholder="Last Name"
                  />
                </div>
              </div>
              <div className="mt-4 text-xs">
                <label htmlFor="lastName" className="sr-only">
                  Contact No
                </label>
                <input
                  value={customerDetails.contactNo}
                  onChange={(e) =>
                    setCustomerDetails((prev) => ({
                      ...prev,
                      contactNo: e.target.value,
                    }))
                  }
                  type="text"
                  className="w-full px-1.5 py-2 rounded-md border border-solid border-black border-opacity-10"
                  placeholder="Contact No"
                />
              </div>
            </div>

            <div className="flex gap-4  w-full font-semibold p-2">
              <div className="flex   w-full font-semibold p-2">
                <div className="grid grid-cols-2 gap-4 items-start text-sm text-zinc-400 w-full">
                  <label
                    className={`flex gap-3 items-center px-8 py-1.5 rounded-md border-2 cursor-pointer
      ${
        paymentMethod === "cash"
          ? "border-black text-black"
          : "border-zinc-100 text-zinc-300"
      }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={paymentMethod === "cash"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="hidden"
                    />
                    <span>CASH</span>
                    <img
                      src="/images/cash.svg"
                      alt="Cash"
                      className={`w-5 aspect-[0.95] object-contain transition-opacity
                        ${paymentMethod === "cash" ? "opacity-100" : "opacity-30"}`}
                    />
                  </label>

                  <label
                    className={`flex gap-3 items-center px-8 py-1.5 rounded-md border-2 cursor-pointer
      ${
        paymentMethod === "card"
          ? "border-black text-black"
          : "border-zinc-100 text-zinc-300"
      }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="hidden"
                    />
                    <span>CARD</span>
                    <img
                      src="/images/card.svg"
                      alt="Card"
                      className={`w-5 aspect-[0.95] object-contain transition-opacity
                        ${paymentMethod === "card" ? "opacity-100" : "opacity-30"}`}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-between w-full px-4 mt-3 text-xs text-stone-400">
              <div className="w-1/2">
                <div className="mt-5">Sub Total</div>
                <div className="mt-3">Discount</div>
                <div className="mt-3">Items</div>
              </div>
              <div className="flex flex-col items-end pr-1 pl-7 mt-6 text-sm text-stone-400 w-1/2">
                <div>{Subtotal} LKR</div>
                <div className="mt-3">{Totaldiscount} LKR</div>
                <div className="mt-3">{totalItems}</div>
              </div>
            </div>

            <div className="shrink-0 mt-3 w-full h-px border border-dashed border-stone-300 " />
            <div className="flex gap-5 justify-between mt-6 w-full text-xl text-black ">
              <div className="font-semibold">Total</div>

              <div className="font-bold"> {total} LKR</div>
            </div>

            <button
              onClick={handleCheckout}
              className="flex gap-4 justify-center  py-2 mt-5 w-full text-lg font-medium text-white rounded-lg bg-zinc-800 text-center"
            >
              <div>Print Bill</div>
              <img
                src="./images/print.svg"
                alt="print"
                className="object-contain shrink-0 w-7 aspect-square"
              />
            </button>
            <button
              className="mt-5 text-base text-neutral-400 mb-5 bottom-0"
              onClick={handleCheckout}
            >
              Checkout Without Bill
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {showDiscountModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add Discount Price</h3>
              <button onClick={() => setShowDiscountModal(false)}>
                <img src="/images/close2.svg" alt="close" className="w-3 h-3" />
              </button>
            </div>

            <p className="text-red-500">{cartError}</p>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDiscountModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleUpdatePrice(selectedItemId, discount);
                }}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900"
              >
                Add Discount
              </button>
            </div>
          </div>
        </div>
      )}

      <PrintInvoice
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        invoiceId={invoiceId}
      />
    </>
  );
};

export default Cart;
