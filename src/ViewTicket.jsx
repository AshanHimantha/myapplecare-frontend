import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "./api/axios";
import ServiceCenterNav from "./components/ServiceCenterNav";
import SelectPoR from "./components/SelectPoR";
import Parts from "./components/Parts";
import Repair from "./components/Repair";
import TicketItem from "./components/TicketItem";
import StatusButton from "./components/StatusButton";

const ViewTicket = () => {
  const { id } = useParams();
  const [addItem, setAddItem] = useState(null);
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ticketItems, setTicketItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [itemChanged, setItemChanged] = useState(false);
  const [serviceChanged, setServiceChanged] = useState(false);

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

    fetchTicketDetails();
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
    console.log("Deleting item:", itemId);
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

          <div className="w-full flex lg:flex-row flex-col bg-white border border-gray-200 rounded-md p-5 mt-2 gap-5">
            <div className="lg:w-4/12 w-full">
              {addItem === "parts" ? (
                <Parts
                  onBack={() => setAddItem(null)}
                  onPartAdd={() => setItemChanged(true)}
                />
              ) : addItem === "repair" ? (
                <Repair
                  onBack={() => setAddItem(null)}
                  onRepairAdd={() => setItemChanged(true)}
                />
              ) : (
                <SelectPoR
                  onSelect={setAddItem}
                  selectedItem={addItem}
                  handleServiceSubmit={handleServiceSubmit}
                />
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

                  <button className="text-xs bg-blue-500 text-white px-2 py-1 rounded-md">
                    Print{" "}
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
                        onDelete={handleDeleteItem}
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
