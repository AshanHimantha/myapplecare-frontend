import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReactToPrint } from 'react-to-print';

const PrintInvoice = ({ isOpen, onClose, cartItems, customerDetails, total }) => {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => document.getElementById('print-content'),
    documentTitle: 'Invoice',
    removeAfterPrint: true
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="bg-white p-8 rounded-lg w-[800px] max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6 print:hidden">
              <h2 className="text-2xl font-bold">Invoice</h2>
              <button onClick={onClose}>
                <img src="./images/close2.svg" alt="close" className="w-6 h-6" />
              </button>
            </div>

            <div className="print-content" id="print-content" ref={componentRef}>
              <div className="w-[595px] h-[842px] relative bg-white  overflow-hidden">
                <div className="w-[250.07px] h-[171px] left-[304px] top-[192px] absolute">
                  <div className="w-[250.07px] h-[171px] left-0 top-0 absolute bg-white rounded-md border border-[#ebebeb]" />
                  <div className="w-[74.75px] left-[12.92px] top-[48px] absolute text-[#979797] text-[9px] font-normal font-['SF Pro Text']">
                    Payment Method
                  </div>
                  <div className="w-[36.47px] left-[13.55px] top-[62px] absolute text-black text-[13px] font-medium font-['SF Pro Text']">
                    Card
                  </div>
                  <div className="w-[74.75px] left-[13.84px] top-[85px] absolute text-[#979797] text-[9px] font-normal font-['SF Pro Text']">
                    Date Time
                  </div>
                  <div className="w-[74.75px] left-[12.92px] top-[122px] absolute text-[#979797] text-[9px] font-normal font-['SF Pro Text']">
                    Order ID
                  </div>
                  <div className="w-[149px] left-[12.50px] top-[98px] absolute text-black text-[13px] font-medium font-['SF Pro Text']">
                    2024 Oct 29 12:40AM
                  </div>
                  <div className="w-[40.67px] left-[14.01px] top-[136px] absolute text-black text-[13px] font-medium font-['SF Pro Text']">
                    #324
                  </div>
                  <div className="w-[113.07px] left-[13.02px] top-[13px] absolute text-black text-base font-semibold font-['SF Pro Text']">
                    Order Details
                  </div>
                  <div className="w-[230.70px] h-[0px] left-[9.23px] top-[40px] absolute border border-[#f4f4f4]"></div>
                </div>
                <div className="w-[251px] h-[171px] left-[39px] top-[193px] absolute">
                  <div className="w-[251px] h-[171px] left-0 top-0 absolute bg-white rounded-md border border-[#ebebeb]" />
                  <div className="w-[28.71px] left-[13.89px] top-[48px] absolute text-[#979797] text-[9px] font-normal font-['SF Pro Text']">
                    Name
                  </div>
                  <div className="w-[111.90px] left-[13.60px] top-[62px] absolute text-black text-[13px] font-medium font-['SF Pro Text']">
                    Ashan Himantha
                  </div>
                  <div className="w-[40.75px] left-[12.97px] top-[85px] absolute text-[#979797] text-[9px] font-normal font-['SF Pro Text']">
                    Mobile
                  </div>
                  <div className="w-[90.99px] left-[13.60px] top-[98px] absolute text-black text-[13px] font-medium font-['SF Pro Text']">
                    0701705553
                  </div>
                  <div className="w-[151.65px] left-[12.55px] top-[13px] absolute text-black text-base font-semibold font-['SF Pro Text']">
                    Customer Details
                  </div>
                  <div className="w-[231.55px] h-[0px] left-[9.26px] top-[40px] absolute border border-[#f4f4f4]"></div>
                </div>
                <div className="w-[517px] h-[171px] left-[39px] top-[389px] absolute">
                  <div className="w-[517px] h-[171px] left-0 top-0 absolute bg-white rounded-md border border-[#ebebeb]" />
                  <div className="w-[205px] left-[15px] top-[55px] absolute text-center">
                    <span class="text-black text-xs font-semibold font-['SF Pro Text']">
                      iPhone 14 Pro Max (
                    </span>
                    <span class="text-[#808080] text-xs font-normal font-['SF Pro Text']">
                      IMEI2HND724
                    </span>
                    <span class="text-black text-xs font-semibold font-['SF Pro Text']">
                      )
                    </span>
                  </div>
                  <div className="w-[23px] left-[245px] top-[53px] absolute text-center text-[#979797] text-xs font-normal font-['SF Pro Text']">
                    x1
                  </div>
                  <div className="w-[75px] left-[303px] top-[55px] absolute text-center text-[#979797] text-xs font-normal font-['SF Pro Text']">
                    240,000 LKR
                  </div>
                  <div className="w-[77.08px] left-[432.40px] top-[55px] absolute text-center text-[#979797] text-xs font-normal font-['SF Pro Text']">
                    240,000 LKR
                  </div>
                  <div className="w-[43px] left-[319px] top-[15px] absolute text-center text-black text-[10px] font-medium font-['SF Pro Text']">
                    Price
                  </div>
                  <div className="w-[43px] left-[238px] top-[15px] absolute text-center text-black text-[10px] font-medium font-['SF Pro Text']">
                    Qty
                  </div>
                  <div className="w-[26.32px] left-[457.78px] top-[15px] absolute text-center text-black text-[10px] font-medium font-['SF Pro Text']">
                    Total
                  </div>
                  <div className="w-[85px] left-[15px] top-[15px] absolute text-black text-[10px] font-medium font-['SF Pro Text']">
                    Product Name
                  </div>
                  <div className="w-[501.02px] h-[0px] left-[8.46px] top-[39px] absolute border border-[#f1f1f1]"></div>
                  <div className="w-[501.02px] h-[0px] left-[8.46px] top-[81px] absolute border border-[#f1f1f1]"></div>
                  <div className="w-[179px] left-[15px] top-[97px] absolute text-center text-black text-xs font-semibold font-['SF Pro Text']">
                    iPhone 14 Pro Max Back Cover
                  </div>
                  <div className="w-[18px] left-[247px] top-[97px] absolute text-center text-[#979797] text-xs font-normal font-['SF Pro Text']">
                    x2
                  </div>
                  <div className="w-[58px] left-[311px] top-[97px] absolute text-center text-[#979797] text-xs font-normal font-['SF Pro Text']">
                    1,500 LKR
                  </div>
                  <div className="w-[60.16px] left-[441.80px] top-[97px] absolute text-center text-[#979797] text-xs font-normal font-['SF Pro Text']">
                    2,000 LKR
                  </div>
                  <div className="w-[501.02px] h-[0px] left-[8.46px] top-[124px] absolute border border-[#f1f1f1]"></div>
                  <div className="w-52 left-[15px] top-[142px] absolute text-center text-black text-xs font-semibold font-['SF Pro Text']">
                    iPhone 14 Pro Max Tempared Glass
                  </div>
                  <div className="w-[15px] left-[249px] top-[141px] absolute text-center text-[#979797] text-xs font-normal font-['SF Pro Text']">
                    x1
                  </div>
                  <div className="w-[57px] left-[311px] top-[142px] absolute text-center text-[#979797] text-xs font-normal font-['SF Pro Text']">
                    1,000 LKR
                  </div>
                  <div className="w-[58.28px] left-[441.80px] top-[142px] absolute text-center text-[#979797] text-xs font-normal font-['SF Pro Text']">
                    1,000 LKR
                  </div>
                </div>
                <div className="w-12 left-[354px] top-[592px] absolute text-center text-[#979797] text-xs font-normal font-['SF Pro Text']">
                  Subtotal
                </div>
                <div className="w-[67px] left-[355px] top-[655px] absolute text-center text-black text-sm font-normal font-['SF Pro Text']">
                  Total due{" "}
                </div>
                <div className="w-[200px] h-[0px] left-[354px] top-[646px] absolute border border-[#f1f1f1]"></div>
                <div className="w-[79px] left-[477px] top-[592px] absolute text-center text-black text-xs font-normal font-['SF Pro Text']">
                  244,000 LKR
                </div>
                <div className="w-[51px] h-3.5 left-[354px] top-[616px] absolute text-center text-[#979797] text-xs font-normal font-['SF Pro Text']">
                  Discount
                </div>
                <div className="w-[58px] left-[496px] top-[619px] absolute text-center text-black text-xs font-normal font-['SF Pro Text']">
                  1,000 LKR
                </div>
                <div className="w-[98px] left-[456px] top-[654px] absolute text-center text-black text-[15px] font-semibold font-['SF Pro Text']">
                  243,000 LKR
                </div>
                <div className="w-[272px] left-[41px] top-[800px] absolute text-[#979797] text-[10px] font-medium font-['SF Compact Text']">
                  No 03, 2nd FLOOR,MC Plazza, Kurunegala ,Sri Lanka
                </div>
                <div className="w-[104px] left-[463px] top-[798px] absolute text-[#979797] text-[13px] font-medium font-['SF Compact Text']">
                  +94 769991183
                </div>
                <div className="left-[162px] top-[111px] absolute text-center text-black text-xl font-medium font-['SF Compact Text']">
                  Thank You for Your Purchase!
                </div>
                <div className="w-[196px] h-[38px] left-[200px] top-[46px] absolute">
                  <div className="w-[159px] h-[15px] left-[37px] top-[13px] absolute">
                    <div className="w-[8.82px] h-[10.61px] left-[15.53px] top-[0.01px] absolute" />
                    <div className="w-[159px] h-[15px] left-0 top-0 absolute text-center text-black text-2xl font-medium font-['SF Compact Text']">
                      MyAppleCare
                    </div>
                  </div>
                  <div className="w-[32.12px] h-[38px] left-0 top-0 absolute"></div>
                </div>
                <div className="left-[145px] top-[137px] absolute text-center text-black text-[10px] font-normal font-['SF Compact Text']">
                  We hope you enjoy your new product. It was a pleasure serving you!
                </div>
              </div>
            </div>

            <div className="mt-6 print:hidden">
              <button
                onClick={handlePrint}
                className="bg-black text-white px-6 py-2 rounded-lg flex items-center gap-2"
              >
                Print Invoice
                <img src="./images/print.svg" alt="print" className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PrintInvoice;
