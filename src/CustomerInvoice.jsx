import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "./api/axios";

const CustomerInvoice = () => {
  const { invoiceId } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isValidated, setIsValidated] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [validationError, setValidationError] = useState("");
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    fetchInvoice();
  }, [invoiceId]);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/invoices/${invoiceId}`);
      
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
  };

  const validateMobileNumber = async () => {
    if (!mobileNumber.trim()) {
      setValidationError("Please enter your mobile number");
      return;
    }

    // Clean the mobile number (remove spaces, dashes, etc.)
    const cleanMobile = mobileNumber.replace(/[\s\-\(\)]/g, '');
    
    // Basic validation for Sri Lankan mobile numbers
    if (cleanMobile.length < 9 || cleanMobile.length > 10) {
      setValidationError("Please enter a valid mobile number");
      return;
    }

    setValidating(true);
    setValidationError("");

    try {
      // Check if the mobile number matches the invoice
      if (invoice && invoice.contact_number) {
        const invoiceMobile = invoice.contact_number.replace(/[\s\-\(\)]/g, '');
        
        // Compare the numbers (allow for different formats)
        if (cleanMobile === invoiceMobile || 
            cleanMobile === invoiceMobile.substring(1) || // Remove country code
            `0${cleanMobile}` === invoiceMobile || // Add leading zero
            cleanMobile === `94${invoiceMobile.substring(1)}`) { // Add country code
          setIsValidated(true);
          setValidationError("");
        } else {
          setValidationError("Mobile number does not match our records for this invoice");
        }
      } else {
        setValidationError("Unable to validate mobile number");
      }
    } catch (err) {
      setValidationError("Validation failed. Please try again.");
    } finally {
      setValidating(false);
    }
  };

  const handleMobileSubmit = (e) => {
    e.preventDefault();
    validateMobileNumber();
  };

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (amount) => {
    return `LKR ${parseFloat(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4"><div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div><p className="text-gray-600">Loading...</p></div></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4"><div className="text-center"><h1 className="text-xl font-bold text-red-600 mb-2">Error</h1><p className="text-gray-600">{error}</p></div></div>;
  if (!invoice) return <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4"><div className="text-center"><h1 className="text-xl font-bold text-gray-800 mb-2">Invoice Not Found</h1><p className="text-gray-600">No invoice found</p></div></div>;

  // Show validation form if not validated
  if (!isValidated) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <img src="/images/apple-logo.svg" alt="apple logo" className="w-8 h-8" />
              <h1 className="text-xl font-medium">MyAppleCare</h1>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Verify Your Identity</h2>
            <p className="text-sm text-gray-600">Please enter your mobile number to view invoice #{invoiceId}</p>
          </div>

          <form onSubmit={handleMobileSubmit} className="space-y-4">
            <div>
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </label>
              <input
                type="tel"
                id="mobile"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your mobile number"
                required
              />
              {validationError && (
                <p className="mt-2 text-sm text-red-600">{validationError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={validating}
              className="w-full bg-black hover:bg-gray-900 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {validating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Validating...
                </>
              ) : (
                "View Invoice"
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500">
            <p>Enter the mobile number associated with this invoice</p>
            <p className="mt-1">Having trouble? Contact us at +94 769991183</p>
          </div>
        </div>
      </div>
    );
  }

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
                  <th className="text-center font-medium sm:hidden">₹</th>
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
