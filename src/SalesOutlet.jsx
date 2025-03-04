import React, { useEffect, useState } from "react";
import SalesOutletNav from "./components/SalesOutletNav";
import SegmentedPicker from "./components/SegmentedPicker";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "./components/ProductCard";
import RecentBills from "./components/RecentBills";
import Cart from "./components/Cart";
import api from "./api/axios";
import useDebounce from './hooks/useDebounce';

const SalesOutlet = () => {
  const [stocks, setStocks] = useState([]);
  const [selectedCartId, setSelectedCartId] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [changeCart, setChangeCart] = useState(false);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Phones");
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    if (debouncedSearchTerm !== null) {
      const term = debouncedSearchTerm.toLowerCase();
      const categoryId = selectedCategory === "Phones" ? 1 : 2;

      const filtered = term === "" 
        ? stocks.filter(stock => stock.product?.device_category_id === categoryId)
        : stocks.filter(stock => {
            const productName = stock.product?.name.toLowerCase();
            const serialNumber = stock.serial_number?.toLowerCase();
            const matchesSearch = productName?.includes(term) || serialNumber?.includes(term);
            const matchesCategory = stock.product?.device_category_id === categoryId;
            return matchesSearch && matchesCategory;
          });

      setFilteredStocks(filtered);
      setIsSearching(false);
    }
  }, [debouncedSearchTerm, selectedCategory, stocks]);

  const handleSegmentChange = (option) => {
    setSelectedCategory(option);
    // Reset subcategory when Phones is selected
    if (option === "Phones") {
      setSelectedSubcategory(null);
    }
  };

  const handleAddToCart = async (stockId) => {
    if (!stockId) return;
    
    try {
      if (!selectedCartId) {
        const cartResponse = await api.post("/cart/create");
        if (cartResponse.data.status === "success") {
          const newCartId = cartResponse.data.data.id;
          setSelectedCartId(newCartId);
          
          const response = await api.post("/cart/add", {
            cart_id: newCartId,
            stock_id: stockId,
            quantity: 1,
            price: 0
          });

          if (response.data.status === "success") {
            setChangeCart(prev => !prev);
          }
        }
      } else {
        const response = await api.post("/cart/add", {
          cart_id: selectedCartId,
          stock_id: stockId,
          quantity: 1,
          price: 0
        });

        if (response.data.status === "success") {
          setChangeCart(prev => !prev);
        }
      }
    } catch (err) {
      console.error("Failed to add item to cart:", err);
    }
  };

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await api.get("/stocks/available");
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
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");
        if (response.data.status === "success") {
          setCategories(response.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);



  useEffect(() => {
    if (selectedCategory === "Phones") {
      const phoneStocks = stocks.filter(
        (stock) => stock.product?.device_category_id === 1
      );
      setFilteredStocks(phoneStocks);
    } else if (selectedCategory === "Accessories") {
      if (selectedSubcategory) {
        const filtered = stocks.filter(
          (stock) => stock.product?.device_subcategory_id === selectedSubcategory
        );
        setFilteredStocks(filtered);
      } else {
        const accessoryStocks = stocks.filter(
          (stock) => stock.product?.device_category_id === 2
        );
        setFilteredStocks(accessoryStocks);
      }
    }
  }, [selectedCategory, selectedSubcategory, stocks]);

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden">
      <SalesOutletNav setShowSidebar={setShowSidebar} />
      <div className="w-full flex overflow-hidden ">
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
                  className="flex overflow-hidden duration-100 h-8 focus:outline-none justify-between px-2 py-1 text-sm rounded-md border border-solid border-opacity-10 text-black"
                  placeholder={isSearching ? "Searching..." : "Search"}
                  disabled={isSearching}
                />
              </div>
            </div>
          </div>

          <div className="w-full self-center lg:px-20 px-10 justify-center md:flex hidden">
            <div className="w-full justify-center">
              {selectedCategory === "Accessories" && (
                <div className="mt-4">
                  <SegmentedPicker
                    options={[
                      "All",
                      ...(categories
                        .find((c) => c.name === "Accessories")
                        ?.device_subcategories.map((sub) => sub.name) || []),
                    ]}
                    onChange={(subcategory) => {
                      if (subcategory === "All") {
                        setSelectedSubcategory(null);
                        const accessoryStocks = stocks.filter(
                          (stock) => stock.product?.device_category_id === 2
                        );
                        setFilteredStocks(accessoryStocks);
                      } else {
                        const subId = categories
                          .find((c) => c.name === "Accessories")
                          ?.device_subcategories.find(
                            (sub) => sub.name === subcategory
                          )?.id;
                        setSelectedSubcategory(subId);
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="w-full grid lg:grid-cols-4 xl:grid-cols-5 grid-cols-2 md:grid-cols-3 gap-1 lg:mt-10 mt-5 overflow-y-auto h-[calc(100vh-100px)] px-2 hide-scrollbar bottom-0">
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

        <motion.div
          initial={{ x: "100%" }}
          animate={{
            x: window.innerWidth >= 1024 ? 0 : showSidebar ? "100%" : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`lg:w-1/4 pt-6 absolute right-0 h-full bg-white w-11/12 overflow-y-auto 
              hide-scrollbar lg:shadow-none shadow-xl lg:relative`}
        >
          <AnimatePresence>
            {selectedCartId == null ? (
              <RecentBills
                onCartSelect={(id) => setSelectedCartId(id)}
                setShowSidebar={setShowSidebar}
              />
            ) : (
              <Cart
                cartId={selectedCartId}
                onClose={() => setSelectedCartId(null)}
                change={changeCart}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default SalesOutlet;
