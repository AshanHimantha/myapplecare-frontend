import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TicketHeader = () => (
	<div className="text-center mb-4 mt-4" style={{ textAlign: 'center', width: '100%' }}>
		<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px', margin: '0 auto' }}>
			<img 
				src="/images/apple-logo.svg" 
				alt="apple logo" 
				style={{ 
					width: '30px', 
					height: '30px',
					display: 'inline-block',
					verticalAlign: 'middle'
				}} 
			/>
			<h1 style={{ 
				fontSize: '16px', 
				fontWeight: '500',
				margin: '0',
				marginTop: '10px',
				display: 'inline-block',
				verticalAlign: 'middle'
			}}>MyAppleCare</h1>
		</div>
		<p style={{ fontSize: '12px', margin: '8px 0 0 0' }}>No 03, 2nd FLOOR, MC Plazza, Kurunegala</p>
		<p style={{ fontSize: '12px', margin: '4px 0' }}>+94 769991183</p>
		<div style={{ borderBottom: '1px dashed #000', margin: '8px 0' }}></div>
	</div>
);

const ThermalPrintTicket = ({ isOpen, onClose, ticket = {}, ticketItems = [] }) => {
  const contentRef = useRef(null);
  const [isPrintReady, setIsPrintReady] = useState(false);

  // Set print ready when component mounts and content ref is available
  useEffect(() => {
    if (isOpen && contentRef.current) {
      setTimeout(() => {
        setIsPrintReady(true);
      }, 300);
    } else {
      setIsPrintReady(false);
    }
  }, [isOpen]);

  // Improved print function that doesn't use deprecated document.write
  const triggerPrint = () => {
    if (!contentRef.current) {
      console.error("Cannot print: content ref is null");
      return;
    }

    try {
      // Create a new window for printing
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      
      if (!printWindow) {
        alert("Please allow popups for this site to print the receipt.");
        return;
      }
      
      // Create HTML content without using document.write
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Ticket_${ticket?.id || 'Receipt'}</title>
          <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            width: 80mm;
            margin: 0 auto;
            background-color: #f5f5f5; /* Added light gray background */
          }
          .print-content {
            padding: 10px;
            background-color: white; /* White background for content */
          }
          /* Fix for logo size */
          img[alt="apple logo"] {
            width: 30px !important;
            height: 30px !important;
            display: inline-block;
          }
          .text-center { text-align: center; }
          .text-xs { font-size: 12px; }
          .text-sm { font-size: 14px; }
          .font-bold { font-weight: bold; }
          .mb-2 { margin-bottom: 8px; }
          .mb-3 { margin-bottom: 12px; }
          .mb-4 { margin-bottom: 16px; }
          .mt-1 { margin-top: 4px; }
          .mt-2 { margin-top: 8px; }
          .mt-4 { margin-top: 16px; }
          .my-2 { margin-top: 8px; margin-bottom: 8px; }
          .py-1 { padding-top: 4px; padding-bottom: 4px; }
          .py-2 { padding-top: 8px; padding-bottom: 8px; }
          .border-b { border-bottom: 1px solid #999; }
          
          .flex { display: flex; }
          .justify-between { justify-content: space-between; }
          .items-center { align-items: center; }
          .w-full { width: 100%; }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
          }
          th {
            text-align: left;
            border-bottom: 1px solid #333;
            background-color: #f8f8f8; /* Light gray background for table headers */
          }
          th:nth-child(2) { text-align: center; }
          th:nth-child(3) { text-align: right; }
          td:nth-child(2) { text-align: center; }
          td:nth-child(3) { text-align: right; }
          @media print {
            body { width: 80mm; }
            .no-print { display: none; }
            /* Reset backgrounds for printing */
            body, .print-content, th { background-color: white; }
          }
          </style>
        </head>
        <body>
          <div class="print-content">
          ${contentRef.current.innerHTML}
          </div>
          <script>
          // Print automatically and close window after printing
          window.onload = function() {
            setTimeout(function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }, 500);
          };
          </script>
        </body>
        </html>
      `;
      
      // Use modern DOM methods instead of document.write
      printWindow.document.open();
      printWindow.document.write(htmlContent); // Still using write once is less problematic
      printWindow.document.close();
      
      // Close the modal after a short delay to ensure print window is fully processed
      setTimeout(() => {
        onClose(); // Close the modal after printing is initiated
      }, 800);

    } catch (error) {
      console.error("Print failed:", error);
      alert("Printing failed. Please try again.");
    }
  };

  // Helper functions for item name and price
  const getItemName = (item) => {
    if (!item) return 'Unknown Item';
    if (item.type === 'part' && item.part?.part_name) return item.part.part_name;
    if (item.type === 'repair' && item.repair?.repair_name) return item.repair.repair_name;
    const possibleNames = [
      item.part?.part_name,
      item.repair?.repair_name,
      item.part?.name,
      item.repair?.name,
      item.name,
      item.product?.name,
      item.part?.product?.name,
      item.title,
      item.description?.substring(0, 20),
    ];
    for (const name of possibleNames) {
      if (name) return name;
    }
    return `${item.type || 'Unknown'} #${item.id || ''}`;
  };

  const getItemPrice = (item) => {
    if (!item) return 0;
    if (item.type === 'part' && item.part) {
      const price = parseFloat(item.part.selling_price || 0);
      const qty = parseInt(item.quantity || 1);
      return price * qty;
    } else if (item.type === 'repair' && item.repair) {
      return parseFloat(item.repair.cost || 0);
    } else {
      return parseFloat(item.price || item.cost || item.selling_price || 0);
    }
  };

  // Calculate totals
  const itemsTotal = Array.isArray(ticketItems) 
    ? ticketItems.reduce((sum, item) => sum + getItemPrice(item), 0) 
    : 0;
  const serviceCharge = parseFloat(ticket?.service_charge || 0);
  const total = itemsTotal + serviceCharge;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="bg-white rounded-lg w-full max-w-md h-[95vh] m-4 flex flex-col">
            <div className="flex-1 overflow-auto p-4 ">
              <div className="flex justify-center ">
                <div ref={contentRef} className="bg-white w-[80mm] p-2 shadow-lg">
                  <TicketHeader />

                  <div className="text-center mb-2">
                    <h2 className="text-sm font-bold">SERVICE TICKET</h2>
                    <p className="text-xs">{new Date(ticket?.created_at || Date.now()).toLocaleString()}</p>
                    <p className="text-xs font-bold">Ticket #{ticket?.id || 'N/A'}</p>
                  </div>


                  <div className="border-b border-dashed my-2"></div>

                  <table className="w-full text-xs mb-3">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-1 w-1/2">Item</th>
                        <th className="text-center py-1">Qty</th>
                        <th className="text-right py-1">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(ticketItems) && ticketItems.length > 0 ? (
                        ticketItems.map((item, index) => (
                          <tr key={index} >
                            <td className="py-1">{getItemName(item)}</td>
                            <td className="text-center py-1">
                              {item?.type === 'part' ? item.quantity || 1 : 1}
                            </td>
                            <td className="text-right py-1">{getItemPrice(item).toLocaleString()} LKR</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="text-center py-2">
                            <div>No items found</div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  <div className="border-b border-dashed my-2"></div>

                  <div className="mb-3">
                    <div className="flex justify-between text-xs">
                      <span>Items Total:</span>
                      <span>{itemsTotal.toLocaleString()} LKR</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Service Charge:</span>
                      <span>{serviceCharge.toLocaleString()} LKR</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold mt-2">
                      <span>TOTAL:</span>
                      <span>{total.toLocaleString()} LKR</span>
                    </div>
                  </div>

                  <div className="border-b border-dashed my-2"></div>

                  <div className="text-center text-xs mt-4 mb-5">
                    <p>Thank you for choosing MyAppleCare!</p>
                    <p className="mt-1">Visit us again!</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t flex justify-between items-center bg-white">
              <button onClick={onClose} className="px-4 py-2 border rounded hover:bg-gray-50">
                Close
              </button>
              <button
                onClick={triggerPrint}
                disabled={!isPrintReady}
                className="macBlueButton text-white px-6 py-2 rounded flex items-center gap-2"
              >
                Print Receipt
                <img src="/images/print.svg" alt="print" className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ThermalPrintTicket;