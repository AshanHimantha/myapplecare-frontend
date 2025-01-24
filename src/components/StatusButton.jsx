import React, { useState } from 'react';
import PropTypes from 'prop-types';
import api from '../api/axios';

const StatusButton = ({ currentStatus, onChange, id }) => {
  const [loading, setLoading] = useState(false);

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

  return (
    <button
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        try {
          const response = await api.put(`/tickets/${id}`, {
            status: nextStatus.next
          });
          
          if (response.data.status === 'success') {
            onChange();
          }
        } catch (error) {
          console.error('Failed to update status:', error);
        } finally {
          setLoading(false);
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
  );
};

StatusButton.propTypes = {
  currentStatus: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default StatusButton;