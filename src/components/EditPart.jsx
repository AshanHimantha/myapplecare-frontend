import React, { useState } from 'react';
import api from '../api/axios';
import Alert from './Alert';

const EditPart = ({ isOpen, onClose, part }) => {
  const [partDetails, setPartDetails] = useState({
    part_name: part.part_name,
    part_image: null,
    quantity: part.quantity,
    unit_price: part.unit_price,
    selling_price: part.selling_price,
    device_category: part.device_category,
    grade: part.grade,
    description: part.description || ''
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [imagePreview, setImagePreview] = useState(
    part.part_image ? `http://localhost:8000/api/part-images/${part.part_image}` : null
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPartDetails({ ...partDetails, part_image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPartDetails({ ...partDetails, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required field validation - excluding description and image
    if (!partDetails.part_name) newErrors.part_name = 'Part name is required';
    if (!partDetails.quantity) newErrors.quantity = 'Quantity is required';
    if (!partDetails.unit_price) newErrors.unit_price = 'Unit price is required';
    if (!partDetails.selling_price) newErrors.selling_price = 'Selling price is required';
    if (!partDetails.device_category) newErrors.device_category = 'Device category is required';
    if (!partDetails.grade) newErrors.grade = 'Grade is required';
    
    // Price validation
    if (parseFloat(partDetails.selling_price) <= parseFloat(partDetails.unit_price)) {
      newErrors.pricing = 'Selling price must be higher than unit price';
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('_method', 'PUT'); // For Laravel API to handle as PUT request
      formData.append('part_name', partDetails.part_name);
      
      if (partDetails.part_image) {
        formData.append('part_image', partDetails.part_image);
      }
      
      formData.append('quantity', partDetails.quantity);
      formData.append('unit_price', partDetails.unit_price);
      formData.append('selling_price', partDetails.selling_price);
      formData.append('device_category', partDetails.device_category.toLowerCase());
      formData.append('grade', partDetails.grade.toLowerCase());
      
      if (partDetails.description?.trim()) {
        formData.append('description', partDetails.description);
      }

      const response = await api.post(`/parts/${part.id}`, formData);
      
      if (response.status === 200 || response.status === 201) {
        setAlertMessage('Part updated successfully!');
        setShowAlert(true);
        
        // Close modal after short delay
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (error) {
      console.error('Error updating part:', error);
      setAlertMessage(error.response?.data?.message || 'Error updating part');
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Part</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {showAlert && <Alert message={alertMessage} onClose={() => setShowAlert(false)} />}
        
        <form onSubmit={handleSubmit}>
          {/* Form fields for part editing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Part Name</label>
              <input
                type="text"
                name="part_name"
                value={partDetails.part_name}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.part_name && <p className="text-red-500 text-xs mt-1">{errors.part_name}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Device Category</label>
              <select
                name="device_category"
                value={partDetails.device_category}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Category</option>
                <option value="iphone">iPhone</option>
                <option value="ipad">iPad</option>
                <option value="macbook">MacBook</option>
                <option value="imac">iMac</option>
                <option value="watch">Apple Watch</option>
                <option value="airpods">AirPods</option>
              </select>
              {errors.device_category && <p className="text-red-500 text-xs mt-1">{errors.device_category}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={partDetails.quantity}
                onChange={handleChange}
                min="1"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price (Rs.)</label>
              <input
                type="number"
                name="unit_price"
                value={partDetails.unit_price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.unit_price && <p className="text-red-500 text-xs mt-1">{errors.unit_price}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price (Rs.)</label>
              <input
                type="number"
                name="selling_price"
                value={partDetails.selling_price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.selling_price && <p className="text-red-500 text-xs mt-1">{errors.selling_price}</p>}
              {errors.pricing && <p className="text-red-500 text-xs mt-1">{errors.pricing}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
              <select
                name="grade"
                value={partDetails.grade}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Grade</option>
                <option value="a">A</option>
                <option value="b">B</option>
                <option value="c">C</option>
              </select>
              {errors.grade && <p className="text-red-500 text-xs mt-1">{errors.grade}</p>}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Part Image</label>
            <input
              type="file"
              onChange={handleImageChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              accept="image/*"
            />
            {imagePreview && (
              <div className="mt-2">
                <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded" />
              </div>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <textarea
              name="description"
              value={partDetails.description}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            ></textarea>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#0071E3] text-white rounded hover:bg-blue-700 flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPart;