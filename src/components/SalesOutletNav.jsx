import React, { useState, useEffect } from 'react';

const SalesOutletNav = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

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

  return (
	<div className="flex justify-between items-center h-6 bg-gray-100 text-black px-4">
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
		  <img src="/images/profile-circle.svg " alt="Profile" className="w-4 h-4 cursor-pointer" />
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