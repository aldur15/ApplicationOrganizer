import React, { useContext, useState } from "react";
import ErrorMessage from "./ErrorMessage";

import { UserContext } from "../context/UserContext";

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
      body: JSON.stringify({ rz_username: name, password: password }),
    };

    const response = await fetch(
      "http://localhost:8000/api/users",
      requestOptions
    );
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
      setErrorMessage("Ensure that the is greater than 8 characters");
    } else {
      setErrorMessage("Ensure that the password match");
    }
  };

  return (
    <div className="column">
      <form className="box" onSubmit={handleSubmit}>
        <h1 className="title has-text-centered">Register</h1>
        <div className="field">
          <label className="label">Rz-Name</label>
          <div className="control">
            <input
              type="name"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              required
            />
          </div>
          <label className="label">Password</label>
          <div className="control">
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              required
            />
          </div>
          <label className="label">Confirm Password</label>
          <div className="control">
            <input
              type="password"
              placeholder="Enter password"
              value={confirmationPassword}
              onChange={(e) => setConfirmationpassword(e.target.value)}
              className="input"
              required
            />
          </div>
          <ErrorMessage message={errorMessage} />
          <br />
          <button className="button is-primary" type="submit">
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
