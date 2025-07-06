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

const TempTicketPrint = ({ isOpen, onClose, ticket = {} }) => {
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

  // Print function for temporary ticket
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
      
      // Create HTML content for temporary ticket
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Temp_Ticket_${ticket?.id || 'Receipt'}</title>
          <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            width: 80mm;
            margin: 0 auto;
            background-color: #f5f5f5;
          }
          .print-content {
            padding: 10px;
            background-color: white;
          }
          img[alt="apple logo"] {
            width: 30px !important;
            height: 30px !important;
            display: inline-block;
          }
          .text-center { text-align: center; }
          .text-xs { font-size: 12px; }
          .text-sm { font-size: 14px; }
          .text-lg { font-size: 18px; }
          .text-xl { font-size: 24px; }
          .font-bold { font-weight: bold; }
          .mb-1 { margin-bottom: 4px; }
          .mb-2 { margin-bottom: 8px; }
          .mb-3 { margin-bottom: 12px; }
          .mb-4 { margin-bottom: 16px; }
          .mb-5 { margin-bottom: 20px; }
          .mt-1 { margin-top: 4px; }
          .mt-2 { margin-top: 8px; }
          .mt-4 { margin-top: 16px; }
          .my-2 { margin-top: 8px; margin-bottom: 8px; }
          .my-4 { margin-top: 16px; margin-bottom: 16px; }
          .py-1 { padding-top: 4px; padding-bottom: 4px; }
          .py-2 { padding-top: 8px; padding-bottom: 8px; }
          .border-b { border-bottom: 1px solid #999; }
          
          .ticket-id-box {
            border: 2px solid #000;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
            background-color: #f9f9f9;
          }
          
          @media print {
            body { width: 80mm; }
            .no-print { display: none; }
            body, .print-content { background-color: white; }
          }
          </style>
        </head>
        <body>
          <div class="print-content">
          ${contentRef.current.innerHTML}
          </div>
          <script>
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
      
      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Close the modal after a short delay
      setTimeout(() => {
        onClose();
      }, 800);

    } catch (error) {
      console.error("Print failed:", error);
      alert("Printing failed. Please try again.");
    }
  };

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
            <div className="flex-1 overflow-auto p-4">
              <div className="flex justify-center">
                <div ref={contentRef} className="bg-white w-[80mm] p-2 shadow-lg text-center">
                  <TicketHeader />

                  <div className="text-center mb-4">
                    <h2 className="text-lg font-bold">TEMPORARY RECEIPT</h2>
                    <p className="text-xs ">Keep this receipt safe</p>
                  </div>

                  <div className="ticket-id-box">
                    <p className="text-sm font-bold mb-2">Your Service Ticket ID</p>
                    <p className="text-4xl font-bold mb-5">#{ticket?.id || 'N/A'}</p>
                  </div>

                  <div className="mb-4">
                   
                    <p className="text-xs ">
                      <strong>Device:</strong> {ticket?.device_model || 'N/A'}
                    </p>

                    <p className="text-xs mb-2">
                      <strong>Date:</strong> {new Date(ticket?.created_at || Date.now()).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="border-b border-dashed my-4"></div>

                  <div className="text-center text-xs mb-4">
                    <p className="font-bold mb-2">IMPORTANT INFORMATION</p>
                    <p className="mb-1">• Please keep this receipt safe</p>
                    <p className="mb-1">• Present this when collecting your device</p>
                    <p className="mb-1">• We will contact you when repair is complete</p>
                  </div>

                  <div className="border-b border-dashed my-4"></div>

                  <div className="text-center text-xs mb-4">
                    <p className="font-bold mb-2">TRACK YOUR TICKET ONLINE</p>
                    <p className="mb-1">Visit: {window.location.origin}/ticket/{ticket?.id}</p>
                    <p className="mb-1">Enter Contact: {ticket?.contact_number}</p>
                  </div>

                  <div className="border-b border-dashed my-4"></div>

                  <div className="text-center text-xs mt-4 mb-5">
                    <p>Thank you for choosing MyAppleCare!</p>
                    <p className="mt-1">We'll take good care of your device</p>
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
                Print Temporary Receipt
                <img src="/images/print.svg" alt="print" className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TempTicketPrint;
