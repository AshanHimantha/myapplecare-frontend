import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CreateTicketForm from "./components/CreateTicketForm";
import SegmentedPicker from "./components/SegmentedPicker";
import ServiceCenterNav from "./components/ServiceCenterNav";
import TempTicketPrint from "./components/TempTicketPrint";
import api from "./api/axios";
import debounce from "lodash.debounce";

const ServiceCenter = () => {
  const [isCreateTicketVisible, setIsCreateTicketVisible] = useState(true);
  const [showTempTicketModal, setShowTempTicketModal] = useState(false);
  const [createdTicket, setCreatedTicket] = useState(null);
  const [createdTicketItems, setCreatedTicketItems] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [status, setStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef(null);
  const PER_PAGE = 20;

  const displayStatusOptions = ["All", "Pending", "Ongoing", "Completed"];

  const statusMapping = {
    Pending: "open",
    Ongoing: "in_progress",
    Completed: "completed",
    All: "all",
  };

  const handleCreateTicketClick = () => {
    setIsCreateTicketVisible(!isCreateTicketVisible);
  };

  const handleTicketCreated = (ticketData) => {
    setCreatedTicket(ticketData);
    setCreatedTicketItems([]); // For now, new tickets don't have items
    setShowTempTicketModal(true); // Show temp ticket
    // Refresh the tickets list
    setPage(1);
    fetchTickets(1);
  };

  const handleSegmentChange = (option) => {
    const apiStatus = statusMapping[option];
    setStatus(apiStatus);
    setPage(1); // Reset to first page
    setTickets([]); // Clear existing tickets
  };

  const fetchTickets = useCallback(
    async (pageNum) => {
      try {
        setLoading(true);
        const response = await api.get(`/tickets-filter`, {
          params: {
            page: pageNum,
            per_page: PER_PAGE,
            status: status === "all" ? "" : status,
          },
        });

        if (response.data.status === "success") {
          if (pageNum === 1) {
            setTickets(response.data.data);
          } else {
            setTickets((prev) => [...prev, ...response.data.data]);
          }
          setHasMore(response.data.data.length === PER_PAGE);
        }
      } catch (err) {
        console.error("Failed to fetch tickets:", err);
      } finally {
        setLoading(false);
      }
    },
    [status]
  ); // Add status as dependency

  const handleSearch = useCallback(
    debounce(async (term) => {
      if (!term.trim()) {
        fetchTickets(1);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get("/tickets-search", {
          params: {
            search: term,
            status: status === "all" ? "" : status,
          },
        });

        if (response.data.status === "success") {
          setTickets(response.data.data);
          setHasMore(false);
        }
      } catch (err) {
        console.error("Search failed:", err);
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

  const handleDeleteTicket = async (ticketId) => {
    // Using window.confirm explicitly to avoid ESLint warning
    if (!window.confirm('Are you sure you want to delete this ticket?')) {
      return;
    }
  
    try {
      const response = await api.delete(`/tickets/${ticketId}`);
      if (response.data.status === 'success') {
        setTickets(prevTickets => 
          prevTickets.filter(ticket => ticket.id !== ticketId)
        );
      }
    } catch (err) {
      console.error('Failed to delete ticket:', err);
    }
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
      setPage((prev) => prev + 1);
    }
  };

  const drawerVariants = {
    hidden: { x: "100%" },
    visible: { x: 0 },
  };
  return (
    <>
      <ServiceCenterNav setVisible={handleCreateTicketClick} />
      <div className="w-full lg:h-screen flex justify-center  overflow-hidden hide-scrollbar">
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="lg:w-3/4 w-full h-full overflow-auto hide-scrollbar flex flex-col items-center "
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
                  className="flex overflow-hidden duration-100 gap-5 justify-between px-2 py-1 text-sm w-full rounded-md border border-solid border-black border-opacity-10 text-black "
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
              </div>              <div className="w-full mx-auto mt-10 overflow-x-auto">
                <div className="min-w-[900px] border border-gray-200 rounded-md flex flex-col justify-center">
                  <div className="flex font-semibold text-xs p-3">
                    <div className="w-1/12">Ticket ID</div>
                    <div className="w-2/12">Device</div>
                    <div className="w-2/12">Customer</div>
                    <div className="w-1/12 text-center">Priority</div>
                    <div className="w-2/12 text-center">Contact No</div>
                    <div className="w-1/12 text-center">Status</div>
                    <div className="w-1/12 text-end">Payment</div>
                    <div className="w-1/12 text-end">Date</div>
                    <div className="w-1/12 text-center">Actions</div>
                  </div>

                  <div className="shrink-0 max-w-full h-px border border-solid border-zinc-100 w-[95%] self-center" />                  {tickets.map((ticket) => (
                    <div key={ticket.id} className="flex border-b p-3 text-sm">
                      <div className="w-1/12 font-semibold text-blue-600">
                        #{ticket.id}
                      </div>
                      <div className="w-2/12 font-medium">
                        {ticket.device_model}
                      </div>
                      <div className="w-2/12 text-gray-600">
                        {ticket.first_name} {ticket.last_name}
                      </div>
                      <div
                        className={`w-1/12 text-center font-semibold ${
                          ticket.priority === "high"
                            ? "text-red-500"
                            : ticket.priority === "medium"
                            ? "text-yellow-500"
                            : "text-green-500"
                        }`}
                      >
                        {ticket.priority
                          ? ticket.priority.charAt(0).toUpperCase() +
                            ticket.priority.slice(1)
                          : "N/A"}
                      </div>
                      <div className="w-2/12 text-center text-gray-600">
                        {ticket.contact_number}
                      </div>
                      <div className="w-1/12 text-center">
                        <span
                          className={`
    inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
    ${
      ticket.status === "open"
        ? "bg-yellow-100 text-yellow-800"
        : ticket.status === "in_progress"
        ? "bg-blue-100 text-blue-800"
        : ticket.status === "completed"
        ? "bg-green-100 text-green-800"
        : "bg-red-100 text-red-800"
    }
  `}
                        >
                          <span
                            className={`
      w-2 h-2 mr-1.5 rounded-full
      ${
        ticket.status === "open"
          ? "bg-yellow-400"
          : ticket.status === "in_progress"
          ? "bg-blue-400"
          : ticket.status === "completed"
          ? "bg-green-400"
          : "bg-red-400"
      }
    `}
                          />
                          {ticket.status === "open"
                            ? "Open"
                            : ticket.status === "in_progress"
                            ? "OnGoing"
                            : ticket.status === "completed"
                            ? "Completed"
                            : "Cancelled"}
                        </span>
                      </div>
                      <div className="w-1/12 text-end">
                        {/* Payment status icon logic */}
                        {ticket.payment_type === null ? (
                          <span className="inline-flex items-end text-yellow-700 font-semibold" title="Payment Pending">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#FEF3C7" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3" stroke="#F59E42" />
                            </svg>
                          </span>
                        ) : ticket.payment_type === "cash" ? (
                          <span className="inline-flex items-end text-green-700" title="Cash Payment">
                            <img src="/images/cash.svg" alt="cash" className="h-5 w-5 mr-1" />
                            
                          </span>
                        ) : ticket.payment_type === "account" ? (
                          <span className="inline-flex items-end text-blue-700" title="Bank Payment">
                            <img src="/images/card.svg" alt="bank" className="h-5 w-5 mr-1" />
                            
                          </span>
                        ) : (
                          <span className="inline-flex items-end text-gray-700">
                            <span>{ticket.payment_type}</span>
                          </span>
                        )}
                      </div>


                      
                      <div className="w-1/12 text-end text-gray-600 text-xs">
                        {ticket.created_at 
                          ? new Date(ticket.created_at).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })
                          : 'N/A'}
                      </div>
                      <div className="w-1/12 flex justify-center items-center gap-2">
                        <a
                          href={`/view-ticket/${ticket.id}`}
                          className="text-blue-500 text-xs"
                        >
                          View
                        </a>
                        {(ticket.status === "open" ||
                          ticket.status === "in_progress") && (
                          <button
                            onClick={() => handleDeleteTicket(ticket.id)}
                            className="text-red-500"
                          >
                            <img
                              src="/images/bin.svg"
                              alt="delete"
                              className="h-4 w-4"
                            />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="text-center py-4">
                      Loading more tickets...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {isCreateTicketVisible && (
            <motion.div
              className="xl:w-1/4 w-10/12 md:w-5/12 bg-gray-300 h-full absolute right-0 lg:relative"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={drawerVariants}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <CreateTicketForm
                onClose={() => setIsCreateTicketVisible(false)}
                onSuccess={handleTicketCreated}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Temporary Ticket Modal */}
      <TempTicketPrint
        isOpen={showTempTicketModal}
        onClose={() => setShowTempTicketModal(false)}
        ticket={createdTicket}
      />
    </>
  );
};

export default ServiceCenter;
