import React, { useContext } from "react";
//python -m uvicorn main:app --reload
import Register from "./components/Register";
import Login from "./components/Login";
import Header from "./components/Header";
import { UserContext } from "./context/UserContext";
import DeviceTable from "./components/Table/DeviceTable";

const App = () => {
  const [token] = useContext(UserContext);
  return (
    <>
      <Header title={"Device Manager"} />
      <div className="columns"></div>
      <div className="columns m-5">
        {!token ? (
          <div className="columns">
            <Register /> <Login />
          </div>
        ) : (
          <DeviceTable />
        )}
      </div>
      <div className="columns"></div>
    </>
  );
};

export default App;
