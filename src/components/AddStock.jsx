import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";

const COLORS = [
  "#1C1C1E", // Space Black
  "#E3E3E8", // Silver
  "#FAE7CF", // Gold
  "#635985", // Deep Purple
  "#0071E3", // Blue
  "#A64CA6", // Purple
  "#FF2D55", // Red
  "#4FD355", // Green
];

const AddStock = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    product_id: "",
    condition: "new", // new, used, refurbished
    serial_number: "",
    quantity: 1,
    selling_price: "",
    cost_price: "",
    color: "",
  });
  const [priceError, setPriceError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/searchProduct");
      if (response.data.status === "success") {
        setProducts(response.data.data);
        setFilteredProducts(response.data.data);
      }
    } catch (err) {
      setError("Failed to load products");
    }
  };

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.device_category?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [searchTerm, products]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('s');
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
  }, [location]);

  const validatePrices = (cost, selling) => {
    if (parseFloat(cost) >= parseFloat(selling)) {
      setPriceError("Cost price must be less than selling price");
      return false;
    }
    setPriceError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePrices(formData.cost_price, formData.selling_price)) {
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/stocks", formData);
      if (response.data.status === "success") {
        navigate("/admin/stock");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add stock");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFD] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-[#1D1D1F]">Add Stock</h1>
          <button
            onClick={() => navigate("/admin/stock")}
            className="text-[#0071E3] hover:text-[#0077ED]"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Search and Selection */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            {!selectedProduct ? (
              <>
                <label className="block text-sm font-medium text-[#1D1D1F] mb-2">
                  Search Product
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-[#F5F5F7] border-0 focus:ring-2 focus:ring-[#0071E3]"
                    placeholder="Search by product name or category"
                  />
                  
                  <div className={`absolute z-10 w-full mt-2 ${!searchTerm && 'hidden'}`}>
                    <div className="bg-white rounded-lg border shadow-lg">
                      {filteredProducts.length > 0 ? (
                        <div className="max-h-60 overflow-y-auto">
                          {filteredProducts.map((product) => (
                            <div
                              key={product.id}
                              onClick={() => {
                                setSelectedProduct(product);
                                setFormData((prev) => ({
                                  ...prev,
                                  product_id: product.id,
                                }));
                                setSearchTerm("");
                                navigate(`/AddStock?s=${encodeURIComponent(product.name)}`);
                              }}
                              className="p-3 hover:bg-[#F5F5F7] cursor-pointer flex items-center space-x-3 border-b last:border-b-0"
                            >
                              <div className="h-10 w-10 rounded-lg bg-[#F5F5F7] flex-shrink-0 flex items-center justify-center">
                                {product.image ? (
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="h-10 w-10 rounded-lg object-cover"
                                  />
                                ) : (
                                  <svg
                                    className="w-6 h-6 text-[#86868B]"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                  </svg>
                                )}
                              </div>
                              <div>
                                <div className="font-medium text-sm">{product.name}</div>
                                <div className="text-xs text-[#86868B]">
                                  {product.device_category?.name} -{" "}
                                  {product.device_subcategory?.name}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-[#86868B] text-sm">
                          No products found
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-lg bg-[#F5F5F7] flex-shrink-0">
                    {selectedProduct.image ? (
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-[#F5F5F7] flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-[#86868B]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{selectedProduct.name}</div>
                    <div className="text-sm text-[#86868B]">
                      {selectedProduct.device_category?.name} -{" "}
                      {selectedProduct.device_subcategory?.name}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedProduct(null);
                    setFormData((prev) => ({
                      ...prev,
                      product_id: "",
                    }));
                    navigate("/AddStock");
                  }}
                  className="text-[#0071E3] hover:text-[#0077ED]"
                >
                  Change Product
                </button>
              </div>
            )}
          </div>

          {/* Stock Details */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Condition */}
              <div>
                <label className="block text-sm font-medium text-[#1D1D1F] mb-2">
                  Condition
                </label>
                <select
                  value={formData.condition}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      condition: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 rounded-lg bg-[#F5F5F7] border-0 focus:ring-2 focus:ring-[#0071E3]"
                  required
                >
                  <option value="new">New</option>
                  <option value="used">Used</option>
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-[#1D1D1F] mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  disabled={selectedProduct?.device_category_id === 1}
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      quantity:
                        selectedProduct?.device_category_id === 1
                          ? 1
                          : e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 rounded-lg bg-[#F5F5F7] border-0 focus:ring-2 focus:ring-[#0071E3]"
                />
              </div>

              {/* Cost Price */}
              <div>
                <label className="block text-sm font-medium text-[#1D1D1F] mb-2">
                  Cost Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.cost_price}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      cost_price: e.target.value,
                    }));
                    if (formData.selling_price) {
                      validatePrices(e.target.value, formData.selling_price);
                    }
                  }}
                  className={`w-full px-4 py-2 rounded-lg bg-[#F5F5F7] border-0 
                            focus:ring-2 focus:ring-[#0071E3] 
                            ${priceError ? "ring-2 ring-red-500" : ""}`}
                  placeholder="Enter cost price"
                  required
                />
              </div>

              {/* Selling Price */}
              <div>
                <label className="block text-sm font-medium text-[#1D1D1F] mb-2">
                  Selling Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.selling_price}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      selling_price: e.target.value,
                    }));
                    if (formData.cost_price) {
                      validatePrices(formData.cost_price, e.target.value);
                    }
                  }}
                  className={`w-full px-4 py-2 rounded-lg bg-[#F5F5F7] border-0 
                            focus:ring-2 focus:ring-[#0071E3]
                            ${priceError ? "ring-2 ring-red-500" : ""}`}
                  placeholder="Enter selling price"
                  required
                />
                {priceError && (
                  <p className="text-red-500 text-sm mt-1">{priceError}</p>
                )}
              </div>
            </div>

            {/* Serial Number */}
            <div>
              <label className="block text-sm font-medium text-[#1D1D1F] mb-2">
                Serial Number
              </label>
              <input
                type="text"
                value={formData.serial_number}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    serial_number: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 rounded-lg bg-[#F5F5F7] border-0 focus:ring-2 focus:ring-[#0071E3]"
                
              />
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium text-[#1D1D1F] mb-2">
                Color
              </label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {COLORS.map((hex) => (
                  <button
                    key={hex}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, color: hex }))
                    }
                    className={`p-1 rounded-lg hover:scale-105 transition-transform
                                 ${
                                   formData.color === hex
                                     ? "ring-2 ring-[#0071E3]"
                                     : ""
                                 }`}
                  >
                    <div
                      style={{ backgroundColor: hex }}
                      className="w-full h-8 rounded-md"
                    />
                  </button>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, color: e.target.value }))
                  }
                  placeholder="#000000"
                  pattern="^#([A-Fa-f0-9]{6})$"
                  className="flex-1 px-4 py-2 rounded-lg bg-[#F5F5F7] border-0 
                              focus:ring-2 focus:ring-[#0071E3]"
                />
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, color: e.target.value }))
                  }
                  className="h-10 w-10 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="text-red-500">{error}</div>
          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !selectedProduct}
            className="w-full px-4 py-2 bg-[#0071E3] text-white rounded-lg hover:bg-[#0077ED] 
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Adding..." : "Add Stock"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStock;
