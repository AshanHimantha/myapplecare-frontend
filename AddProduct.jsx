import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FBFBFD] dark:bg-[#1D1D1F] p-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold text-[#1D1D1F] dark:text-[#FBFBFD] mb-8">
          Add New Product
        </h1>

        {/* Form */}
        <form className="space-y-6">
          {/* Image Upload Section */}
          <div className="apple-card p-8">
            <div className="flex items-center justify-center w-full">
              <label className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-[#86868B] border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-[#2D2D2F]">
                {image ? (
                  <img 
                    src={URL.createObjectURL(image)} 
                    alt="Preview" 
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <svg className="w-10 h-10 text-[#86868B] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <p className="text-[#86868B]">Click to upload</p>
                  </div>
                )}
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={(e) => setImage(e.target.files[0])}
                  accept="image/*"
                />
              </label>
            </div>
          </div>

          {/* Product Details */}
          <div className="apple-card p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-[#1D1D1F] dark:text-[#FBFBFD] mb-2">
                  Product Name
                </label>
                <input 
                  type="text"
                  className="w-full px-4 py-2 rounded-lg bg-[#F5F5F7] dark:bg-[#2D2D2F] border-0 focus:ring-2 focus:ring-[#0071E3]"
                  placeholder="Enter product name"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-[#1D1D1F] dark:text-[#FBFBFD] mb-2">
                  Price
                </label>
                <input 
                  type="number"
                  className="w-full px-4 py-2 rounded-lg bg-[#F5F5F7] dark:bg-[#2D2D2F] border-0 focus:ring-2 focus:ring-[#0071E3]"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[#1D1D1F] dark:text-[#FBFBFD] mb-2">
                Description
              </label>
              <textarea 
                rows="4"
                className="w-full px-4 py-2 rounded-lg bg-[#F5F5F7] dark:bg-[#2D2D2F] border-0 focus:ring-2 focus:ring-[#0071E3]"
                placeholder="Enter product description"
              />
            </div>


          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 rounded-full text-[#0071E3] hover:bg-[#0071E3]/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;