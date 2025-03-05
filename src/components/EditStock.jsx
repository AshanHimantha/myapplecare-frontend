import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

const EditStock = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    serial_number: '',
    quantity: 1,
    selling_price: '',
    cost_price: '',
    color: '',
    condition: 'new'
  });
  const [product, setProduct] = useState(null);
  const [priceError, setPriceError] = useState('');

  useEffect(() => {
    fetchStock();
  }, [id]);

  const fetchStock = async () => {
    try {
      const response = await api.get(`/stocks/${id}`);
      console.log(response);
      if (response.data.status === 'success') {
        const stock = response.data.data;
        setFormData({
          serial_number: stock.serial_number,
          quantity: stock.quantity,
          selling_price: stock.selling_price,
          cost_price: stock.cost_price,
          color: stock.color,
          condition: stock.condition
        });
        setProduct(stock.product);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        // If stock not found, attempt to create it
        try {
          const createResponse = await api.post('/stocks', { id });
          if (createResponse.data.status === 'success') {
            const newStock = createResponse.data.data;
            setFormData({
              serial_number: newStock.serial_number || '',
              quantity: newStock.quantity || 1,
              selling_price: newStock.selling_price || '',
              cost_price: newStock.cost_price || '',
              color: newStock.color || '',
              condition: newStock.condition || 'new'
            });
            setProduct(newStock.product);
          }
        } catch (createErr) {
          setError('Failed to create new stock');
        }
      } else {
        setError('Failed to load stock');
      }
    } finally {
      setLoading(false);
    }
  };

  const validatePrices = (cost, selling) => {
    if (parseFloat(cost) >= parseFloat(selling)) {
      setPriceError('Cost price must be less than selling price');
      return false;
    }
    setPriceError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePrices(formData.cost_price, formData.selling_price)) {
      return;
    }
    setLoading(true);

    try {
      const response = await api.put(`/stocks/${id}`, formData);
      if (response.data.status === 'success') {
        navigate('/admin/stock');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update stock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFD] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-[#1D1D1F]">Edit Stock</h1>
          <button
            onClick={() => navigate('/admin/stock')}
            className="text-[#0071E3] hover:text-[#0077ED]"
          >
            Cancel
          </button>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Info (Non-editable) */}
            <div className="bg-white border border-gray-200 rounded-xl  p-6">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-lg bg-[#F5F5F7]">
                  {product?.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{product?.name}</h3>
               
                </div>
              </div>
            </div>

            {/* Stock Details */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Serial Number */}
                <div>
                  <label className="block text-sm font-medium text-[#1D1D1F] mb-2">
                    Serial Number
                  </label>
                  <input
                    type="text"
                    value={formData.serial_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, serial_number: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg bg-[#F5F5F7] border-0 focus:ring-2 focus:ring-[#0071E3]"
                    placeholder="Enter IMEI or Serial Number"
                    
                  />
                </div>

                {/* Color Picker */}
                <div>
                  <label className="block text-sm font-medium text-[#1D1D1F] mb-2">
                    Color
                  </label>
                  
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                      placeholder="#000000"
                      pattern="^#([A-Fa-f0-9]{6})$"
                      className="flex-1 px-4 py-2 rounded-lg bg-[#F5F5F7] border-0 focus:ring-2 focus:ring-[#0071E3]"
                      
                    />
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                      className="h-10 w-10 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                {/* Condition */}
                <div>
                  <label className="block text-sm font-medium text-[#1D1D1F] mb-2">
                    Condition
                  </label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg bg-[#F5F5F7] border-0 focus:ring-2 focus:ring-[#0071E3]"
                  >
                    <option value="new">New</option>
                    <option value="used">Used</option>
                    <option value="refurbished">Refurbished</option>
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
                    value={formData.quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg bg-[#F5F5F7] border-0 focus:ring-2 focus:ring-[#0071E3]"
                    required
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
                      setFormData(prev => ({ ...prev, cost_price: e.target.value }));
                      if (formData.selling_price) {
                        validatePrices(e.target.value, formData.selling_price);
                      }
                    }}
                    className={`w-full px-4 py-2 rounded-lg bg-[#F5F5F7] border-0 focus:ring-2 
                              focus:ring-[#0071E3] ${priceError ? 'ring-2 ring-red-500' : ''}`}
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
                      setFormData(prev => ({ ...prev, selling_price: e.target.value }));
                      if (formData.cost_price) {
                        validatePrices(formData.cost_price, e.target.value);
                      }
                    }}
                    className={`w-full px-4 py-2 rounded-lg bg-[#F5F5F7] border-0 focus:ring-2 
                              focus:ring-[#0071E3] ${priceError ? 'ring-2 ring-red-500' : ''}`}
                    required
                  />
                  {priceError && (
                    <p className="text-red-500 text-sm mt-1">{priceError}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || Boolean(priceError)}
              className="w-full px-4 py-2 bg-[#0071E3] text-white rounded-lg hover:bg-[#0077ED] 
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Stock'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditStock;