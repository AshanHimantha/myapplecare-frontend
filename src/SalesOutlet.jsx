import React, { useEffect, useState, useCallback, useMemo, lazy, Suspense } from "react";
import SalesOutletNav from "./components/SalesOutletNav";
import SegmentedPicker from "./components/SegmentedPicker";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "./components/ProductCard";
import api from "./api/axios";
import useDebounce from './hooks/useDebounce';

// Lazy load components that aren't immediately needed
const RecentBills = lazy(() => import("./components/RecentBills"));
const Cart = lazy(() => import("./components/Cart"));

const SalesOutlet = () => {
  const [stocks, setStocks] = useState([]);
  const [selectedCartId, setSelectedCartId] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [changeCart, setChangeCart] = useState(false);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Phones");
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResultsCount, setSearchResultsCount] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
    if (e.target.value === "") {
      setHasSearched(false);
      setSearchResultsCount(0);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
    setHasSearched(false);
    setSearchResultsCount(0);
  }, []);useEffect(() => {
    if (debouncedSearchTerm !== null) {
      const searchStocks = async () => {
        try {
          const term = debouncedSearchTerm.trim();
          const categoryId = selectedCategory === "Phones" ? 1 : 2;          if (term === "") {
            // If no search term, filter locally from existing stocks (no loading needed)
            const filtered = stocks.filter(stock => stock.product?.device_category_id === categoryId);
            setFilteredStocks(filtered);
            setIsSearching(false);
            setHasSearched(false);
            setSearchResultsCount(0);
          } else {
            // Use the search API endpoint (show loading)
            setIsSearching(true);
            setHasSearched(true);            const response = await api.get(`/stocks-search?product_name=${term}&limit=100`);
            if (response.data.status === "success") {
              // Access the actual stocks array from paginated response
              const stocksData = response.data.data.data || [];
              // Filter results by category
              const filtered = stocksData.filter(stock => stock.product?.device_category_id === categoryId);
              setFilteredStocks(filtered);
              setSearchResultsCount(filtered.length);
            }
            setIsSearching(false);
          }
        } catch (err) {
          console.error("Failed to search stocks:", err);
          // Fallback to local filtering if API fails
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
      };

      searchStocks();
    }
  }, [debouncedSearchTerm, selectedCategory, stocks]);
  const handleSegmentChange = useCallback((option) => {
    setSelectedCategory(option);
    // Reset subcategory when Phones is selected
    if (option === "Phones") {
      setSelectedSubcategory(null);
    }
  }, []);

  const handleAddToCart = useCallback(async (stockId) => {
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
  }, [selectedCartId]);

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
    fetchCategories();  }, []);


  // Memoize accessories subcategory options to prevent unnecessary re-renders
  const accessorySubcategoryOptions = useMemo(() => {
    const accessoryCategory = categories.find((c) => c.name === "Accessories");
    return [
      "All",
      ...(accessoryCategory?.device_subcategories.map((sub) => sub.name) || []),
    ];
  }, [categories]);

  // Memoize subcategory change handler
  const handleSubcategoryChange = useCallback((subcategory) => {
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
  }, [stocks, categories]);

  // Memoize ProductCard props to prevent unnecessary re-renders
  const memoizedProductCards = useMemo(() => {
    return filteredStocks.map((stock) => ({
      key: stock.id,
      id: stock.id,
      image: stock.product?.image,
      name: stock.product?.name,
      price: stock.selling_price,
      serialNumber: stock.serial_number,
      condition: stock.condition,
      color: stock.color,
    }));
  }, [filteredStocks]);

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
      <div className="w-full flex overflow-hidden ">        <div className="lg:w-3/4 w-full h-full flex flex-col mt-10 overflow-y-auto hide-scrollbar">
          <div className="w-full flex flex-shrink-0">
            <div className="w-full lg:flex lg:flex-row flex-col items-center justify-center">
              <div className="w-4/12 lg:block  "></div>

              <div className="lg:w-4/12 w-full self-center px-14 lg:px-0">
                <SegmentedPicker
                  options={["Phones", "Accessories"]}
                  onChange={handleSegmentChange}
                />
              </div>              <div className="lg:w-4/12 flex w-full lg:justify-end justify-center lg:pr-5 lg:mt-0 mt-5 relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearch}
                  className="flex overflow-hidden duration-100 h-8 focus:outline-none justify-between px-2 py-1 text-sm rounded-md border border-solid border-opacity-10 text-black pr-8"
                  placeholder={isSearching ? "Searching..." : "Search"}
                  disabled={isSearching}
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                {isSearching && (
                  <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                    <svg className="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search Results UI */}
          {hasSearched && searchTerm && (
            <div className="w-full px-4 lg:px-20 mt-4">
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="text-sm text-gray-600">
                    Search results for <span className="font-semibold">"{searchTerm}"</span>
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700">
                    {searchResultsCount} {searchResultsCount === 1 ? 'item' : 'items'} found
                  </span>
                  <button
                    onClick={clearSearch}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Clear search
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="w-full self-center lg:px-20 px-10 justify-center md:flex hidden flex-shrink-0">
            <div className="w-full justify-center">
              {selectedCategory === "Accessories" && (                <div className="mt-4">
                  <SegmentedPicker
                    options={accessorySubcategoryOptions}
                    onChange={handleSubcategoryChange}
                  />
                </div>
              )}
            </div>
          </div>          <div className="w-full grid lg:grid-cols-4 xl:grid-cols-5 grid-cols-2 md:grid-cols-3 gap-1 lg:mt-10 mt-5 px-2 pb-20">
            {filteredStocks.length === 0 && hasSearched && searchTerm ? (
              <div className="col-span-full flex flex-col items-center justify-center py-16">
                <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-500 mb-2">No products found</h3>
                <p className="text-gray-400 text-center max-w-md">
                  No products match your search for "{searchTerm}". Try adjusting your search terms or browse our categories.
                </p>
                <button
                  onClick={clearSearch}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear search
                </button>
              </div>            ) : (
              memoizedProductCards.map((cardProps) => (
                <ProductCard
                  key={cardProps.key}
                  image={cardProps.image}
                  name={cardProps.name}
                  price={cardProps.price}
                  serialNumber={cardProps.serialNumber}
                  condition={cardProps.condition}
                  color={cardProps.color}
                  onAddClick={() => handleAddToCart(cardProps.id)}
                />
              ))
            )}
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
        >          <AnimatePresence>
            <Suspense fallback={
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            }>
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
            </Suspense>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default SalesOutlet;
