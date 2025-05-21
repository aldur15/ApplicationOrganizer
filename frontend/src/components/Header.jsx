import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import "../style.css";

const Header = ({ title }) => {
  const [token, setToken] = useContext(UserContext);

  const handleLogout = () => {
    setToken(null);
  };

  return (
    <header className="w-full py-6 bg-gradient-to-r from-blue-100 to-green-100 shadow-sm mb-6">
      <div className="container mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 tracking-wide">
          {title}
        </h1>
        {token && (
          <button
            onClick={handleLogout}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg shadow transition duration-200"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
