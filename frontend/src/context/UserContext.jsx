import React, { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

export const UserProvider = (props) => {
  const [token, setToken] = useState(localStorage.getItem("LeadsToken"));

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/users/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.warn("Token invalid or expired.");
          setToken(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setToken(null);
      } finally {
        localStorage.setItem("LeadsToken", token);
      }
    };

    if (token) {
      fetchUser();
    }
  }, [token]);

  return (
    <UserContext.Provider value={[token, setToken]}>
      <div className="transition-opacity duration-300 ease-in text-gray-800">
        {props.children}
      </div>
    </UserContext.Provider>
  );
};
