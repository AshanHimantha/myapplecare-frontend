import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';

const PublicTicketView = () => {
  const { id } = useParams();
  const [contactNumber, setContactNumber] = useState('');
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ticketItems, setTicketItems] = useState([]);
  const [showContactForm, setShowContactForm] = useState(true);

  // Load ticket when component mounts if ID is provided
  useEffect(() => {
    if (id) {
      setShowContactForm(true); // Show contact form first for verification
    }
  }, [id]);

  const handleLookup = async (e) => {
    e.preventDefault();
    
    if (!id || !contactNumber.trim()) {
      setError('Please enter your contact number to verify your identity');
      return;
    }

    setLoading(true);
    setError('');
    setTicket(null);

    try {
      // Try to fetch the ticket using the existing endpoint
      const response = await api.get(`/tickets/${id}`);

      if (response.data.status === 'success') {
        const ticketData = response.data.data;
        
        // Verify the contact number matches
        if (ticketData.contact_number === contactNumber) {
          setTicket(ticketData);
          
          // Fetch ticket items if available
          try {
            const itemsResponse = await api.get(`/tickets/${id}/items`);
            if (itemsResponse.data.status === 'success') {
              setTicketItems(itemsResponse.data.data);
            }
          } catch (itemsErr) {
            console.log('No items found for this ticket');
            setTicketItems([]);
          }
          setShowContactForm(false); // Hide the contact form after successful verification
        } else {
          setError('Contact number does not match our records');
        }
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Ticket not found or contact number does not match');
      } else {
        setError('Failed to fetch ticket details. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'open':
        return 'Open - Waiting for diagnosis';
      case 'in_progress':
        return 'In Progress - Being repaired';
      case 'completed':
        return 'Completed - Ready for pickup';
      default:
        return 'Unknown status';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const calculateTotal = () => {
    const itemsTotal = ticketItems.reduce((sum, item) => {
      if (item.type === 'part') {
        return sum + parseFloat(item.part?.selling_price || 0) * parseInt(item.quantity || 1);
      } else if (item.type === 'repair') {
        return sum + parseFloat(item.repair?.cost || 0);
      }
      return sum;
    }, 0);

    const serviceCharge = parseFloat(ticket?.service_charge || 0);
    return itemsTotal + serviceCharge;
  };

  const reset = () => {
    setTicket(null);
    setTicketItems([]);
    setContactNumber('');
    setError('');
    setShowContactForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-4">
            <img 
              src="/images/apple-logo.svg" 
              alt="MyAppleCare Logo" 
              className="w-8 h-8"
            />
            <h1 className="text-2xl font-semibold text-gray-800">MyAppleCare</h1>
          </div>
          <p className="text-center text-gray-600 mt-2">Track Your Service Ticket</p>
        </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        {(!ticket && showContactForm) ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border p-8 max-w-md mx-auto"
          >
            <h2 className="text-xl font-semibold text-center mb-6">
              {id ? `Verify Your Identity for Ticket #${id}` : 'Check Your Ticket Status'}
            </h2>
            
            <form onSubmit={handleLookup} className="space-y-4">
              {!id && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ticket ID
                  </label>
                  <input
                    type="text"
                    value={id || ''}
                    readOnly
                    placeholder="Enter your ticket ID"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {id && (
                <div className="bg-blue-50 p-3 rounded-md text-center">
                  <p className="text-sm text-blue-700">
                    Looking up ticket: <span className="font-semibold">#{id}</span>
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number
                </label>
                <input
                  type="text"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="Enter your contact number to verify"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </>
                ) : (
                  'Check Status'
                )}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
      
            {/* Ticket Information */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="bg-blue-50 px-6 py-4 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Ticket #{ticket.id}
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
                    {getStatusText(ticket.status)}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mt-1">
                  Created: {new Date(ticket.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Customer Information</h3>
                    <p className="text-gray-600">{ticket.first_name} {ticket.last_name}</p>
                    <p className="text-gray-600">{ticket.contact_number}</p>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Device Information</h3>
                    <p className="text-gray-600">{ticket.device_category} - {ticket.device_model}</p>
                    {ticket.imei && <p className="text-gray-600 text-sm">IMEI: {ticket.imei}</p>}
                    <p className={`text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                      Priority: {ticket.priority?.charAt(0).toUpperCase() + ticket.priority?.slice(1)}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Issue Description</h3>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-md">{ticket.issue}</p>
                </div>

                {ticket.notes && (
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Service Notes</h3>
                    <p className="text-gray-600 bg-blue-50 p-3 rounded-md">{ticket.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Items and Pricing */}
            {ticketItems.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-800">Service Details</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {ticketItems.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                        <div>
                          <p className="font-medium">
                            {item.type === 'part' ? item.part?.part_name : item.repair?.repair_name}
                          </p>
                          {item.type === 'part' && (
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {item.type === 'part' 
                              ? (parseFloat(item.part?.selling_price || 0) * parseInt(item.quantity || 1)).toLocaleString()
                              : parseFloat(item.repair?.cost || 0).toLocaleString()
                            } LKR
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Service Charge:</span>
                        <span>{parseFloat(ticket.service_charge || 0).toLocaleString()} LKR</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total:</span>
                        <span>{calculateTotal().toLocaleString()} LKR</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <h3 className="font-semibold text-gray-800 mb-2">Need Help?</h3>
              <p className="text-gray-600 mb-2">Contact us for any questions about your repair</p>
              <p className="font-medium text-blue-600">+94 769991183</p>
              <p className="text-sm text-gray-600 mt-2">
                No 03, 2nd FLOOR, MC Plazza, Kurunegala
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PublicTicketView;
