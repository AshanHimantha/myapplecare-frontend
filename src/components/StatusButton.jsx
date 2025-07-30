import React, { useState } from 'react';
import PropTypes from 'prop-types';
import api from '../api/axios';

const StatusButton = ({ currentStatus, onChange, id, imei: imeiProp }) => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [imei, setImei] = useState('');

  // Update IMEI state from prop every time modal opens
  React.useEffect(() => {
    if (showModal) {
      setImei(imeiProp || '');
    }
  }, [showModal, imeiProp]);
  const [paymentType, setPaymentType] = useState('cash');

  const getNextStatus = (current) => {
    switch (current) {
      case 'open':
        return { next: 'in_progress', label: 'Start Repair' };
      case 'in_progress':
        return { next: 'completed', label: 'Complete Repair' };
      default:
        return null;
    }
  };

  const nextStatus = getNextStatus(currentStatus);

  if (!nextStatus) return null;

  const handleCompleteRepair = async () => {
    setLoading(true);
    try {
      const payload = {
        status: 'completed',
        payment_type: paymentType,
        imei: imei
      };
      const response = await api.put(`/tickets/${id}`, payload);
      if (response.data.status === 'success') {
        setShowModal(false);
        onChange();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        disabled={loading}
        onClick={() => {
          if (nextStatus.next === 'completed') {
            setShowModal(true);
          } else {
            setLoading(true);
            api.put(`/tickets/${id}`, { status: nextStatus.next })
              .then(response => {
                if (response.data.status === 'success') {
                  onChange();
                }
              })
              .catch(error => {
                console.error('Failed to update status:', error);
              })
              .finally(() => setLoading(false));
          }
        }}
        className={`px-4 py-1 text-xs rounded-md transition-all ${
          loading 
            ? 'bg-gray-300' 
            : currentStatus === 'open'
            ? 'bg-blue-500 hover:bg-blue-600 text-white'
            : 'bg-green-500 hover:bg-green-600 text-white'
        }`}
      >
        {loading ? 'Updating...' : nextStatus.label}
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-md w-80">
            <h2 className="text-lg font-semibold mb-4">Complete Repair</h2>
            <label className="block mb-2 text-sm">IMEI</label>
            <input
              type="text"
              className="w-full mb-3 px-2 py-1 border rounded"
              value={imei}
              onChange={e => setImei(e.target.value)}
              placeholder="Enter IMEI"
            />
            {/* Removed Service Charge and Repaired By fields */}
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
                onClick={handleCompleteRepair}
                disabled={loading || !imei}
              >{loading ? 'Updating...' : 'Submit'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

StatusButton.propTypes = {
  currentStatus: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  imei: PropTypes.string
};

export default StatusButton;