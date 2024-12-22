import { useState } from "react";
import "./index.css";
import ChooseStore from "./components/ChooseStore";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Hook to navigate

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          email: username,
          password: password
        })
      });

      const data = await response.json();
      console.log(data);
      setMessage(data.message);
      const userData = data.user;

      if ((userData.technician_access === 1 && userData.cashier_access === 1) || userData.admin_access === 1) {
        setUser(userData);
      } else if (userData.cashier_access === 1) {
        navigate('/sales-outlet');
      } else if (userData.technician_access === 1) {
        navigate('/service-center');
      }
    } catch (error) {
      setMessage(error.message);
    }
};
  return (
    <>
      <div className="flex flex-col items-cenmin-h-screen bg-white">
        <div className=" top-4 absolute w-[90%]  boredr-b-2 border border-t-0 border-l-0 border-r-0 border-gray-200 flex items-center justify-between">
          <div className="text-2xl font-medium mb-4 text-dark">
            My AppleCare
          </div>
          <div className="text-md mb-4 text-gray-400">Sign In</div>
        </div>
        {/* Logo */}
        <div className="flex items-center justify-center mb-6 mt-20">
          <img
            src="./images/Apple-ID.png" // Replace with actual logo
            alt="Apple Logo"
            className="lg:h-40 lg:w-40 "
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
            <div className="w-full text-center mb-1 mt-0">
              {" "}
              <text className="text-red-500 ">{message}</text>
            </div>

            {/* Your form fields */}
            <div>
              <label className={
                message == null?
               "block text-gray-300 text-xs font-medium  absolute ml-3 mt-2 "
               :"block text-red-500 text-xs font-medium  absolute ml-3 mt-2 "
              }>
                Username
              </label>
              <input
                className={
                  message == null
                    ? " border rounded-t-md rounded-b-none  w-full py-2 px-3 font-semibold  leading-tight focus:outline-none focus:shadow-outline pt-6 "
                    : " bg-red-100 border border-red-700  rounded-t-md rounded-b-none w-full py-2 px-3 font-semibold  leading-tight focus:outline-none focus:shadow-outline pt-6 "
                }
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label
               className={
                message == null?
               "block text-gray-300 text-xs font-medium  absolute ml-3 mt-2 "
               :"block text-red-500 text-xs font-medium  absolute ml-3 mt-2 "
              }
                htmlFor="password"
              >
                Password
              </label>
              <input
                className={
                  message == null
                    ? "appearance-none border  rounded-b-md border-t-0 w-full py-2 px-3 font-semibold  leading-tight focus:outline-none focus:shadow-outline pt-6 "
                    : "appearance-none bg-red-100 border border-red-700  rounded-b-md border-t-0 w-full py-2 px-3 font-semibold  leading-tight focus:outline-none focus:shadow-outline pt-6 "
                }
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
