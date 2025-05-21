import React, { useContext, useState } from "react";
import ErrorMessage from "./ErrorMessage";
import { UserContext } from "../context/UserContext";
import "../style.css";

const Register = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationPassword, setConfirmationpassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [, setToken] = useContext(UserContext);

  const submitRegistration = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rz_username: name, password }),
    };

    const response = await fetch("http://localhost:8000/api/users", requestOptions);
    const data = await response.json();

    if (!response.ok) {
      setErrorMessage(data.detail);
    } else {
      setToken(data.access_token);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmationPassword && password.length >= 8) {
      submitRegistration();
    } else if (password.length < 8) {
      setErrorMessage("Ensure that the password is greater than 8 characters");
    } else {
      setErrorMessage("Ensure that the passwords match");
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto auth-panel">
      <form
        className="bg-white bg-opacity-90 shadow-xl rounded-2xl px-8 pt-6 pb-8 mb-4 border border-blue-100"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-6 tracking-wide">
          Register
        </h1>

        <div className="mb-5">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            RZ-Name
          </label>
          <input
            type="text"
            placeholder="Enter RZ name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
            required
          />
        </div>

        <div className="mb-5">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            required
          />
        </div>

        <div className="mb-5">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmationPassword}
            onChange={(e) => setConfirmationpassword(e.target.value)}
            className="input-field"
            required
          />
        </div>

        <ErrorMessage message={errorMessage} />

        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
