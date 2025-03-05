import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const ViewStock = () => {
  const [stocks, setStocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      const response = await api.get('/stocks');

      if (response.data.status === 'success') {
        setStocks(response.data.data);
        setFilteredStocks(response.data.data);
      }
    } catch (err) {

    } finally {
     
    }
  };

  const handleDelete = async (id) => {
    setDeleteLoading(true);
    try {
      const response = await api.delete(`/stocks/${id}`);
      if (response.data.status === 'success') {
        await fetchStocks();
        setShowDeleteModal(false);
      }
    } catch (err) {
    
    } finally {
      setDeleteLoading(false);
      setDeleteId(null);
    }
  };

  useEffect(() => {
    const filtered = stocks.filter(stock => 
      (stock.product?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (stock.serial_number?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
    setFilteredStocks(filtered);
  }, [searchTerm, stocks]);

  return (
    <div className="min-h-screen bg-[#FBFBFD] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-[#1D1D1F]">Stock Inventory</h1>
          <button
            onClick={() => navigate('/AddStock')}
            className="px-4 py-2 bg-[#0071E3] text-white rounded-lg hover:bg-[#0077ED]"
          >
            Add Stock
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by product name or serial number..."
            className="w-full px-4 py-2 rounded-lg bg-[#F5F5F7] border-0 focus:ring-2 focus:ring-[#0071E3]"
          />
        </div>

        {/* Desktop Table (hidden on mobile) */}
        <div className="hidden md:block">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#F5F5F7]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#86868B] uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#86868B] uppercase">Serial Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#86868B] uppercase">Color</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#86868B] uppercase">Condition</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#86868B] uppercase">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#86868B] uppercase">Price</th>
                  <th className="px-6 py-3 text-end text-xs font-medium text-[#86868B] uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStocks.map((stock) => (
                  <tr key={stock.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-lg bg-[#F5F5F7] mr-3">
                          {stock.product?.image ? (
                            <img
                              src={stock.product.image}
                              alt={stock.product?.name}
                              className="h-10 w-10 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-[#F5F5F7] flex items-center justify-center">
                              <svg className="w-6 h-6 text-[#86868B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-[#1D1D1F]">{stock.product?.name}</div>
                          <div className="text-sm text-[#86868B]">
                            {stock.product?.device_category?.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1D1D1F]">
                      {stock.serial_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div 
                          className="h-6 w-6 rounded-full mr-2"
                          style={{ backgroundColor: stock.color }}
                        />
                       
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        stock.condition === 'new' 
                          ? 'bg-green-100 text-green-800'
                          : stock.condition === 'used'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {stock.condition}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1D1D1F]">
                      {stock.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1D1D1F]">
                      ${stock.selling_price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <div className="flex justify-end space-x-3">
                        <button 
                          onClick={() => navigate(`/stocks/${stock.id}/edit`)}
                          className="text-[#0071E3] hover:text-[#0077ED]"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => {
                            setDeleteId(stock.id);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-500 hover:text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {filteredStocks.map((stock) => (
            <div key={stock.id} className="bg-white rounded-xl shadow-sm p-4">
              {/* Product Info */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-16 w-16 rounded-lg bg-[#F5F5F7] flex-shrink-0">
                  {stock.product?.image ? (
                    <img
                      src={stock.product.image}
                      alt={stock.product?.name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-lg bg-[#F5F5F7] flex items-center justify-center">
                      <svg className="w-8 h-8 text-[#86868B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-[#1D1D1F]">{stock.product?.name}</h3>
                  <p className="text-sm text-[#86868B]">{stock.product?.device_category?.name}</p>
                </div>
              </div>

              {/* Stock Details */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-[#86868B]">Serial Number</p>
                  <p className="font-medium">{stock.serial_number}</p>
                </div>
                <div>
                  <p className="text-[#86868B]">Color</p>
                  <div className="flex items-center">
                    <div 
                      className="h-4 w-4 rounded-full mr-2"
                      style={{ backgroundColor: stock.color }}
                    />
                    <span>{stock.color}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[#86868B]">Condition</p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    stock.condition === 'new' 
                      ? 'bg-green-100 text-green-800'
                      : stock.condition === 'used'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {stock.condition}
                  </span>
                </div>
                <div>
                  <p className="text-[#86868B]">Quantity</p>
                  <p className="font-medium">{stock.quantity}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[#86868B]">Price</p>
                  <p className="font-medium">Rs.{stock.selling_price}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button 
                  onClick={() => navigate(`/stocks/${stock.id}/edit`)}
                  className="px-4 py-2 text-[#0071E3] hover:bg-[#F5F5F7] rounded-lg"
                >
                  Edit
                </button>
                <button 
                  onClick={() => {
                    setDeleteId(stock.id);
                    setShowDeleteModal(true);
                  }}
                  className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium mb-4">Confirm Delete</h3>
            <p className="text-[#86868B] mb-6">Are you sure you want to delete this stock item?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                disabled={deleteLoading}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewStock;