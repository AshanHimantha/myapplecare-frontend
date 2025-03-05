import React, { useState, useEffect } from 'react';
import api from "../api/axios";

const EditUserModal = ({ isOpen, user, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    roles: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [changePassword, setChangePassword] = useState(false);

  const roles = [
    { 
      value: 'admin', 
      label: 'Administrator',
      description: 'Full access to all system features and settings'
    },
    { 
      value: 'technician', 
      label: 'Technician',
      description: 'Access to repair management and inventory'
    },
    { 
      value: 'cashier', 
      label: 'Cashier',
      description: 'Access to sales and basic customer management'
    }
  ];

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        roles: user.roles ? user.roles.map(role => role.name) : []
      });
    }
  }, [user, isOpen]);

  const handleRoleChange = (roleValue) => {
    setFormData(prev => {
      const newRoles = prev.roles.includes(roleValue)
        ? prev.roles.filter(r => r !== roleValue)
        : [...prev.roles, roleValue];
        
      return {
        ...prev,
        roles: newRoles
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.roles.length === 0) {
      setError('Please select at least one role');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      // Create update object - only include password if changePassword is true
      const updateData = {
        name: formData.name,
        roles: formData.roles
      };

      if (changePassword && formData.password) {
        updateData.password = formData.password;
      }

      const response = await api.put(`/users/${user.id}`, updateData);
      if (response.data.status === 'success') {
        onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />

        {/* Modal panel */}
        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="w-full">
                  <h3 className="text-lg font-medium leading-6 text-[#1D1D1F] mb-4">
                    Edit User
                  </h3>
                  
                  {error && (
                    <div className="mb-4 text-sm text-red-600 bg-red-50 rounded-lg p-3">
                      {error}
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* Name Input */}
                    <div>
                      <label className="block text-sm font-medium text-[#1D1D1F] mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-2 rounded-lg bg-[#F5F5F7] border-0 focus:ring-2 focus:ring-[#0071E3]"
                        required
                      />
                    </div>

                    {/* Email Input (read-only) */}
                    <div>
                      <label className="block text-sm font-medium text-[#1D1D1F] mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        className="w-full px-4 py-2 rounded-lg bg-[#F5F5F7] border-0 text-gray-500"
                        disabled
                      />
                      <p className="mt-1 text-xs text-[#86868B]">Email cannot be changed</p>
                    </div>

                    {/* Change Password Toggle */}
                    <div className="flex items-center">
                      <input
                        id="change-password"
                        type="checkbox"
                        checked={changePassword}
                        onChange={() => setChangePassword(!changePassword)}
                        className="h-4 w-4 rounded border-gray-300 text-[#0071E3] focus:ring-[#0071E3]"
                      />
                      <label htmlFor="change-password" className="ml-2 block text-sm text-[#1D1D1F]">
                        Change password
                      </label>
                    </div>

                    {/* Password Input (only shown if changePassword is true) */}
                    {changePassword && (
                      <div>
                        <label className="block text-sm font-medium text-[#1D1D1F] mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                          className="w-full px-4 py-2 rounded-lg bg-[#F5F5F7] border-0 focus:ring-2 focus:ring-[#0071E3]"
                          required={changePassword}
                          minLength={6}
                        />
                      </div>
                    )}

                    {/* Role Selection */}
                    <div>
                      <label className="block text-sm font-medium text-[#1D1D1F] mb-2">
                        Roles
                      </label>
                      <div className="space-y-2">
                        {roles.map((role) => (
                          <div key={role.value} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-[#F5F5F7]">
                            <div className="flex items-center h-5">
                              <input
                                type="checkbox"
                                checked={formData.roles.includes(role.value)}
                                onChange={() => handleRoleChange(role.value)}
                                className="h-4 w-4 rounded border-gray-300 text-[#0071E3] focus:ring-[#0071E3]"
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-medium text-[#1D1D1F]">
                                {role.label}
                              </label>
                              <p className="text-xs text-[#86868B]">
                                {role.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      {formData.roles.length === 0 && (
                        <p className="mt-1 text-xs text-red-500">
                          Please select at least one role
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-[#F5F5F7] px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full justify-center rounded-lg bg-[#0071E3] px-4 py-2 text-sm font-medium text-white hover:bg-[#0077ED] sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 inline-flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-[#1D1D1F] hover:bg-[#F5F5F7] sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;