import React, { useState, useEffect } from "react";
import api from "./api/axios";
import SalesOutletNav from "./components/SalesOutletNav";

const OutletReturn = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [returnQuantities, setReturnQuantities] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(false);
  const [returnType, setReturnType] = useState('stock'); // Add this with other state declarations

  // Add reset function after other state declarations
  const handleReset = () => {
    setInvoice(null);
    setSearchTerm("");
    setError(null);
  };

  // Modify the handleSearch function to accept an optional invoice ID
  const handleSearch = async (e, invoiceId = null) => {
    e?.preventDefault(); // Make preventDefault optional
    setError(null);
    setLoading(true);

    try {
      // Use either the passed invoiceId or searchTerm
      const searchId = invoiceId || searchTerm;
      const response = await api.get(`/invoices/${searchId}`);
      if (response.data.status === "success") {
        if (parseFloat(response.data.data.total_amount) === 0) {
          setError("Invalid invoice - Total amount is 0");
          setInvoice(null);
        } else {
          setInvoice(response.data.data);
        }
      }
    } catch (err) {
      setError("Invoice not found");
      setInvoice(null);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (itemId, quantity) => {
    setReturnQuantities({
      ...returnQuantities,
      [itemId]: parseInt(quantity),
    });
  };

  const handleReturn = async () => {
    try {
      const requestBody = {
        invoice_id: String(invoice.id), // Convert to string
        items: [
          {
            item_id: selectedItem.id,
            quantity: returnQuantities[selectedItem.id] || 1,
            return_type: returnType
          }
        ]
      };


      const response = await api.post("/invoices/return", requestBody);


      if (response.data.status === "success") {
        setIsConfirmModalOpen(false);
        setSelectedItem(null);
        setReturnQuantities({});
        setReturnType('stock');
        setInvoice(null);
      }
    } catch (err) {
      console.error('Return Error:', err);
      setError("Failed to process return");
    }
  };

  const fetchRecentInvoices = async () => {
    setLoadingRecent(true);
    try {
      const response = await api.get("/invoices");
      if (response.data.status === "success") {
        setRecentInvoices(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch recent invoices");
    } finally {
      setLoadingRecent(false);
    }
  };

  useEffect(() => {
    fetchRecentInvoices();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <SalesOutletNav />
      <div className="max-w-4xl mx-auto mt-5 border border-gray-200 p-6 rounded-lg bg-white">
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
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        {/* Invoice Details */}
        {invoice && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
                    clipRule="evenodd" 
                  />
                </svg>
                Back to Recent Invoices
              </button>
            </div>
            <div className="flex justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">Invoice #{invoice.id}</h2>
                <div className="text-sm text-gray-600 mt-1">
                  <p>
                    {invoice.first_name} {invoice.last_name}
                  </p>
                  <p>{invoice.contact_number}</p>
                  <p>Date: {new Date(invoice.created_at).toLocaleString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold">
                  Total: {parseFloat(invoice.total_amount).toLocaleString()} LKR
                </p>
                <p className="text-sm text-gray-600">
                  Payment: {invoice.payment_method}
                </p>
              </div>
            </div>

            <div className="divide-y">
              {invoice.items.map((item) => (
                <div
                  key={item.id}
                  className="py-4 flex items-center justify-between"
                >
                  <div className="flex gap-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-contain rounded p-3 border border-gray-200"
                    />
                    <div>
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-sm text-gray-600">
                        SN: {item.serial_number}
                      </p>                  
                    </div>
                  </div>
                  <div className="flex items-end gap-4 ">
                    <div className="text-right ">
                      <p className="font-medium">
                        {parseFloat(item.sold_price).toLocaleString()} LKR
                      </p>

                      <div className="flex gap-2 mt-2 justify-end">
                        Qty : {item.quantity}
                        <div className="flex gap-1">
                          
                              <button
                                onClick={() => {
                                  setSelectedItem(item);
                                  setIsConfirmModalOpen(true);
                                }}
                                className="flex shrink-0 bg-white rounded-full h-6 w-6 shadow-[0px_1px_2px_rgba(0,0,0,0.25)] flex-col justify-center items-center disabled:opacity-50"
                              >
                                ↺
                              </button>
                           
                          
                        </div>
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
                <p className="text-sm text-gray-600">
                  SN: {selectedItem.serial_number}
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Return Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedItem.quantity}
                  value={returnQuantities[selectedItem.id] || 1}
                  onChange={(e) =>
                    handleQuantityChange(selectedItem.id, e.target.value)
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Return Type
                </label>
                <select
                  value={returnType}
                  onChange={(e) => setReturnType(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="stock">Return to Stock</option>
                  <option value="damaged">Damaged</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setIsConfirmModalOpen(false);
                    setSelectedItem(null);
                    setReturnType('stock'); // Reset return type when closing
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

        {!invoice && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Recent Invoices</h2>
            {loadingRecent ? (
              <div className="text-center py-4">Loading...</div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {recentInvoices
                  .filter(inv => parseFloat(inv.total_amount) > 0)
                  .map((inv) => (
                  <div
                    key={inv.id}
                    className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={(e) => {
                      setSearchTerm(inv.id);
                      handleSearch(e, inv.id);
                    }}
                  >
                    <div className="flex justify-between items-start ">
                      <div>
                        <h3 className="font-medium">Invoice #{inv.id}</h3>
                        <p className="text-sm text-gray-600">
                          {inv.first_name} {inv.last_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(inv.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="font-medium">
                        {parseFloat(inv.total_amount).toLocaleString()} LKR
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OutletReturn;
