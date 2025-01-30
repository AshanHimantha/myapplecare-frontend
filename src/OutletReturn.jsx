import React, { useState } from 'react';
import api from './api/axios';
import SalesOutletNav from './components/SalesOutletNav';

const OutletReturn = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [returnQuantities, setReturnQuantities] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.get(`/invoices/${searchTerm}`);
      if (response.data.status === 'success') {
        setInvoice(response.data.data);
      }
    } catch (err) {
      setError('Invoice not found');
      setInvoice(null);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (itemId, quantity) => {
    setReturnQuantities({
      ...returnQuantities,
      [itemId]: parseInt(quantity)
    });
  };

  const handleReturn = async () => {
    try {
      const response = await api.post('/returns', {
        invoice_id: invoice.id,
        items: [{
          item_id: selectedItem.id,
          quantity: returnQuantities[selectedItem.id]
        }]
      });

      if (response.data.status === 'success') {
        setIsConfirmModalOpen(false);
        setSelectedItem(null);
        setReturnQuantities({});
        setInvoice(null);
      }
    } catch (err) {
      setError('Failed to process return');
    }
  };

  const handleDecrement = async (itemId, currentQty) => {
    try {
      const response = await api.post('/returns', {
        invoice_id: invoice.id,
        items: [{
          item_id: itemId,
          quantity: 1 // Decrement by 1
        }]
      });

      if (response.data.status === 'success') {
        // Update local state
        const updatedItems = invoice.items.map(item => {
          if (item.id === itemId) {
            return { ...item, quantity: currentQty - 1 };
          }
          return item;
        });
        setInvoice({ ...invoice, items: updatedItems });
      }
    } catch (err) {
      setError('Failed to update quantity');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
		<SalesOutletNav />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Product Return</h1>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter Invoice Number"
              className="flex-1 p-2 border rounded"
            />
            <button 
              type="submit"
              className="px-4 py-2 bg-black text-white rounded"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {error && (
          <div className="text-red-500 mb-4">{error}</div>
        )}

        {/* Invoice Details */}
        {invoice && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">Invoice #{invoice.id}</h2>
                <div className="text-sm text-gray-600 mt-1">
                  <p>{invoice.first_name} {invoice.last_name}</p>
                  <p>{invoice.contact_number}</p>
                  <p>Date: {new Date(invoice.created_at).toLocaleString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold">Total: {parseFloat(invoice.total_amount).toLocaleString()} LKR</p>
                <p className="text-sm text-gray-600">Payment: {invoice.payment_method}</p>
              </div>
            </div>

            <div className="divide-y">
              {invoice.items.map(item => (
                <div key={item.id} className="py-4 flex items-center justify-between">
                  <div className="flex gap-4">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="w-16 h-16 object-contain rounded p-3 border border-gray-200"
                    />
                    <div>
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-sm text-gray-600">SN: {item.serial_number}</p>
                      {/* <p className="text-sm">Qty: {item.quantity}</p> */}
                    </div>
                  </div>
                  <div className="flex items-end gap-4">
                    <div className="text-right">
                      <p className="font-medium">{parseFloat(item.sold_price).toLocaleString()} LKR</p>

<div className='flex gap-2 mt-2'>
Qty : {item.quantity}

{item.quantity > 1 ? (
                     <button
					 onClick={() => handleDecrement(item.id, item.quantity)}
					 
					 className="flex shrink-0 bg-white rounded-full h-6 w-6 shadow-[0px_1px_2px_rgba(0,0,0,0.25)]  flex-col justify-center items-center  disabled:opacity-50"
				   >
					 -
				   </button>













                    ) : (
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setIsConfirmModalOpen(true);
                        }}
                        className="px-2 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
                      >
                        Remove
                      </button>
                    )}
</div>
					 
                    </div>
                  
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Return Confirmation Modal */}
        {isConfirmModalOpen && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h3 className="text-lg font-semibold mb-4">Return Item</h3>
              <div className="mb-4">
                <p className="font-medium">{selectedItem.product.name}</p>
                <p className="text-sm text-gray-600">SN: {selectedItem.serial_number}</p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Return Quantity</label>
                <input
                  type="number"
                  min="1"
                  max={selectedItem.quantity}
                  value={returnQuantities[selectedItem.id] || 1}
                  onChange={(e) => handleQuantityChange(selectedItem.id, e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setIsConfirmModalOpen(false);
                    setSelectedItem(null);
                  }}
                  className="px-4 py-2 text-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReturn}
                  className="px-4 py-2 bg-red-600 text-white rounded"
                >
                  Confirm Return
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutletReturn;