import React, { useState } from "react";
import "./index.css";
import axios from "axios";
import ChooseStore from "./ChooseStore";

const Login = () => {
  const [username, setUsername] = useState("ashan1@gmail.com");
  const [password, setPassword] = useState("P@ssw0rd");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);

  const chooseView = () => {
    console.log("Choosing view based on access levels");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        email: username,
        password: password,
      });
      setMessage(response.data.message);
      const userData = response.data.user;
      setUser(userData);

      if (
        (userData.admin_access === 1 || userData.cashier_access === 1) &&
        userData.technician_access === 1
      ) {
        chooseView();
      } else if (userData.cashier_access === 1) {
      } else if (userData.technician_access === 1) {
      }
      // Store token and user data as needed
    } catch (error) {
      setMessage(error.response ? error.response.data.message : error.message);
    }
  };
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className=" top-4 absolute w-[90%]  boredr-b-2 border border-t-0 border-l-0 border-r-0 border-gray-200 flex items-center justify-between">
          <div className="text-2xl font-medium mb-4 text-dark">
            My AppleCare
          </div>
          <div className="text-lg mb-4 text-gray-400">Sign In</div>
        </div>
        {/* Logo */}
        <div className="flex items-center justify-center mb-6 mt-20">
          <img
            src="./images/Apple-ID.png" // Replace with actual logo
            alt="Apple Logo"
            className="lg:h-40 lg:w-40 h-20 w-20"
          />
        </div>

        {/* Welcome Text */}
        <h2 className="lg:text-2xl text-lg text-dark ">Welcome to</h2>
        <h1 className="lg:text-[32px] text-2xl font-semibold text-dark ">
          My AppleCare Mobile
        </h1>

        {/* Form */}
        {user == null ? (
          <div className="w-full max-w-sm rounded-lg p-6">
            {/* Your form fields */}
            <div>
              <label className="block text-gray-300 text-xs font-medium  absolute ml-3 mt-2 ">
                Username
              </label>
              <input
                className="appearance-none border  rounded-t-md w-full py-2 px-3 font-semibold  leading-tight focus:outline-none focus:shadow-outline pt-6"
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label
                className="block text-gray-300 text-xs font-medium  absolute ml-3 mt-2 "
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="appearance-none border border-t-0  rounded-b-md w-full py-2 px-3 font-semibold  leading-tight focus:outline-none focus:shadow-outline pt-6"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="macBlueButton text-white py-2 px-4 rounded-md focus:outline-none focus:shadow-outline w-full"
                onClick={handleLogin}
              >
                Login
              </button>
            </div>
          </div>
        ) : (
          <ChooseStore />
        )}
      </div>
    </>
  );
};

export default Login;
