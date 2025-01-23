import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CreateTicketForm from "./components/CreateTicketForm";
import SegmentedPicker from "./components/SegmentedPicker";
import ServiceCenterNav from "./components/ServiceCenterNav";
import Alert from './components/Alert';
import api from "./api/axios";
import debounce from 'lodash.debounce';

const ServiceCenter = () => {
  const [isCreateTicketVisible, setIsCreateTicketVisible] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [status, setStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);
  const PER_PAGE = 20;

  const displayStatusOptions = ["All", "Pending", "Ongoing", "Completed"];

  const statusMapping = {
    'Pending': 'open',
    'Ongoing': 'in_progress',
    'Completed': 'completed',
    'All': 'all'
  };

  const handleCreateTicketClick = () => {
    setIsCreateTicketVisible(!isCreateTicketVisible);
  };

  const handleSegmentChange = (option) => {
    const apiStatus = statusMapping[option];
    setStatus(apiStatus);
    setPage(1); // Reset to first page
    setTickets([]); // Clear existing tickets
  };

  const fetchTickets = useCallback(async (pageNum) => {
    try {
      setLoading(true);
      const response = await api.get(`/tickets-filter`, {
        params: {
          page: pageNum,
          per_page: PER_PAGE,
          status: status === 'all' ? '' : status
        }
      });

      if (response.data.status === 'success') {
        if (pageNum === 1) {
          setTickets(response.data.data);
        } else {
          setTickets(prev => [...prev, ...response.data.data]);
        }
        setHasMore(response.data.data.length === PER_PAGE);
      }
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
    } finally {
      setLoading(false);
    }
  }, [status]); // Add status as dependency

  const handleSearch = useCallback(
    debounce(async (term) => {
      if (!term.trim()) {
        fetchTickets(1);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get('/tickets-search', {
          params: { 
            search: term,
            status: status === 'all' ? '' : status
          }
        });

        if (response.data.status === 'success') {
          setTickets(response.data.data);
          setHasMore(false);
        }
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setLoading(false);
      }
    }, 500),
    [status, fetchTickets, setLoading, setTickets, setHasMore]
  );

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    handleSearch(term);
  };

  useEffect(() => {
    setPage(1);
    fetchTickets(1);
  }, [status, fetchTickets]);

  useEffect(() => {
    if (page > 1) {
      fetchTickets(page);
    }
  }, [page, fetchTickets]);

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && !loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const drawerVariants = {
    hidden: { x: "100%" },
    visible: { x: 0 },
  };
  return (
    <>
      <ServiceCenterNav setVisible={handleCreateTicketClick} />
      <Alert 
        isVisible={showAlert}
        onClose={() => setShowAlert(false)}
        message="Ticket Created Successfully"
        type="success"
      />
      <div className="w-full lg:h-screen flex justify-center  overflow-hidden hide-scrollbar">
        <div 
          ref={containerRef}
          onScroll={handleScroll}
          className="lg:w-3/4 w-full h-full overflow-auto hide-scrollbar flex flex-col items-center"
        >
          <div className="w-11/12 overflow-auto hide-scrollbar">
            <div className=" w-full flex justify-between bg-white border border-gray-200 rounded-md mt-10">
              <div className="flex justify-between items-center p-2 px-5 text-black text-2xl font-medium">
                Tickets
              </div>
              <div className="flex justify-between items-center p-5 text-white  ">
                <input
                  id="deviceModel"
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="flex overflow-hidden duration-100 gap-5 justify-between px-2 py-1 text-sm w-full rounded-md border border-solid border-black border-opacity-10 text-zinc-700 text-opacity-30"
                  placeholder="Search"
                />
              </div>
            </div>

            <div className=" w-full flex flex-col  bg-white border border-gray-200 rounded-md items-center p-5 mt-2">
              <div className="lg:w-10/12 w-full">
                <SegmentedPicker
                  options={displayStatusOptions}
                  onChange={handleSegmentChange}
                />
              </div>

              <div className="w-11/12 mx-auto mt-10 overflow-x-auto">
                <div className="min-w-[800px] border border-gray-200 rounded-md flex flex-col justify-center">
                  <div className="flex font-semibold text-xs p-3">
                    <div className="w-3/12">Device</div>
                    <div className="w-2/12">Customer</div>
                    <div className="w-1/12 text-center">Priority</div>
                    <div className="w-2/12 text-center">Contact No</div>
                    <div className="w-2/12 text-center">Category</div>
                    <div className="w-1/12 text-center">Status</div>
                    <div className="w-1/12 text-center"></div>
                  </div>

                  <div className="shrink-0 max-w-full h-px border border-solid border-zinc-100 w-[95%] self-center" />
                  {tickets.map(ticket => (
                    <div key={ticket.id} className="flex border-b p-3 text-sm">
                      <div className="w-3/12 font-medium">{ticket.device_model}</div>
                      <div className="w-2/12 text-gray-600">{ticket.first_name} {ticket.last_name}</div>
                      <div className={`w-1/12 text-center font-semibold ${
                        ticket.priority === 'high' ? 'text-red-500' :
                        ticket.priority === 'medium' ? 'text-yellow-500' : 'text-green-500'
                      }`}>
                        {ticket.priority}
                      </div>
                      <div className="w-2/12 text-center text-gray-600">{ticket.contact_number}</div>
                      <div className="w-2/12 text-center text-gray-600">{ticket.device_category}</div>
                      <div className="w-1/12 text-center">{ticket.status}</div>
                      <div className="w-1/12 text-center">
                        <a href={`/view-ticket/${ticket.id}`} className="text-blue-500">View</a>
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="text-center py-4">Loading more tickets...</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {isCreateTicketVisible && (
            <motion.div
              className="lg:w-1/4 w-10/12 bg-gray-300 h-full absolute right-0 lg:relative"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={drawerVariants}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <CreateTicketForm 
                onClose={() => setIsCreateTicketVisible(false)}
                onSuccess={() => setShowAlert(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default ServiceCenter;
