import { useEffect, useState } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";
import useAuthStore from "./stores/authStore";
import ChooseStore from "./components/ChooseStore";


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const setAuth = useAuthStore((state) => state.setAuth);
  const [choose, setChoose] = useState(false);
  const navigate = useNavigate();
  const getRedirectPath = useAuthStore((state) => state.getRedirectPath);

useEffect(() => {
  const redirectPath = getRedirectPath();
  if (redirectPath === "/choose-store") {
    setChoose(true);
  }else {
    navigate(redirectPath);
  }
},[getRedirectPath, navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
      try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: username,
          password,
        }),
      });
      

      const data = await response.json();

      if (response.ok && data.token) {
        // Store auth data with roles
        setAuth(data.token, data.user, data.roles);
        
        // Get redirect path based on roles
        const redirectPath = getRedirectPath();
        if (redirectPath === "/choose-store") {
          setChoose(true);
        }else {
          navigate(redirectPath);
        }
        
      } else {
        setMessage("Invalid credentials");
      }
    } catch (error) {
      setMessage("Login failed");
    }
  };



  return (
    <div className="flex flex-col min-h-screen bg-white justify-center items-center">
      <div className="absolute top-4 w-[90%] border-b-2 border-gray-200 flex items-center justify-between">
        <div className="text-2xl font-medium mb-4 text-dark">My AppleCare</div>
        <div className="text-md mb-4 text-gray-400">Sign In</div>
      </div>

      {/* Logo */}
      <div className="flex items-center justify-center mb-6 mt-40">
        <img
          src="./images/Apple-ID.png" // Replace with actual logo
          alt="Apple Logo"
          className="lg:h-40 lg:w-40 w-28 h-28"
        />
      </div>

      {/* Welcome Text */}
      <h2 className="lg:text-2xl text-lg text-dark text-center">Welcome to</h2>
      <h1 className="lg:text-[32px] text-2xl font-semibold text-dark text-center">
        My AppleCare Mobile
      </h1>

      {/* Form */}
      {choose === false ? (
        <div className="w-full max-w-sm rounded-lg p-6">
          <div className="w-full text-center mb-1">
            <span className="text-red-500">{message}</span>
          </div>

          {/* Username Field */}
          <div>
            <label
              className={
                message === null
                  ? "block text-gray-300 text-xs font-medium absolute ml-3 mt-2"
                  : "block text-red-500 text-xs font-medium absolute ml-3 mt-2"
              }
            >
              Username
            </label>
            <input
              className={
                message === null
                  ? "border rounded-t-md w-full py-2 px-3 font-semibold leading-tight focus:outline-none focus:shadow-outline pt-6"
                  : "bg-red-100 border border-red-700 rounded-t-md w-full py-2 px-3 font-semibold leading-tight focus:outline-none focus:shadow-outline pt-6"
              }
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Password Field */}
          <div className="mb-2">
            <label
              className={
                message === null
                  ? "block text-gray-300 text-xs font-medium absolute ml-3 mt-2"
                  : "block text-red-500 text-xs font-medium absolute ml-3 mt-2"
              }
              htmlFor="password"
            >
              Password
            </label>
            <input
              className={
                message === null
                  ? "appearance-none border rounded-b-md border-t-0 w-full py-2 px-3 font-semibold leading-tight focus:outline-none focus:shadow-outline pt-6"
                  : "appearance-none bg-red-100 border border-red-700 rounded-b-md border-t-0 w-full py-2 px-3 font-semibold leading-tight focus:outline-none focus:shadow-outline pt-6"
              }
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Login Button */}
          <div className="flex items-center justify-between">
            <button
              className="macBlueButton text-white py-2 px-4 rounded-md focus:outline-none focus:shadow-outline w-full"
              onClick={handleSubmit}
            >
              Login
            </button>
          </div>
        </div>
      ) : (
        <ChooseStore />
      )}
    </div>
  );
};

export default Login;
