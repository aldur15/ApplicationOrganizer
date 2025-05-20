import "./style.css";
import React, { useContext } from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import Header from "./components/Header";
import { UserContext } from "./context/UserContext";
import DeviceTable from "./components/Table/DeviceTable";

const App = () => {
  const [token] = useContext(UserContext);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-green-100 to-blue-50 flex flex-col">
      <Header title={"Device Manager"} />

      <main className="flex-grow container mx-auto px-6 py-12 flex flex-col items-center">
        {!token ? (
          <div className="flex flex-col md:flex-row gap-10 bg-white bg-opacity-90 p-10 rounded-3xl shadow-2xl w-full max-w-5xl justify-center transition-transform transform hover:scale-[1.02]">
            <Register />
            <div className="w-1 bg-gradient-to-b from-green-400 to-blue-400 mx-6 hidden md:block rounded"></div>
            <Login />
          </div>
        ) : (
          <div className="w-full max-w-7xl bg-white rounded-3xl shadow-xl p-8 ring-1 ring-green-300">
            <DeviceTable />
          </div>
        )}
      </main>

      <footer className="bg-gradient-to-r from-green-400 to-blue-500 text-white text-center py-5 mt-12 shadow-lg">
        <p className="font-semibold text-sm tracking-wide">
          &copy; {new Date().getFullYear()} Device Manager. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default App;

//py -3.11 -m uvicorn main:app --reload
//py -3.11 -m pip install -r requirements.txt