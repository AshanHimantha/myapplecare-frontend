import React, { useState, useEffect } from "react";
import api from "./api/axios";
import SalesOutletNav from "./components/SalesOutletNav";

const Invoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredInvoices, setFilteredInvoices] = useState([]);

  const handleSearch = async (term) => {
    try {
      setLoading(true);
      const response = await api.get(`/invoices-search?search=${term}&per_page=10`);
      if (response.data.status === 'success') {
        setFilteredInvoices(response.data.data);
      }
    } catch (err) {
      setError('Failed to search invoices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      const delaySearch = setTimeout(() => {
        handleSearch(searchTerm);
      }, 500);
      return () => clearTimeout(delaySearch);
    } else {
      setFilteredInvoices(invoices);
    }
  }, [searchTerm]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await api.get('/invoices');
        if (response.data.status === 'success') {
          setInvoices(response.data.data);
        }
      } catch (err) {
        setError('Failed to load invoices');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  return (
    <>
      <SalesOutletNav />
      <div className="w-full lg:h-screen h-full flex justify-center">
        <div className="w-8/12">
          <div className=" w-full flex justify-between bg-white border border-gray-200 rounded-md mt-10">
            <div className="flex justify-between items-center p-2 px-5 text-black text-2xl font-medium">
              Invoice
            </div>
            <div className="flex justify-between items-center p-5 text-white  ">
              <input
                id="deviceModel"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex overflow-hidden duration-100 gap-5 justify-between px-2 py-1 text-sm w-full rounded-md border border-solid border-black border-opacity-10 text-zinc-700"
                placeholder="Search"
              />
            </div>
          </div>

          <div className="w-full flex flex-col bg-white border border-gray-200 rounded-md items-center p-5 mt-2">
            <div className="text-start w-full font-medium text-lg">
              Recent Invoices
            </div>
            
            {loading ? (
              <div className="p-4">Loading...</div>
            ) : error ? (
              <div className="text-red-500 p-4">{error}</div>
            ) : (
              <div className="w-full mx-auto mt-5 overflow-x-auto">
                <div className="min-w-[800px] border border-gray-200 rounded-md flex flex-col justify-center">
                  <div className="flex font-semibold text-xs p-3">
                    <div className="w-2/12">Invoice ID</div>
                    <div className="w-3/12 text-center">Customer</div>
                    <div className="w-3/12 text-center">Date</div>
                    <div className="w-2/12 text-center">Amount</div>
                    <div className="w-2/12 text-center">Actions</div>
                  </div>

                  {(searchTerm ? filteredInvoices : invoices).map((invoice) => (
                    <div key={invoice.id} className="flex  p-3 border-t hover:bg-gray-50">
                      <div className="w-2/12">#{invoice.id}</div>
                      <div className="w-3/12 text-center">
                        {invoice.first_name} {invoice.last_name}
                      </div>
                      <div className="w-3/12 text-center">
                        {new Date(invoice.created_at).toLocaleDateString()}
                      </div>
                      <div className="w-2/12 text-center">
                        {parseFloat(invoice.total_amount) === 0 ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full font-medium bg-red-100 text-red-800">
                            Returned
                          </span>
                        ) : (
                          `${parseFloat(invoice.total_amount).toLocaleString()} LKR`
                        )}
                      </div>
                      <div className="w-2/12 text-center">
                        <a 
                          className="text-blue-600 hover:text-blue-800" 
                          href={`/view-invoice/${invoice.id}`}
                        >
                          View
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Invoice;
