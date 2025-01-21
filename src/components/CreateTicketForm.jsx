import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api/axios";

const CreateTicketForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    contact_number: "",
    priority: "",
    device_category: "",
    device_model: "",
    imei: "",
    issue: "",
  });

  const [errors, setErrors] = useState({});
  const [waiting, setWaiting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.first_name) newErrors.first_name = "First name is required";
    if (!formData.last_name) newErrors.last_name = "Last name is required";
    if (!formData.contact_number)
      newErrors.contact_number = "Contact number is required";
    if (!formData.priority) newErrors.priority = "Priority is required";
    if (!formData.device_category)
      newErrors.device_category = "Device category is required";
    if (formData.device_category === "iPhone") {
      if (!formData.device_model || formData.device_model === "Select Device") {
        newErrors.device_model = "Device Model is required";
      }
    } else {
      if (!formData.device_model || !formData.device_model.trim()) {
        newErrors.device_model = "Device Model is required";
      }
    }
    if (!formData.imei) newErrors.imei = "IMEI is required";
    if (!formData.issue) newErrors.issue = "Issue description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setWaiting(true);
    try {
      console.log(formData);
      const response = await api.post("/tickets", formData);
      if (response.data.status === "success") {
        toast.success("Ticket created successfully");
        setFormData({
          first_name: "",
          last_name: "",
          contact_number: "",
          priority: "",
          device_category: "",
          device_model: "",
          imei: "",
          issue: "",
        });

        onSuccess();
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create ticket");
    } finally {
      setWaiting(false);
    }
  };

  return (
    <div className="flex flex-col py-2 w-full bg-white border-[1px] border-neutral-200 overflow-scroll h-screen hide-scrollbar pb-10">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ display: "none" }}
      />

      <div className="self-start text-center max-md:ml-2.5 flex justify-between w-full">
        <div className="text-start px-5">
          <h1 className="text-2xl font-bold text-black">Create Ticket</h1>
          <h2 className="self-start text-md font-medium tracking-normal text-stone-300">
            Enter Details
          </h2>
        </div>
        <button
          className="rounded-full flex justify-center items-center h-full pr-5 lg:hidden"
          onClick={onClose}
        >
          <img
            src="./images/close.svg"
            className="object-contain shrink-0 w-6 h-6"
            alt="Close"
          />
        </button>
      </div>
      <div className="shrink-0 mt-4 max-w-full h-px border border-solid border-zinc-100 w-full" />

      <form
        onSubmit={handleSubmit}
        className="flex flex-col px-4 lg:px-8 mt-3 w-full text-xs font-medium text-black max-md:px-5"
      >
        <h3 className="self-center text-xl font-medium text-center">
          Customer Details
        </h3>

        <label htmlFor="first_name" className="self-start mt-6">
          First Name
        </label>
        <input
          id="first_name"
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleInputChange}
          className="flex overflow-hidden px-1.5 py-2 mt-1 w-full rounded-md border border-solid border-black border-opacity-10 text-zinc-700 text-opacity-30"
          placeholder="First Name"
        />
        {errors.first_name && (
          <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>
        )}

        <label htmlFor="last_name" className="self-start mt-2.5">
          Last Name
        </label>
        <input
          id="last_name"
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleInputChange}
          className="flex overflow-hidden px-1.5 py-2 mt-1 w-full rounded-md border border-solid border-black border-opacity-10 text-zinc-700 text-opacity-30"
          placeholder="Last Name"
        />
        {errors.last_name && (
          <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>
        )}

        <label htmlFor="contact_number" className="self-start mt-2.5">
          Contact Number
        </label>
        <input
          id="contact_number"
          type="number"
          name="contact_number"
          value={formData.contact_number}
          onChange={handleInputChange}
          className="flex overflow-hidden mt-1 px-1.5 py-2 w-full rounded-md border border-solid border-black border-opacity-10 text-zinc-700 text-opacity-30"
          placeholder="Contact Number"
        />
        {errors.contact_number && (
          <p className="text-red-500 text-xs mt-1">{errors.contact_number}</p>
        )}

        <fieldset className="border-0 p-0 mt-2.5">
          <legend className="self-start">Priority</legend>
          <div className="grid grid-cols-3 gap-1 whitespace-nowrap text-center mt-1">
            {["Low", "Medium", "High"].map((priority) => (
              <label
                key={priority}
                className={`px-2 py-2 bg-white rounded-md border border-solid max-md:px-5 flex justify-center items-center gap-1 ${
                  formData.priority === priority.toLowerCase()
                    ? "border-black border-2"
                    : "border-neutral-200"
                }`}
              >
                <input
                  type="radio"
                  name="priority"
                  value={priority.toLowerCase()}
                  checked={formData.priority === priority.toLowerCase()}
                  className="sr-only"
                  onChange={handleInputChange}
                />
                <div
                  className={`h-1.5 w-1.5 -ml-2 rounded-full ${
                    priority === "Low"
                      ? "bg-green-300"
                      : priority === "Medium"
                      ? "bg-yellow-300"
                      : "bg-red-400"
                  }`}
                ></div>
                {priority}
              </label>
            ))}
          </div>
          {errors.priority && (
            <p className="text-red-500 text-xs mt-1">{errors.priority}</p>
          )}
        </fieldset>

        <div className="shrink-0 mt-4 max-w-full h-px border border-solid border-zinc-100 w-full mb-3" />
        <h3 className="self-center text-xl font-medium text-center mb-2">
          Device Details
        </h3>

        <fieldset className="border-0 p-0 mt-2.5">
          <legend className="self-start">Device Category</legend>
          <div className="grid grid-cols-3 gap-1 mt-1.5 justify-center items-center">
            {[
              { name: "iPhone", icon: "iphoneIcon.svg" },
              { name: "Android", icon: "androidIcon.svg" },
              { name: "Other", icon: null },
            ].map((category) => (
              <label
                key={category.name}
                className={`flex justify-center items-center gap-2.5 p-1.5 font-medium whitespace-nowrap bg-white rounded-md border border-solid ${
                  formData.device_category === category.name.toLowerCase()
                    ? "border-black border-2"
                    : "border-neutral-200"
                }`}
              >
                <input
                  type="radio"
                  name="device_category"
                  value={category.name.toLowerCase()}
                  className="sr-only"
                  onChange={handleInputChange}
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
          {errors.device_category && (
            <p className="text-red-500 text-xs mt-1">
              {errors.device_category}
            </p>
          )}
        </fieldset>

        {formData.device_category === "iPhone" ? (
          <>
            <label
              htmlFor="deviceSelect"
              className="self-start mt-3 font-medium"
            >
              Select Device
            </label>
            <select
              name="device_model"
              value={formData.device_model}
              onChange={handleInputChange}
              className={`flex overflow-hidden gap-5 justify-between px-2 py-2 w-full rounded-md border border-solid border-black border-opacity-10 text-black ${
                formData.device_model === "Select Device"
                  ? "text-opacity-30"
                  : "text-opacity-100"
              }`}
            >
              <option className="text-black">Select Device</option>
              <option className="text-black">Iphone 6s</option>
              {/* Add more options as needed */}
            </select>
          </>
        ) : (
          <>
            <label
              htmlFor="device_model"
              className="self-start mt-3 font-medium"
            >
              Device Model
            </label>
            <input
              name="device_model"
              value={formData.device_model}
              onChange={handleInputChange}
              type="text"
              className="flex overflow-hidden gap-5 justify-between px-2 py-2 w-full rounded-md border border-solid border-black border-opacity-10 text-opacity-30"
              placeholder="Device Model"
            />
          </>
        )}
        {errors.device_model && (
          <p className="text-red-500 text-xs mt-1">{errors.device_model}</p>
        )}

        <label htmlFor="imei" className="self-start mt-1.5 font-medium">
          IMEI
        </label>
        <input
          id="imei"
          type="text"
          name="imei"
          value={formData.imei}
          onChange={handleInputChange}
          className="flex overflow-hidden px-1.5 py-2 mt-1 rounded-md border border-solid border-black border-opacity-10 text-zinc-700 text-opacity-30"
          placeholder="Enter IMEI Number"
        />
        {errors.imei && (
          <p className="text-red-500 text-xs mt-1">{errors.imei}</p>
        )}

        <label htmlFor="issue" className="self-start mt-2 font-medium">
          Issue
        </label>
        <textarea
          id="issue"
          name="issue"
          value={formData.issue}
          rows={2}
          onChange={handleInputChange}
          className="flex overflow-hidden px-1.5 pt-2 pb-5 mt-1 w-full whitespace-nowrap rounded-md border border-solid border-black border-opacity-10 min-h-[101px] text-zinc-700 "
          placeholder="Issue"
        />
        {errors.issue && (
          <p className="text-red-500 text-xs mt-1">{errors.issue}</p>
        )}

        {waiting === false ? (
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
        ) : (
          <button className="flex py-3 mt-5 text-lg font-medium text-white gap-3 rounded-lg bg-zinc-800 justify-center items-center">
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
