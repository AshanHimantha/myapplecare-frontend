import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Alert from './Alert';
import api from '../api/axios';

const AddNewPart = ({ isOpen, onClose }) => {
  const [partDetails, setPartDetails] = useState({
    part_name: '',
    part_image: null,
    quantity: '',
    unit_price: '',
    selling_price: '',
    device_category: '',
    grade: '',
    description: ''
  });
  const [showAlert, setShowAlert] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPartDetails({ ...partDetails, part_image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };



  const validateForm = () => {
    const newErrors = {};
    
    // Required field validation - excluding description
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

      const response = await api.post('/parts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.status === 'success') {
        setShowAlert(true);
        setPartDetails({
          part_name: '',
          part_image: null,
          quantity: '',
          unit_price: '',
          selling_price: '',
          device_category: '',
          grade: '',
          description: ''
        });
        setTimeout(() => {
          setShowAlert(false);
          onClose();
          window.location.reload();
        }, 2000);

      }
    } catch (error) {
      console.error('Error adding part:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Alert 
        isVisible={showAlert}
        onClose={() => setShowAlert(false)}
        message="Part Added Successfully"
        type="success"
      />
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-lg p-6 w-96 shadow-xl max-h-[90vh] overflow-y-auto hide-scrollbar"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Add New Part</h3>
                <button onClick={onClose}>
                  <img src="../images/close2.svg" alt="close" className="w-3 h-3" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Part Image</label>
                  <div className="mt-1 flex justify-center border-2 border-dashed border-gray-300 rounded-md p-4">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="h-32 object-contain" />
                    ) : (
                      <div className="text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="part-image"
                        />
                        <label
                          htmlFor="part-image"
                          className="cursor-pointer text-sm text-gray-600 hover:text-gray-800"
                        >
                          Click to upload image
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700">Part Name</label>
                  <input
                    type="text"
                    value={partDetails.part_name}
                    onChange={(e) => setPartDetails({...partDetails, part_name: e.target.value})}
                    className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-md"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Quantity</label>
                    <input
                      type="number"
                      value={partDetails.quantity}
                      onChange={(e) => setPartDetails({...partDetails, quantity: e.target.value})}
                      className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Unit Price</label>
                    <input
                      type="number"
                      value={partDetails.unit_price}
                      
                      onChange={(e) => {
                        setPartDetails({...partDetails, unit_price: e.target.value});
                        setErrors({});
                      }}
                     className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-md"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700">Selling Price</label>
                  <input
                    type="number"
                    value={partDetails.selling_price}
                    onChange={(e) => {
                      setPartDetails({...partDetails, selling_price: e.target.value});
                      setErrors({});
                    }}
                   className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-md"
                    required
                  />
                  {errors.pricing && (
                    <p className="text-red-500 text-xs mt-1">{errors.pricing}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700">Device Category</label>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    {[
                      { name: 'iPhone', icon: 'iphoneIcon.svg' },
                      { name: 'Android', icon: 'androidIcon.svg' },
                      { name: 'Other', icon: null }
                    ].map((category) => (
                      <label
                        key={category.name}
                        className={`flex justify-center items-center gap-2 p-2 border rounded-md cursor-pointer ${
                          partDetails.device_category === category.name ? 'border-black border-2' : 'border-gray-200'
                        }`}
                      >
                        <input
                          type="radio"
                          name="category"
                          value={category.name}
                          checked={partDetails.device_category === category.name}
                          onChange={(e) => setPartDetails({...partDetails, device_category: e.target.value})}
                          className="sr-only"
                          required
                        />
                        {category.icon && (
                          <img
                            src={`../images/${category.icon}`}
                            className="w-4 h-4"
                            alt=""
                          />
                        )}
                        <span className="text-sm">{category.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700">Grade</label>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    {['A', 'B', 'C'].map((grade) => (
                      <label
                        key={grade}
                        className={`flex justify-center items-center p-2 border rounded-md cursor-pointer ${
                          partDetails.grade === grade ? 'border-black border-2' : 'border-gray-200'
                        }`}
                      >
                        <input
                          type="radio"
                          name="grade"
                          value={grade}
                          checked={partDetails.grade === grade}
                          onChange={(e) => setPartDetails({...partDetails, grade: e.target.value})}
                          className="sr-only"
                          required
                        />
                        <span className="text-sm">Grade {grade}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700">Description</label>
                  <textarea
                    value={partDetails.description}
                    onChange={(e) => setPartDetails({...partDetails, description: e.target.value})}
                    className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-md"
                    rows="3"
                    
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-2 text-sm bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add Part'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )} 
      </AnimatePresence>
    </>
  );
};

export default AddNewPart;