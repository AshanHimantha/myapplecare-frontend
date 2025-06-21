import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

// Add constant for storage URL

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active'
  });
  const [categoryInfo, setCategoryInfo] = useState({
    category: '',
    subCategory: ''
  });
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/search/${id}`);
      if (response.data.status === 'success') {
        const product = response.data.data;
        setFormData({
          name: product.name,
          description: product.description || '',
          status: product.status
        });
        setCategoryInfo({
          category: product.device_category?.name,
          subCategory: product.device_subcategory?.name
        });
        setCurrentImage(product.image 
          ? `${process.env.REACT_APP_API_BASE_URL}/storage/products/${product.image}`
          : null);
      }
    } catch (err) {
      setError('Failed to load product');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formPayload = new FormData();
      formPayload.append('_method', 'PUT'); // Simulate PUT request
      

      // Append form data
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          formPayload.append(key, formData[key]);
        }
      });
      
      // Append image if exists
      if (image) {
        formPayload.append('image', image);
      }
  
      const response = await api.post(`/products/${id}`, formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        }
      });
  
      if (response.data.status === 'success') {
        navigate('/products');
      } else {
        setError(response.data.message || 'Update failed');
      }
    } catch (err) {
      console.error('Error details:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#FBFBFD] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-[#1D1D1F]">Edit Product</h1>
          <button
            onClick={() => navigate('/products')}
            className="text-[#0071E3] hover:text-[#0077ED]"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
        

          {/* Image Upload */}
          <div className="apple-card p-8">
            <div className="flex items-center justify-center w-full">
              <label className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-[#86868B] border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                {(image || currentImage) ? (
                  <img 
                    src={image ? URL.createObjectURL(image) : currentImage ? `${currentImage}` : ''}
                    alt="Preview"
                    className="h-full w-full object-contain rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-10 h-10 text-[#86868B] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <p className="text-[#86868B]">Click to update image</p>
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

            {/* Category Info (Non-editable) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#86868B] mb-2">
                Category
              </label>
              <div className="px-4 py-2 rounded-lg bg-[#F5F5F7] text-gray-400">
                {categoryInfo.category}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#86868B] mb-2">
                Sub Category
              </label>
              <div className="px-4 py-2 rounded-lg bg-[#F5F5F7] text-gray-400">
                {categoryInfo.subCategory}
              </div>
            </div>
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-[#1D1D1F] mb-2">
              Product Name
            </label>
            <input 
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg bg-[#F5F5F7] border-0 focus:ring-2 focus:ring-[#0071E3]"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#1D1D1F] mb-2">
              Description
            </label>
            <textarea 
              rows="4"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg bg-[#F5F5F7] border-0 focus:ring-2 focus:ring-[#0071E3]"
              required
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-[#1D1D1F] mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg bg-[#F5F5F7] border-0 focus:ring-2 focus:ring-[#0071E3]"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-[#0071E3] text-white rounded-lg hover:bg-[#0077ED] disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;