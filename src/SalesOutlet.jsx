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
  const [changeCart, setChangeCart] = useState(false);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Phones");
  const [searchTerm, setSearchTerm] = useState('');

const handleSearch = (e) => {
  const term = e.target.value.toLowerCase();
  setSearchTerm(term);
  
  const categoryId = selectedCategory === "Phones" ? 1 : 2;
  
  // If search is empty, only show category filtered items
  const filtered = term === '' ? 
    stocks.filter(stock => stock.product?.device_category_id === categoryId) :
    stocks.filter(stock => {
      const productName = stock.product?.name.toLowerCase();
      const serialNumber = stock.serial_number?.toLowerCase();
      const matchesSearch = productName?.includes(term) || serialNumber?.includes(term);
      const matchesCategory = stock.product?.device_category_id === categoryId;
      return matchesSearch && matchesCategory;
    });
  
  setFilteredStocks(filtered);
};

  const handleSegmentChange = (option) => {
    setSelectedCategory(option);
  };

  const handleAddToCart = async (stockId) => {
    if (!selectedCartId) {
      toast.error("Please select a Cart or Create new one");
      return;
    }

    try {
      console.log("Adding item to cart:", stockId);
      const response = await api.post("/cart/add", {
        cart_id: selectedCartId,
        stock_id: stockId,
        quantity: 1,
        price: 0
      });

      setChangeCart(!changeCart);

      if (response.data.status == "success") {
        toast.success("Item added to cart");
              
      } else {
        toast.error(response.data.message || "Failed to add item");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add item to cart");
      console.error("Failed to add item to cart:", err);
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



  useEffect(() => {
    if (selectedCategory === 'Phones') {
      const phoneStocks = stocks.filter(stock => 
        stock.product?.device_category_id === 1
      );
      setFilteredStocks(phoneStocks);
    } else if (selectedCategory === 'Accessories') {
      const accessoryStocks = stocks.filter(stock => 
        stock.product?.device_category_id === 2
      );
      setFilteredStocks(accessoryStocks);
    }
  }, [selectedCategory, stocks]);

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
                  type="text"
                  value={searchTerm}
                  onChange={handleSearch}
                  onBlur={()=>{if(searchTerm === '') setSearchTerm(null)}}
                  className="flex overflow-hidden duration-100 h-8 focus:outline-none justify-between px-2 py-1 text-sm rounded-md border border-solid  border-opacity-10 text-black "
                  placeholder="Search"
                />
              </div>
            </div>
          </div>

          <div className="w-full grid lg:grid-cols-4 xl:grid-cols-5 grid-cols-2 md:grid-cols-3 gap-4 lg:mt-10 mt-5 overflow-y-auto h-[calc(100vh-100px)] px-2 hide-scrollbar bottom-0">
            {filteredStocks.map((stock) => (
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
                change={changeCart}
                   
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SalesOutlet;
