import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "./api/axios";
import ServiceCenterNav from "./components/ServiceCenterNav";
import SelectPoR from "./components/SelectPoR";
import Parts from "./components/Parts";
import Repair from "./components/Repair";
import TicketItem from "./components/TicketItem";
import StatusButton from "./components/StatusButton";
import ThermalPrintTicket from "./components/ThermalPrintTicket";

const ViewTicket = () => {
  const { id } = useParams();
  const [addItem, setAddItem] = useState(null);
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ticketItems, setTicketItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [itemChanged, setItemChanged] = useState(false);
  const [serviceChanged, setServiceChanged] = useState(false);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const isTicketModifiable = () => {
    return ticket?.status !== "completed";
  };

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const response = await api.get(`/tickets/${id}`);
        if (response.data.status === "success") {
          setTicket(response.data.data);
          setServiceChanged(false);
        }
      } catch (err) {
        console.error("Failed to fetch ticket:", err);
      }
    };

    if (serviceChanged) {
      fetchTicketDetails();
    }
  }, [serviceChanged]);

  const handleServiceSubmit = () => {
    setServiceChanged(true);
  };

  const handleAssignRepairer = async (userId) => {
    if (!userId) {
      // Handle unassigning (setting to null)
      userId = null;
    }
    
    try {
      const response = await api.patch(`/tickets/${id}`, {
        repaired_by: userId
      });
      
      if (response.data.status === "success") {
        setServiceChanged(true); // This will trigger a refresh of ticket data
      }
    } catch (err) {
      console.error("Failed to assign repairer:", err);
    }
  };

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const response = await api.get(`/tickets/${id}`);
        if (response.data.status === "success") {
          setTicket(response.data.data);
          
        }
      } catch (err) {
        console.error("Failed to fetch ticket:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const response = await api.get('/users');
        if (response.data) {
          const allUsers = response.data.data || [];
          // Filter users to only include those with 'technician' role
          const technicians = allUsers.filter(user => 
            user.roles && user.roles.some(role => role.name === 'technician')
          );
          setUsers(technicians);
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchTicketDetails();
    fetchUsers();
  }, [id]);

  useEffect(() => {
    const fetchTicketItems = async () => {
      try {
        setItemsLoading(true);
        const response = await api.get(`/tickets/${id}/items`);
      
        if (response.data.status === "success") {
          setTicketItems(response.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch items:", err);
      } finally {
        setItemsLoading(false);
        setItemChanged(false);
      }
    };

    if (id || itemChanged) {
      fetchTicketItems();
    }
  }, [id, itemChanged]);

  const handleDeleteItem = async (itemId) => {

    try {
      const response = await api.delete(`/ticket-items/${itemId}`);
      if (response.data.status === "success") {
        setTicketItems((prevItems) =>
          prevItems.filter((item) => item.id !== itemId)
        );
      }
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  const calculateTotal = () => {
    const itemsTotal = ticketItems.reduce((sum, item) => {
      if (item.type === "part") {
        return sum + parseFloat(item.part.selling_price) * item.quantity;
      } else {
        return sum + parseFloat(item.repair.cost);
      }
    }, 0);

    const serviceCharge = parseFloat(ticket?.service_charge || 0);
    const total = itemsTotal + serviceCharge;

    return (
      <div className="w-full border border-gray-200 rounded-md flex flex-col">
        <div className="w-full flex justify-between p-3 text-xs">
          <span>Items Total</span>
          <span>{itemsTotal.toLocaleString()} LKR</span>
        </div>

        <div className="w-full flex justify-between p-3 text-xs">
          <span>Service Charge</span>
          <span>{serviceCharge.toLocaleString()} LKR</span>
        </div>
        <div className="shrink-0 max-w-full h-px border border-solid border-zinc-100 w-[95%] self-center" />
        <div className="w-full flex justify-between p-3 font-semibold text-xs">
          <span>Total Due</span>
          <span>{total.toLocaleString()} LKR</span>
        </div>
      </div>
    );
  };

  if (loading)
    return <div className="w-full h-screen text-center mt-20">Loading...</div>;

  return (
    <>
      <ServiceCenterNav />
      <ThermalPrintTicket 
        isOpen={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
        ticket={ticket}
        ticketItems={ticketItems}
      />

      <div className="w-full lg:h-screen h-full pb-10 flex justify-center bg-slate-50">
        <div className="md:w-11/12 w-11/12 flex flex-col items-center">
          <div className="w-full flex justify-between bg-white border border-gray-200 rounded-md mt-10">
            <div className="flex p-2 px-5 text-black lg:text-xl text-sm font-medium flex-col items-start justify-center">
              <div className="flex">
                <img
                  src="/images/arrow-left.svg"
                  alt="back"
                  className="w-6 h-6 cursor-pointer m-auto mr-5"
                  onClick={() => window.history.back()}
                />
                <div>
                <div className="text-start">Ticket #{id}</div>
                <div className="text-start font-normal text-xs">
                  {new Date(ticket?.created_at).toLocaleString()}
                </div>
                </div>

              </div>
            </div>
            <div className="flex p-2 px-5 text-black lg:text-xl text-sm font-medium flex-col items-end justify-center">
              <div className="text-end">
                {ticket?.first_name} {ticket?.last_name}
              </div>
              <div className="text-end font-normal text-xs">
                {ticket?.contact_number}
              </div>
            </div>
          </div>

          {/* Device & Issue Information Card */}
          <div className="w-full bg-white border border-gray-200 rounded-md mt-2 p-5">
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
              {/* Device Information */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <img
                    src={ticket?.device_category === 'android' ? '/images/androidIcon.svg' : '/images/iphoneIcon.svg'}
                    alt="device"
                    className="w-5 h-5 mr-2"
                  />
                  Device Information
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-md">
                    <span className="text-sm font-medium text-gray-600">Category:</span>
                    <span className="text-sm capitalize bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {ticket?.device_category}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-md">
                    <span className="text-sm font-medium text-gray-600">Model:</span>
                    <span className="text-sm font-semibold text-gray-800">{ticket?.device_model}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-md">
                    <span className="text-sm font-medium text-gray-600">IMEI:</span>
                    <span className="text-sm font-mono text-gray-800">{ticket?.imei}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-md">
                    <span className="text-sm font-medium text-gray-600">Priority:</span>
                    <span className={`text-sm px-2 py-1 rounded-full font-medium ${
                      ticket?.priority === 'high' ? 'bg-red-100 text-red-800' :
                      ticket?.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {ticket?.priority?.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Issue & Assignment Information */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <img
                    src="/images/repair.svg"
                    alt="issue"
                    className="w-5 h-5 mr-2"
                  />
                  Issue & Assignment
                </h3>
                <div className="space-y-2">
                  <div className="py-2 px-3 bg-gray-50 rounded-md">
                    <span className="text-sm font-medium text-gray-600 block mb-1">Issue Description:</span>
                    <p className="text-sm text-gray-800 leading-relaxed">{ticket?.issue}</p>
                  </div>
                  
                  {/* Assigned User */}
                  <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-md">
                    <span className="text-sm font-medium text-gray-600">Ticket Created by:</span>
                    <div className="text-right">
                      {ticket?.user ? (
                        <>
                          <div className="text-sm font-semibold text-gray-800">{ticket.user.name}</div>
                          <div className="text-xs text-gray-500">{ticket.user.email}</div>
                        </>
                      ) : (
                        <div className="text-sm text-orange-600 font-medium">
                          <span className="bg-orange-100 px-2 py-1 rounded-full">Not Assigned</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Repaired By */}
                  <div className="py-2 px-3 bg-gray-50 rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">
                        {ticket?.status === "completed" ? "Repaired by:" : "Assign Repairer:"}
                      </span>
                      <div className="flex items-center space-x-2">
                        {ticket?.status !== "completed" && (
                          <select
                            value={ticket?.repaired_by?.id || ''}
                            onChange={(e) => handleAssignRepairer(e.target.value)}
                            className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[80px] max-w-32"
                            disabled={loadingUsers}
                          >
                            <option value="">
                              {loadingUsers ? 'Loading...' : 'Select Technician'}
                            </option>
                            {users.map((user) => (
                              <option key={user.id} value={user.id}>
                                {user.name} - {user.email}
                              </option>
                            ))}
                          </select>
                        )}
                        {ticket?.repaired_by && (
                          <div className="text-right mr-2">
                            <div className="text-sm font-semibold text-green-800">{ticket.repaired_by.name}</div>
                            <div className="text-xs text-green-600">{ticket.repaired_by.email}</div>
                          </div>
                        )}
                       
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full flex lg:flex-row flex-col bg-white border border-gray-200 rounded-md p-5 mt-2 gap-5">
            <div className="lg:w-4/12 w-full">
              {addItem === "parts" && isTicketModifiable() ? (
                <Parts
                  onBack={() => setAddItem(null)}
                  onPartAdd={() => setItemChanged(true)}
                />
              ) : addItem === "repair" && isTicketModifiable() ? (
                <Repair
                  onBack={() => setAddItem(null)}
                  onRepairAdd={() => setItemChanged(true)}
                />
              ) : (
                <SelectPoR
                  onSelect={(item) => {
                    if (isTicketModifiable()) {
                      setAddItem(item);
                    }
                  }}
                  selectedItem={addItem}
                  handleServiceSubmit={isTicketModifiable() ? handleServiceSubmit : null}
                  disabled={!isTicketModifiable()}
                />
              )}
              
              {ticket?.status === "completed" && (
                <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 rounded-md text-sm">
                  This ticket is marked as completed. Adding parts, repairs, or service charges is disabled.
                </div>
              )}
            </div>

            <div className="lg:w-8/12 w-full">
              <div className="text-start w-full font-medium text-lg flex justify-between">
                <div>Recent Invoices</div>
                <div className="flex items-center gap-2">
                  <StatusButton
                    id={ticket?.id}
                    currentStatus={ticket?.status}
                    onChange={() => setServiceChanged(true)}
                  />

                  <button 
                    className="text-xs macBlueButton text-white px-2 py-1 rounded-md"
                    onClick={() => setPrintModalOpen(true)}
                  >
                    Print
                  </button>
                </div>
              </div>
              <div className="w-full mx-auto mt-5 overflow-x-auto">
                <div className="min-w-[600px] border border-gray-200 rounded-md flex flex-col justify-center">
                  <div className="flex font-semibold text-xs p-3">
                    <div className="w-5/12">Item</div>
                    <div className="w-1/12 text-center">Type</div>
                    <div className="w-3/12 text-center">Price</div>
                    <div className="w-2/12 text-center">Total</div>
                    <div className="w-1/12 text-center"></div>
                  </div>

                  <div className="shrink-0 max-w-full h-px border border-solid border-zinc-100 w-[95%] self-center" />

                  {itemsLoading ? (
                    <div className="flex justify-center items-center p-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                  ) : (
                    ticketItems.map((item) => (
                      <TicketItem
                        key={item.id}
                        item={item}
                        onDelete={isTicketModifiable() ? handleDeleteItem : null}
                      />
                    ))
                  )}
                </div>
              </div>

              <div className="text-start w-full font-medium text-lg mt-5 mb-2">
                Total
              </div>
              {calculateTotal()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewTicket;
