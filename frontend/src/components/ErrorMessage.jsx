import React from "react";

const ErrorMessage = ({ message }) =>
  message ? (
    <p className="font-bold text-red-600 text-sm mt-2">{message}</p>
  ) : null;

export default ErrorMessage;
