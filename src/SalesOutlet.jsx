import React, { useEffect, useState } from "react";
import SalesOutletNav from "./components/SalesOutletNav";
import SegmentedPicker from "./components/SegmentedPicker";
import { AnimatePresence } from "framer-motion";
import ProductCard from "./components/ProductCard";
import RecentBills from "./components/RecentBills";
import Cart from "./components/Cart";
import PrintInvoice from "./components/PrintInvoice";
import api from "./api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SalesOutlet = () => {
  const [stocks, setStocks] = useState([]);
  const [selectedCartId, setSelectedCartId] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);

  const handleSegmentChange = (option) => {
    console.log("Selected option:", option);
  };

  const handleAddToCart = (productId) => {
    if (selectedCartId == null) {
      toast.error("Please select a Cart or Create ");
      return;
    } else {
    }
  };

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await api.get("/stocks");
        if (response.data.status === "success") {
          setStocks(response.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch stocks:", err);
      }
    };
    fetchStocks();
  }, []);

  return (
    <div className="w-full h-screen flex flex-col">
      <SalesOutletNav />
      <div className="w-full flex overflow-hidden ">
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
        <div className="lg:w-3/4 w-full h-full justify-center mt-10 ">
          <div className="w-full flex ">
            <div className="w-full lg:flex lg:flex-row flex-col items-center justify-center">
              <div className="w-4/12 lg:block hidden"></div>

              <div className="lg:w-4/12 w-full self-center px-14 lg:px-0">
                <SegmentedPicker
                  options={["Phones", "Accessories"]}
                  onChange={handleSegmentChange}
                />
              </div>

              <div className="lg:w-4/12 flex w-full lg:justify-end justify-center lg:pr-5 lg:mt-0 mt-5">
                <input
                  id="deviceModel"
                  type="text"
                  className="flex overflow-hidden duration-100 h-8 justify-between px-2 py-1 text-sm rounded-md border border-solid border-black border-opacity-10 text-zinc-700 text-opacity-30"
                  placeholder="Search"
                />
              </div>
            </div>
          </div>

          <div className="w-full grid lg:grid-cols-4 xl:grid-cols-5 grid-cols-2 md:grid-cols-3 gap-4 lg:mt-10 mt-5 overflow-y-auto h-[calc(100vh-100px)] px-2 hide-scrollbar bottom-0">
            {stocks.map((stock) => (
              <ProductCard
                key={stock.id}
                image={stock.product.image}
                name={stock.product.name}
                price={stock.selling_price}
                serialNumber={stock.serial_number}
                condition={stock.condition}
                color={stock.color}
                onAddClick={() => handleAddToCart(stock.id)}
              />
            ))}
          </div>
        </div>

        <div className="lg:w-1/4 pt-6 absolute right-0 h-full bg-white w-11/12 overflow-y-auto hide-scrollbar lg:shadow-none shadow-xl hidden lg:block">
          <AnimatePresence>
            {selectedCartId == null ? (
              <RecentBills
                onCartSelect={(id) => setSelectedCartId(id)}
                onClose={() => setShowSidebar(false)}
              />
            ) : (
              <Cart
                cartId={selectedCartId}
                onClose={() => setSelectedCartId(null)}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SalesOutlet;
