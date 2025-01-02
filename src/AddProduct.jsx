import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api/axios';

const AddProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData,i setFormData] = useState({
    name: '',
    description: '',c
    device_category_id: '',
    device_subcategory_id: '',
    status: 'active'
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] =o useState({ name: '' });
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/categories');
      const result = await response.json();
      
      if (result.status === 'success') {
        setCategories(result.data);
      }
    } catch (err) {
      setError('Failed to load categories');
      console.error(err);
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'device_category_id':
        return !value ? 'Category is required' : '';
      case 'device_subcategory_id':
        return !value ? 'Sub category is required' : '';
      case 'name':
        if (!value) return 'Name is required';
        if (value.length > 255) return 'Name must be less than 255 characters';
        return '';
      case 'description':
        if (value && value.length > 1000) return 'Description must be less than 1000 characters';
        return '';
      default:
        return '';
    }
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    const selectedCategory = categories.find(cat => cat.id.toString() === categoryId);
    
    setFormData(prev => ({
      ...prev,
      device_category_id: categoryId,
      category: selectedCategory?.name || '',
      device_subcategory_id: '',
      subCategory: ''
    }));
    
    // Validate category
    const error = validateField('device_category_id', categoryId);
    setValidationErrors(prev => ({
      ...prev,
      device_category_id: error,
      device_subcategory_id: '' // Clear subcategory error
    }));
  };

  const handleSubCategoryChange = (e) => {
    const subCategoryId = e.target.value;
    const selectedCategory = categories.find(
      cat => cat.id.toString() === formData.device_category_id
    );
    const selectedSubCategory = selectedCategory?.device_subcategories.find(
      sub => sub.id.toString() === subCategoryId
    );

    setFormData(prev => ({
      ...prev,
      device_subcategory_id: subCategoryId,
      subCategory: selectedSubCategory?.name || ''
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validate field
    const error = validateField(name, value);
    setValidationErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const validateForm = () => {
    const errors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) errors[key] = error;
    });
    
    // Validate image
    if (image) {
      const validTypes = ['image/jpeg', 'image/png'];
      const maxSize = 2 * 1024 * 1024; // 2MB
      
      if (!validTypes.includes(image.type)) {
        errors.image = 'Image must be JPG or PNG';
      } else if (image.size > maxSize) {
        errors.image = 'Image must be less than 2MB';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const formPayload = new FormData();
      
      // Append form fields matching API requirements
      formPayload.append('device_category_id', formData.device_category_id);
      formPayload.append('device_subcategory_id', formData.device_subcategory_id);
      formPayload.append('name', formData.name);
      formPayload.append('description', formData.description);
      formPayload.append('status', formData.status);
      
      if (image) {
        formPayload.append('image', image);
      }

      const response = await api.post('/addProduct', formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

  

      if (response.data.status === 'success') {
        navigate('/products');
      } else {
        setError(response.data.message || 'Failed to create product');
      }
    } catch (err) {
      setError('Failed to create product');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    
    try {
      const response = await api.post('/categories', newCategory);
      if (response.data.status === 'success') {
        await fetchCategories(); // Refresh categories
        setIsModalOpen(false);
        setNewCategory({ name: '' });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFD]  p-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold text-[#1D1D1F] mb-8">
          Add New Product
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="apple-card p-8">
            <div className="flex items-center justify-center w-full">
              <label className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-[#86868B] border-dashed rounded-lg cursor-pointer hover:bg-gray-50 ">
                {image ? (
                  <img 
                    src={URL.createObjectURL(image)} 
                    alt="Preview" 
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
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
            {/* Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <div className='flex justify-between'>
        <label className="block text-sm font-medium text-[#1D1D1F]  mb-2">
          Device Category
        </label>
        {/* add button for new catgory add */}
        <button className="text-gray-500 text-xs">Add +</button>
        
        </div>
        <select
          name="device_category_id"
          value={formData.device_category_id}
          onChange={handleCategoryChange}
          className="w-full px-4 py-2 rounded-lg bg-[#F5F5F7]  border focus:ring-2 focus:ring-[#0071E3] "
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {validationErrors.device_category_id && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.device_category_id}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1D1D1F]  mb-2">
          Sub Category
        </label>
        <select
          name="device_subcategory_id"
          value={formData.device_subcategory_id}
          onChange={handleSubCategoryChange}
          disabled={!formData.device_category_id}
          className="w-full px-4 py-2 rounded-lg bg-[#F5F5F7]  border focus:ring-2 focus:ring-[#0071E3] disabled:opacity-50"
        >
          <option value="">Select Sub Category</option>
          {formData.device_category_id && categories
            .find(cat => cat.id.toString() === formData.device_category_id)
            ?.device_subcategories.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
        </select>
        {validationErrors.device_subcategory_id && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.device_subcategory_id}</p>
        )}
      </div>
    </div>
            {/* Product Name & Price */}
            <div className="grid grid-cols-1 ">
              <div>
                <label className="block text-sm font-medium text-[#1D1D1F]  mb-2">
                  Product Name
                </label>
                <input 
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg bg-[#F5F5F7]  border focus:ring-2 focus:ring-[#0071E3]"
                  placeholder="Enter product name"
                  required
                  maxLength="255"
                />
                {validationErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
                )}
              </div>

             
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[#1D1D1F]  mb-2">
                Description
              </label>
              <textarea 
                rows="4"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg bg-[#F5F5F7]  border focus:ring-2 focus:ring-[#0071E3]"
                placeholder="Enter product description"
              />
              {validationErrors.description && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.description}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-[#1D1D1F]  mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg bg-[#F5F5F7]  border focus:ring-2 focus:ring-[#0071E3]"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
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
              disabled={loading}
              className="px-6 py-2 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white 
                       transition-all transform hover:scale-[1.02] active:scale-[0.98]
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;