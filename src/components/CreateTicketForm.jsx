import React, { useState } from 'react';
import axios from 'axios';

const CreateTicketForm = ({ onClose, onSuccess }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [selectedPriority, setSelectedPriority] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deviceModel, setDeviceModel] = useState('');
  const [imei, setImei] = useState('');
  const [issue, setIssue] = useState('');
  const [errors, setErrors] = useState({});
  const [waiting, setWaiting] = useState(false);
  const handlePriorityChange = (e) => {
    setSelectedPriority(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setDeviceModel('');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!firstName) newErrors.firstName = 'First Name is required';
    if (!lastName) newErrors.lastName = 'Last Name is required';
    if (!contactNumber) newErrors.contactNumber = 'Contact Number is required';
    if (!selectedPriority) newErrors.selectedPriority = 'Priority is required';
    if (!selectedCategory) newErrors.selectedCategory = 'Category is required';
    if (selectedCategory === 'iPhone') {
      // For iPhone, check if the selected option is valid
      if (!deviceModel || deviceModel === "Select Device") {
          newErrors.deviceModel = 'Device Model is required';
      }
  } else {
      // For other categories, ensure the text input is not empty
      if (!deviceModel || !deviceModel.trim()) {
          newErrors.deviceModel = 'Device Model is required';
      }
  }
  
  
    if (!imei) newErrors.imei = 'IMEI is required';
    if (!issue) newErrors.issue = 'Issue is required';
    setWaiting(false);
    return newErrors;

  
  };

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/create-ticket', {
        firstName,
        lastName,
        contactNumber,
        priority: selectedPriority,
        category: selectedCategory,
        deviceModel: deviceModel,
        imei,
        issue,
      });
      console.log('Ticket created:', firstName, lastName, response.data);
      onSuccess();
      onClose(); // Close form
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  };

  return (
    <div className="flex flex-col py-2 w-full bg-white border-[1px] border-neutral-200 overflow-scroll h-screen hide-scrollbar pb-10">
      <div className="self-start text-center max-md:ml-2.5 flex justify-between w-full">
        <div className="text-start px-5">
          <h1 className="text-2xl font-bold text-black">Create Ticket</h1>
          <h2 className="self-start text-md font-medium tracking-normal text-stone-300">Enter Details</h2>
        </div>
        <button className="rounded-full flex justify-center items-center h-full pr-5 lg:hidden" onClick={onClose}>
          <img src="./images/close.svg" className="object-contain shrink-0 w-6 h-6" alt="Close" />
        </button>
      </div>
      <div className="shrink-0 mt-4 max-w-full h-px border border-solid border-zinc-100 w-full" />

      <form onSubmit={handleSubmit} className="flex flex-col px-4 lg:px-8 mt-3 w-full text-xs font-medium text-black max-md:px-5">
        <h3 className="self-center text-xl font-medium text-center">Customer Details</h3>

        <label htmlFor="firstName" className="self-start mt-6">First Name</label>
        <input
          id="firstName"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="flex overflow-hidden px-1.5 py-2 mt-1 w-full rounded-md border border-solid border-black border-opacity-10 text-zinc-700 text-opacity-30"
          placeholder="First Name"
        />
        {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}

        <label htmlFor="lastName" className="self-start mt-2.5">Last Name</label>
        <input
          id="lastName"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="flex overflow-hidden px-1.5 py-2 mt-1 w-full rounded-md border border-solid border-black border-opacity-10 text-zinc-700 text-opacity-30"
          placeholder="Last Name"
        />
        {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}

        <label htmlFor="contactNumber" className="self-start mt-2.5">Contact Number</label>
        <input
          id="contactNumber"
          type="number"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
          className="flex overflow-hidden mt-1 px-1.5 py-2 w-full rounded-md border border-solid border-black border-opacity-10 text-zinc-700 text-opacity-30"
          placeholder="Contact Number"
        />
        {errors.contactNumber && <p className="text-red-500 text-xs mt-1">{errors.contactNumber}</p>}

        <fieldset className="border-0 p-0 mt-2.5">
          <legend className="self-start">Priority</legend>
          <div className="grid grid-cols-3 gap-1 whitespace-nowrap text-center mt-1">
            {['Low', 'Medium', 'High'].map((priority) => (
              <label
                key={priority}
                className={`px-2 py-2 bg-white rounded-md border border-solid max-md:px-5 flex justify-center items-center gap-1 ${
                  selectedPriority === priority ? 'border-black border-2' : 'border-neutral-200'
                }`}
              >
                <input
                  type="radio"
                  name="priority"
                  value={priority}
                  className="sr-only"
                  onChange={handlePriorityChange}
                />
                <div
                  className={`h-1.5 w-1.5 -ml-2 rounded-full ${
                    priority === 'Low'
                      ? 'bg-green-300'
                      : priority === 'Medium'
                      ? 'bg-yellow-300'
                      : 'bg-red-400'
                  }`}
                ></div>
                {priority}
              </label>
            ))}
          </div>
          {errors.selectedPriority && <p className="text-red-500 text-xs mt-1">{errors.selectedPriority}</p>}
        </fieldset>

        <div className="shrink-0 mt-4 max-w-full h-px border border-solid border-zinc-100 w-full mb-3" />
        <h3 className="self-center text-xl font-medium text-center mb-2">Device Details</h3>

        <fieldset className="border-0 p-0 mt-2.5">
          <legend className="self-start">Device Category</legend>
          <div className="grid grid-cols-3 gap-2 mt-1.5 justify-center items-center">
            {[
              { name: 'iPhone', icon: 'iphoneIcon.svg' },
              { name: 'Android', icon: 'androidIcon.svg' },
              { name: 'Other', icon: null }
            ].map((category) => (
              <label
                key={category.name}
                className={`flex justify-center items-center gap-2.5 p-1.5 font-medium whitespace-nowrap bg-white rounded-md border border-solid ${
                  selectedCategory === category.name ? 'border-black border-2' : 'border-neutral-200'
                }`}
              >
                <input
                  type="radio"
                  name="deviceCategory"
                  value={category.name}
                  className="sr-only"
                  onChange={handleCategoryChange}
                />
                {category.icon && (
                  <img
                    src={`./images/${category.icon}`}
                    className="object-contain shrink-0 aspect-square w-[17px] -ml-3"
                    alt=""
                  />
                )}
                {category.name}
              </label>
            ))}
          </div>
          {errors.selectedCategory && <p className="text-red-500 text-xs mt-1">{errors.selectedCategory}</p>}
        </fieldset>

        {selectedCategory === 'iPhone' ? (
          <>
            <label htmlFor="deviceSelect" className="self-start mt-3 font-medium">
              Select Device
            </label>
            <select
            value={deviceModel}
            onChange={(e) => setDeviceModel(e.target.value)}
              className={`flex overflow-hidden gap-5 justify-between px-2 py-2 w-full rounded-md border border-solid border-black border-opacity-10 text-black ${deviceModel==='Select Device' ? 'text-opacity-30' : 'text-opacity-100'}`}
            >
              <option className='text-black'>Select Device</option>
              <option className='text-black'>Iphone 6s</option>
              {/* Add more options as needed */}
            </select>
          </>
        ) : (
          <>
            <label htmlFor="deviceModel" className="self-start mt-3 font-medium">
              Device Model
            </label>
            <input
              value={deviceModel}
              onChange={(e) => setDeviceModel(e.target.value)}
              type="text"
              className="flex overflow-hidden gap-5 justify-between px-2 py-2 w-full rounded-md border border-solid border-black border-opacity-10 text-opacity-30"
              placeholder="Device Model"
            />
          </>
        )}
        {errors.deviceModel && <p className="text-red-500 text-xs mt-1">{errors.deviceModel}</p>}

        <label htmlFor="imei" className="self-start mt-1.5 font-medium">IMEI</label>
        <input
          id="imei"
          type="text"
          value={imei}
          onChange={(e) => setImei(e.target.value)}
          className="flex overflow-hidden px-1.5 py-2 mt-1 rounded-md border border-solid border-black border-opacity-10 text-zinc-700 text-opacity-30"
          placeholder="Enter IMEI Number"
        />
        {errors.imei && <p className="text-red-500 text-xs mt-1">{errors.imei}</p>}

        <label htmlFor="issue" className="self-start mt-2 font-medium">Issue</label>
        <textarea
          id="issue"
          value={issue}
          rows={2}
          onChange={(e) => setIssue(e.target.value)}
          className="flex overflow-hidden px-1.5 pt-2 pb-5 mt-1 w-full whitespace-nowrap rounded-md border border-solid border-black border-opacity-10 min-h-[101px] text-zinc-700 "
          placeholder="Issue"
        />
        {errors.issue && <p className="text-red-500 text-xs mt-1">{errors.issue}</p>}

{waiting===false?(
        <button
          type="submit"
          className="flex py-3 mt-5 text-lg font-medium text-white gap-3 rounded-lg bg-zinc-800 justify-center items-center"
        >

          <span>Create Ticket</span>
          <img
            src="./images/ticket.svg"
            className="object-contain aspect-square w-5 mt-1"
            alt="Ticket"
          />
        </button>
        ):(
          <button
          className="flex py-3 mt-5 text-lg font-medium text-white gap-3 rounded-lg bg-zinc-800 justify-center items-center"
        >
          <img
            src="./images/spinner.svg"
            className="object-contain aspect-square w-5 mt-1 animate-spin"
            alt="Ticket"
          />
        </button>
        )}
      </form>
    </div>
  );
};

export default CreateTicketForm;