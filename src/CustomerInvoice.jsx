import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "./api/axios";

const CustomerInvoice = () => {
  const { invoiceId } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInvoice();
  }, [invoiceId, fetchInvoice]);

  const fetchInvoice = useCallback(async () => {
    try {
      setLoading(true);
      
      // Remove last 3 digits from the invoice ID before making the API call
      const modifiedInvoiceId = invoiceId.slice(0, -3);
      
      const response = await api.get(`/invoices/${modifiedInvoiceId}`);
      
      if (response.data.status === "success") {
        setInvoice(response.data.data);
      } else {
        setError("Invoice not found");
      }
    } catch (err) {
      console.error("Failed to fetch invoice:", err);
      setError("Failed to load invoice. Please check the invoice ID and try again.");
    } finally {
      setLoading(false);
    }
  }, [invoiceId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4"><div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div><p className="text-gray-600">Loading...</p></div></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4"><div className="text-center"><h1 className="text-xl font-bold text-red-600 mb-2">Error</h1><p className="text-gray-600">{error}</p></div></div>;
  if (!invoice) return <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4"><div className="text-center"><h1 className="text-xl font-bold text-gray-800 mb-2">Invoice Not Found</h1><p className="text-gray-600">No invoice found</p></div></div>;

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md">
        {/* Header - Like PrintInvoice */}
        <div className="text-center p-6 sm:p-8">
          <div className="flex items-center justify-center gap-2 text-center">
            <img src="/images/apple-logo.svg" alt="apple logo" className="w-7 h-7 sm:w-9 sm:h-9" />
            <h1 className="text-xl sm:text-2xl font-medium pt-2">MyAppleCare</h1>
          </div>
          <p className="text-lg sm:text-2xl mt-4 sm:mt-6 font-medium">Thank You for Your Purchase!</p>
          <p className="text-xs text-gray-700 mt-2">We hope you enjoy your new product. It was a pleasure serving you!</p>
        </div>

        {/* Customer & Order Details - Like PrintInvoice */}
        <div className="px-4 sm:px-8 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 sm:mb-8">
            <div className="border rounded-lg p-3 sm:p-4">
              <h3 className="font-medium mb-2 text-sm sm:text-base">Customer Details</h3>
              <div className="text-sm space-y-1 border-0 border-t pt-2">
                <p className="text-[10px] text-gray-400">Name</p>
                <p className="font-medium text-sm sm:text-base">{invoice.first_name} {invoice.last_name}</p>
                <p className="text-[10px] text-gray-400">Mobile</p>
                <p className="font-medium text-sm sm:text-base">{invoice.contact_number}</p>
                <p className="text-[10px] text-gray-400">Payment Method</p>
                <p className="font-medium text-sm sm:text-base capitalize">{invoice.payment_method}</p>
              </div>
            </div>
            
            <div className="border rounded-lg p-3 sm:p-4">
              <h3 className="font-medium mb-2 text-sm sm:text-base">Order Details</h3>
              <div className="text-sm space-y-1 border-0 border-t pt-2">
                <p className="text-[10px] text-gray-400">Order ID</p>
                <p className="font-medium text-sm sm:text-base">#{invoice.id}</p>
                <p className="text-[10px] text-gray-400">Date</p>
                <p className="font-medium text-sm sm:text-base">
                  {new Date(invoice.created_at).toLocaleString()}
                </p>
                <p className="text-[10px] text-gray-400">Issued By</p>
                <p className="font-medium text-sm sm:text-base">{invoice.user?.name}</p>
              </div>
            </div>
          </div>

          {/* Items Table - Like PrintInvoice */}
          <div className="border rounded-md p-3 sm:p-4 pt-2 mb-6 sm:mb-8">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-[10px] sm:text-xs">
                  <th className="text-left py-2 font-medium">Product Name</th>
                  <th className="text-center font-medium hidden sm:table-cell">Qty</th>
                  <th className="text-center font-medium sm:hidden">Q</th>
                  <th className="text-center font-medium hidden sm:table-cell">Price</th>
                  <th className="text-center font-medium sm:hidden">Rs</th>
                  <th className="text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items?.map(item => (
                  <tr key={item.id} className="border-b">
                    <td className="py-2 font-medium text-xs sm:text-sm">
                      <div>
                        <div>{item.product?.name}</div>
                        {item.serial_number && (
                          <span className="text-gray-500 text-[10px]"> ({item.serial_number})</span>
                        )}
                        {/* Show quantity and price on mobile */}
                        <div className="sm:hidden text-[10px] text-gray-500 mt-1">
                          x{item.quantity} • {parseFloat(item.sold_price).toLocaleString()} LKR
                        </div>
                      </div>
                    </td>
                    <td className="text-center text-gray-500 text-xs sm:text-sm hidden sm:table-cell">x{item.quantity}</td>
                    <td className="text-center text-gray-500 text-xs sm:hidden">x{item.quantity}</td>
                    <td className="text-center text-gray-500 text-xs sm:text-sm hidden sm:table-cell">{parseFloat(item.sold_price).toLocaleString()} LKR</td>
                    <td className="text-center text-gray-500 text-xs sm:hidden">{parseFloat(item.sold_price).toLocaleString()}</td>
                    <td className="text-right text-gray-500 text-xs sm:text-sm">
                      {(item.quantity * parseFloat(item.sold_price)).toLocaleString()} LKR
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals - Like PrintInvoice */}
          <div className="flex justify-end mb-6 sm:mb-8">
            <div className="space-y-2 text-sm w-full sm:w-48">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span>
                  {invoice.items?.reduce((sum, item) => 
                    sum + (item.quantity * parseFloat(item.sold_price)), 0
                  ).toLocaleString()} LKR
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Discount:</span>
                <span>
                  {invoice.items?.reduce((sum, item) => 
                    sum + parseFloat(item.discount || 0), 0
                  ).toLocaleString()} LKR
                </span>
              </div>
              <div className="border-t pt-2 font-medium flex justify-between">
                <span>Total due:</span>
                <span>{parseFloat(invoice.total_amount).toLocaleString()} LKR</span>
              </div>
            </div>
          </div>

          {/* Footer - Like PrintInvoice */}
          <div className="text-center text-xs text-gray-500 border-t pt-4">
            <p>No 03, 2nd FLOOR, MC Plazza, Kurunegala, Sri Lanka</p>
            <p className="mt-1">+94 769991183</p>
          </div>
        </div>

        {/* Print Button */}
        <div className="p-4 sm:p-6 print:hidden border-t">
          <div className="flex justify-center">
            <button
              onClick={handlePrint}
              className="bg-black hover:bg-gray-900 text-white px-4 sm:px-6 py-2 rounded font-medium transition-colors duration-200 flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center"
            >
              Print Invoice
              <img src="/images/print.svg" alt="print" className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerInvoice;
