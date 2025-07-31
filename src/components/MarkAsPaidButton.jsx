import React, { useState } from "react";
import PropTypes from "prop-types";
import api from "../api/axios";

const MarkAsPaidButton = ({ id, onPaid }) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentType, setPaymentType] = useState("cash");

  const handleMarkPaid = async () => {
    setLoading(true);
    try {
      const payload = {
        payment_type: paymentType,
      };
      const response = await api.put(`/tickets/${id}`, payload);
      if (response.data.status === "success") {
        setShowModal(false);
        if (onPaid) onPaid();
      }
    } catch (error) {
      console.error("Failed to mark as paid:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className="ml-2 px-4 py-1 text-xs rounded-md bg-yellow-500 hover:bg-yellow-600 text-white"
        onClick={() => setShowModal(true)}
        disabled={loading}
      >
        Mark as Paid
      </button>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-md w-80">
            <h2 className="text-lg font-semibold mb-4">Mark as Paid</h2>
            <label className="block mb-2 text-sm">Payment Type</label>
            <select
              className="w-full mb-4 px-2 py-1 border rounded"
              value={paymentType}
              onChange={e => setPaymentType(e.target.value)}
            >
              <option value="cash">Repair complete with cash</option>
              <option value="credit">Repair complete with credit</option>
              <option value="account">Repair complete with account</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1 bg-gray-300 rounded"
                onClick={() => setShowModal(false)}
                disabled={loading}
              >Cancel</button>
              <button
                className="px-3 py-1 bg-green-500 text-white rounded"
                onClick={handleMarkPaid}
                disabled={loading}
              >{loading ? "Updating..." : "Submit"}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

MarkAsPaidButton.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onPaid: PropTypes.func,
};

export default MarkAsPaidButton;
