import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/searchProduct");
      if (response.data.status === "success") {
        setProducts(response.data.data);
      }
    } catch (err) {
      console.error("Failed to load products", err);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.device_category?.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.device_subcategory?.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, products]);

  return (
    <div className="min-h-screen bg-[#FBFBFD] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Search and Filter */}
        <div className="bg-white rounded-md border border-gray-200 p-4 mb-6 flex items-center justify-between gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products..."
            className="flex-1 px-4 py-2 rounded-md bg-[#F5F5F7] border-0 
                     focus:ring-2 focus:ring-[#0071E3]"
          />

          <button
            onClick={() => navigate("/add-product")}
            className="px-4 py-2 bg-[#0071E3] text-white rounded-md hover:bg-[#0077ED]"
          >
            Add New Product
          </button>
        </div>

        {/* Table for Desktop */}
        <div className="hidden md:block ">
          <div className="bg-white rounded-md shadow-sm overflow-hidden border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#F5F5F7]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#86868B] uppercase">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#86868B] uppercase">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#86868B] uppercase">
                    Subcategory
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#86868B] uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-end text-xs font-medium text-[#86868B] uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-lg bg-[#F5F5F7] mr-3">
                          {product.image ? (
                            <img
                              src={`${process.env.REACT_APP_API_BASE_URL}/storage/${product.image}`}
                              alt={product.name}
                              className="h-10 w-10 rounded-md object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-[#F5F5F7] flex items-center justify-center">
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
                        <div className="text-sm font-medium text-[#1D1D1F]">
                          {product.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#86868B]">
                      {product.device_category?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#86868B]">
                      {product.device_subcategory?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full uppercase ${
                          product.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() =>
                            navigate(`/products/${product.id}/edit`)
                          }
                          className="text-[#0071E3] hover:text-[#0077ED] px-2 py-1"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/AddStock?s=${product.name}`)
                          }
                          className="text-green-600 hover:text-green-700 px-2 py-1"
                        >
                          Add Stock
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cards for Mobile */}
        <div className="space-y-4 md:hidden">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-16 w-16 rounded-lg bg-[#F5F5F7] flex-shrink-0">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-[#1D1D1F]">{product.name}</h3>
                  <p className="text-sm text-[#86868B]">
                    {product.device_category?.name}
                  </p>
                  <p className="text-sm text-[#86868B]">
                    {product.device_subcategory?.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span
                  className={`px-2 py-1 text-xs rounded-full uppercase ${
                    product.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.status}
                </span>

                <div className="flex space-x-3">
                  <button
                    onClick={() => navigate(`/products/${product.id}/edit`)}
                    className="text-[#0071E3] hover:text-[#0077ED] text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => navigate(`/stocks/${product.id}/edit`)}
                    className="text-green-600 hover:text-green-700 text-sm"
                  >
                    Add Stock
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
