import React, { useState } from "react";
import FullViewTab from "./AllTabs/FullViewTab";
import LocationsTab from "./AllTabs/LocationsTab";
import OwnersTab from "./AllTabs/OwnersTab";
import PurchasingTab from "./AllTabs/PurchasingsTab";
import "./Tabs.css";

const Tabs = ({ device_id, token, isAdmin, setErrorMessage }) => {
  const [activeTab, setActiveTab] = useState("tab1");

  const tabs = [
    { key: "tab1", label: "Full View", handler: () => setActiveTab("tab1") },
    { key: "tab2", label: "Location History", handler: () => setActiveTab("tab2") },
    { key: "tab3", label: "Owners History", handler: () => setActiveTab("tab3") },
  ];

  if (isAdmin) {
    tabs.push({ key: "tab4", label: "Purchasing History", handler: () => setActiveTab("tab4") });
  }

  return (
    <div className="mt-6">
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {tabs.map(({ key, label, handler }) => (
          <button
            key={key}
            onClick={handler}
            className={`px-4 py-2 rounded-full font-semibold transition text-sm md:text-base ${
              activeTab === key
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === "tab1" && (
          <FullViewTab
            device_id={device_id}
            token={token}
            setErrorMessage={setErrorMessage}
          />
        )}
        {activeTab === "tab2" && (
          <LocationsTab
            device_id={device_id}
            token={token}
            setErrorMessage={setErrorMessage}
            isAdmin={isAdmin}
          />
        )}
        {activeTab === "tab3" && (
          <OwnersTab
            device_id={device_id}
            token={token}
            setErrorMessage={setErrorMessage}
            isAdmin={isAdmin}
          />
        )}
        {activeTab === "tab4" && (
          <PurchasingTab
            device_id={device_id}
            token={token}
            setErrorMessage={setErrorMessage}
            isAdmin={isAdmin}
          />
        )}
      </div>
    </div>
  );
};

export default Tabs;
