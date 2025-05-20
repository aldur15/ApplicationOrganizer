import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";

const Header = ({ title }) => {
  const [token, setToken] = useContext(UserContext);

  const handleLogout = () => {
    setToken(null);
  };

  return (
    <div className="text-center my-7">
      <h1 className="text-3xl font-bold">{title}</h1>
      {token && (
        <button
          className="mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
          onClick={handleLogout}
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default Header;
