import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { toast } from 'react-toastify';

const SalesOutletNav = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const logout = useAuthStore(state => state.logout);

  useEffect(() => {
	const timer = setInterval(() => {
	  setCurrentTime(new Date());
	}, 60000); // Update every minute
  
	return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date) => {
	const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
	const month = date.toLocaleDateString('en-US', { month: 'short' });
	const day = date.getDate();
	const time = date.toLocaleTimeString('en-US', { 
	  hour: 'numeric',
	  minute: '2-digit',
	  hour12: true 
	});
	
	return `${weekday} ${month} ${day}  ${time}`;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
	<div className="flex justify-between items-center h-6 bg-gray-100 text-black px-4 absolute top-0 left-0 right-0 z-10">
	  {/* Left side */}
	  <div className="flex items-center space-x-4">
		<img src="/images/apple-logo.svg" alt="Logo" className="lg:w-4 lg:h-4 w-3 h-3" />
		<a className="text-sm font-semibold cursor-pointer" href='/service-center'>Sales Outlet</a>
		<div className="flex space-x-4 text-xs font-semibold">
		<a className="hover:text-gray-600  px-2 py-0.5 rounded cursor-pointer" href='/return'>Return</a>
		  <a className="hover:text-gray-600  px-2 py-0.5 rounded cursor-pointer" href='/invoice'>Invoice</a>
		</div>
	  </div>

	  {/* Right side */}
	  <div className="flex items-center space-x-4">
		<div className="flex items-center space-x-2">
		  <div className="relative">
			<img 
			  src="/images/profile-circle.svg" 
			  alt="Profile" 
			  className="w-4 h-4 cursor-pointer hover:opacity-75"
			  onClick={() => setShowDropdown(!showDropdown)}
			/>
			
			{showDropdown && (
			  <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg py-2 z-50">
				<button
				  onClick={handleLogout}
				  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
				>
				  Logout
				</button>
			  </div>
			)}
		  </div>
		  <img src="/images/cart.svg " alt="Profile" className="w-4 h-4 cursor-pointer lg:hidden block" />
		  <span className="text-xs font-semibold lg:block hidden">
			{formatDateTime(currentTime)}
		  </span>
		</div>
	  </div>
	</div>
  );
};

export default SalesOutletNav;