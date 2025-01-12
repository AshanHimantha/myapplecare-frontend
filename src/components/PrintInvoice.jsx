import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReactToPrint } from 'react-to-print';
import { toast } from 'react-toastify';
import api from "../api/axios";


const InvoiceHeader = () => (
  <div className="text-center mb-8 ">
    <div className="flex items-center justify-center gap-2 text-center">
      <img src="/images/apple-logo.svg" alt="apple logo" className="w-9 h-9 print:block" />
      <h1 className="text-2xl font-medium pt-2">MyAppleCare</h1>
    </div>
    <p className="text-2xl mt-6 font-medium">Thank You for Your Purchase!</p>
    <p className="text-xs text-gray-700">We hope you enjoy your new product. It was a pleasure serving you!</p>
  </div>
);

const CustomerDetails = ({ details }) => (
  <div className="grid grid-cols-2 gap-4 mb-8">
    <div className="border rounded-lg p-4">
      <h3 className="font-medium mb-2">Customer Details</h3>
      <div className="text-sm space-y-1 border-0 border-t ">
        <p className='text-[10px] text-gray-400 mt-2'>Name</p>
        <p className='font-medium'>{details.firstName} {details.lastName}</p>
        <p className='text-[10px] text-gray-400'>Mobile</p>
        <p className='font-medium'> {details.contactNo}</p>
        <p className='text-[10px] text-gray-400'>Payment Method</p>
        <p className='font-medium'>{details.paymentMethod}</p>
      </div>
    </div>
    <div className="border rounded-lg p-4">
      <h3 className="font-medium mb-2">Order Details</h3>
      <div className="text-sm space-y-1 border-0 border-t ">
      <p className='text-[10px] text-gray-400 mt-2'>Order ID</p>
        <p className='font-medium '> #{details.orderId}</p>
        <p className='text-[10px] text-gray-400'>Date</p>
        <p className='font-medium'>{details.dateTime}</p>
        <p className='text-[10px] text-gray-400'>Issued By</p>
        <p className='font-medium'>{details.user}</p>
        
      </div>
    </div>
  </div>
);

const ProductTable = ({ items, startIndex, endIndex }) => (
  <div className="border rounded-md p-4 pt-2">
    <table className="w-full text-sm">
      <thead className="border-b">
        <tr className="text-[10px]">
          <th className="text-left py-2 font-medium ">Product Name</th>
          <th className="text-center  font-medium ">Qty</th>
          <th className="text-center  font-medium  ">Price</th>
          <th className="text-right  font-medium  ">Total</th>
        </tr>
      </thead>
      <tbody>
        {items.slice(startIndex, endIndex).map(item => (
          <tr key={item.id} className="border-b">
            <td className="py-2 font-medium">
              {item.stock.product.name}
              {item.stock.product.device_category_id === 1 && 
                <span className="text-gray-500 text-[10px]"> ({item.stock.serial_number})</span>
              }   

            </td>
            <td className="text-center text-gray-500">x{item.quantity}</td>
            <td className="text-center text-gray-500">{item.stock.selling_price} LKR</td>
            <td className="text-right text-gray-500">
              {(item.quantity * parseFloat(item.stock.selling_price)).toLocaleString()} LKR
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const InvoiceFooter = () => (
  <div className="absolute bottom-[5mm] left-0 w-full text-center text-xs text-gray-500">
    <div className="border-t mx-[20mm] pt-4">
      <p>No 03, 2nd FLOOR, MC Plazza, Kurunegala, Sri Lanka</p>
      <p className="mt-1">+94 769991183</p>
    </div>
  </div>
);

const PrintInvoice = ({ isOpen, onClose, invoiceId }) => {
  const contentRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [invoiceData, setInvoiceData] = useState(null);

  const printHandler = useReactToPrint({
    contentRef,
  });

  const handleClose = () => {
    window.location.reload();
    onClose();
  };


  useEffect(() => {
    const fetchInvoice = async () => {
      if (!invoiceId) return;
      
      try {
        setLoading(true);
        const response = await api.get(`/invoices/${invoiceId}`);
        
        if (response.data.status === "success") {
          setInvoiceData(response.data.data);      
         
        }
      } catch (err) {
        toast.error("Failed to fetch invoice");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceId]);

  if (loading || !invoiceData) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg">
              Loading invoice...
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  const customerDetails = {
    firstName: invoiceData.first_name,
    lastName: invoiceData.last_name,
    contactNo: invoiceData.contact_number,
    orderId: invoiceData.id,
    dateTime: new Date(invoiceData.created_at).toLocaleString(),
    paymentMethod: invoiceData.payment_method,
    user: invoiceData.user.name
  };

  const items = invoiceData.items.map(item => ({
    id: item.id,
    quantity: item.quantity,
    stock: {
      product: {
        name: item.product?.name || 'Unknown Product',
        device_category_id: item.product?.device_category_id
      },
      selling_price: item.sold_price,
      serial_number: item.serial_number
    }
  }));

  const totalDiscount = invoiceData.items.reduce((sum, item) => {
    return sum + Number(item.discount || 0);
  }, 0);
  
  const subTotal = invoiceData.items.reduce((sum, item) => {
    const itemTotal = Number(item.sold_price || 0) * Number(item.quantity || 0);
    return sum + itemTotal;
  }, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          {/* Outer container */}
          <div className="bg-white rounded-lg w-full max-w-5xl h-[95vh] m-4 flex flex-col">
            {/* Scroll area */}
            <div className="flex-1 overflow-auto p-6">
              <div className="flex justify-center">
                {/* A4 page container */}
                <div ref={contentRef}>
                  <div 
                    className="w-[210mm] min-h-[297mm] bg-white shadow-lg mx-auto"
                    style={{
                      padding: '10mm 20mm 40mm',
                      position: 'relative'
                    }}
                  >
                    <InvoiceHeader />
                    <CustomerDetails details={customerDetails} />
                    <ProductTable items={items} />
                    
                    {/* Totals section */}
                    <div className="absolute bottom-[40mm] right-[20mm] space-y-2 text-sm">
                      <div className="flex justify-between w-48">
                        <span className="text-gray-600">Subtotal:</span>
                        <span>{subTotal.toLocaleString()} LKR</span>
                      </div>
                      <div className="flex justify-between w-48">
                        <span className="text-gray-600">Discount:</span>
                        <span>{totalDiscount.toLocaleString()} LKR</span>
                      </div>
                      <div className="border-t pt-2 font-medium flex justify-between w-48">
                        <span>Total due:</span>
                        <span>{(subTotal-totalDiscount).toLocaleString()} LKR</span>
                      </div>
                    </div>

                    <InvoiceFooter />
                  </div>
                </div>
              </div>
            </div>

            {/* Fixed bottom buttons */}
            <div className="p-4 border-t flex justify-between items-center bg-white">
              <button 
                onClick={handleClose} 
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Close
              </button>
              <button 
                onClick={printHandler}
                className="bg-black text-white px-6 py-2 rounded flex items-center gap-2 hover:bg-gray-900"
              >
                Print Invoice
                <img src="/images/print.svg" alt="print" className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PrintInvoice;