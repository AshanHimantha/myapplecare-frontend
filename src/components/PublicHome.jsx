import React from 'react';
import { Link } from 'react-router-dom';

const PublicHome = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-4">
            <img 
              src="/images/apple-logo.svg" 
              alt="MyAppleCare Logo" 
              className="w-10 h-10"
            />
            <h1 className="text-3xl font-bold text-gray-800">MyAppleCare</h1>
          </div>
          <p className="text-center text-gray-600 mt-2">Professional Apple Device Repair Service</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to MyAppleCare
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your trusted partner for Apple device repairs. We provide professional, 
            reliable service for all your Apple devices.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <img src="/images/repair.svg" alt="Repair" className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Device Repair</h3>
            <p className="text-gray-600">
              Professional repair services for iPhone, iPad, MacBook, and other Apple devices
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <img src="/images/ticket.svg" alt="Ticket" className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Track Your Repair</h3>
            <p className="text-gray-600">
              Check the status of your device repair in real-time using your ticket ID
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-blue-600 rounded-lg p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Track Your Repair Status</h3>
          <p className="text-blue-100 mb-6">
            Enter your ticket ID and contact number to check the current status of your device repair
          </p>
          <Link
            to="/track-ticket"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Track My Ticket
          </Link>
        </div>

        {/* Contact Information */}
        <div className="mt-16 bg-white rounded-lg shadow-sm border p-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">Contact Us</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center">
              <h4 className="font-semibold text-gray-700 mb-2">Phone</h4>
              <p className="text-blue-600 font-medium">+94 769991183</p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-gray-700 mb-2">Address</h4>
              <p className="text-gray-600">
                No 03, 2nd FLOOR<br />
                MC Plazza, Kurunegala
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p>&copy; 2024 MyAppleCare. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default PublicHome;
