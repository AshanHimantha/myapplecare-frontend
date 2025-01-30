import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import SalesOutletNav from './SalesOutletNav';


const ViewInvoice = () => {
  const { id } = useParams(); // Get id from URL
  const [loading, setLoading] = useState(true);
  const [invoiceData, setInvoiceData] = useState(null);
  const [error, setError] = useState(null);
 

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!id) {
        setError('No invoice ID provided');
        return;
      }
      
      try {
        setLoading(true);
        const response = await api.get(`/invoices/${id}`);
        if (response.data.status === "success") {
          setInvoiceData(response.data.data);
        }
      } catch (err) {
        setError('Failed to fetch invoice');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!invoiceData) return <div>No invoice found</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
		<SalesOutletNav />
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <img src="/images/apple-logo.svg" alt="logo" className="w-8 h-8" />
              <h1 className="text-xl font-medium">MyAppleCare</h1>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-sm text-gray-500">Invoice #{invoiceData.id}</p>
              <p className="text-sm text-gray-500">
                {new Date(invoiceData.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Customer & Order Details */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium mb-3">Customer Details</h3>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-500">Name</p>
                <p className="font-medium">{invoiceData.first_name} {invoiceData.last_name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Contact</p>
                <p className="font-medium">{invoiceData.contact_number}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Payment Method</p>
                <p className="font-medium">{invoiceData.payment_method}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium mb-3">Order Details</h3>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-500">Issued By</p>
                <p className="font-medium">{invoiceData.user.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Date & Time</p>
                <p className="font-medium">
                  {new Date(invoiceData.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="p-6 overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="border-b">
              <tr className="text-sm text-gray-600">
                <th className="text-left py-2">Product</th>
                <th className="text-center">Qty</th>
                <th className="text-right">Price</th>
                <th className="text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {invoiceData.items.map(item => (
                <tr key={item.id} className="text-sm">
                  <td className="py-3">
                    <div>
                      {item.product?.name}
                      {item.serial_number && (
                        <span className="text-xs text-gray-500 block">
                          SN: {item.serial_number}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-right">{parseFloat(item.sold_price).toLocaleString()} LKR</td>
                  <td className="text-right">
                    {(item.quantity * parseFloat(item.sold_price)).toLocaleString()} LKR
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="p-6 border-t bg-gray-50">
          <div className="ml-auto w-full sm:w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span>
                {invoiceData.items.reduce((sum, item) => 
                  sum + (item.quantity * parseFloat(item.sold_price)), 0
                ).toLocaleString()} LKR
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Discount:</span>
              <span>
                {invoiceData.items.reduce((sum, item) => 
                  sum + parseFloat(item.discount || 0), 0
                ).toLocaleString()} LKR
              </span>
            </div>
            <div className="pt-2 border-t flex justify-between font-medium">
              <span>Total:</span>
              <span>{parseFloat(invoiceData.total_amount).toLocaleString()} LKR</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewInvoice;