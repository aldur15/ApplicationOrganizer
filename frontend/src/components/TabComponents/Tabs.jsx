import React, { useState } from "react";

import FullViewTab from "./AllTabs/FullViewTab";
import LocationsTab from "./AllTabs/LocationsTab";
import OwnersTab from "./AllTabs/OwnersTab";
import PurchasingTab from "./AllTabs/PurchasingsTab";
import "./Tabs.css";

const Tabs = ({ device_id, token, isAdmin, setErrorMessage }) => {
  const [activeTab, setActiveTab] = useState("tab1");

  const handleFullViewTab = () => {
    setActiveTab("tab1");
  };
  const handleLocationsTab = () => {
    setActiveTab("tab2");
  };

  const handleOwnersTab = () => {
    setActiveTab("tab3");
  };

  const handlePurchasingTab = () => {
    setActiveTab("tab4");
  };
  return (
    <div>
      {""}
      <tr className="nav">
        <th
          className={activeTab === "tab1" ? "active" : ""}
          onClick={handleFullViewTab}
        >
          Full View
        </th>
        <th
          className={activeTab === "tab2" ? "active" : ""}
          onClick={handleLocationsTab}
        >
          Location History
        </th>
        <th
          className={activeTab === "tab3" ? "active" : ""}
          onClick={handleOwnersTab}
        >
          Owners History
        </th>
        {isAdmin ? (
          <th
            className={activeTab === "tab4" ? "active" : ""}
            onClick={handlePurchasingTab}
          >
            Purchasing History
          </th>
        ) : (
          <></>
        )}
      </tr>
      <div>
        {activeTab === "tab1" ? (
          <FullViewTab
            device_id={device_id}
            token={token}
            setErrorMessage={setErrorMessage}
          />
        ) : activeTab === "tab2" ? (
          <LocationsTab
            device_id={device_id}
            token={token}
            setErrorMessage={setErrorMessage}
            isAdmin={isAdmin}
          />
        ) : activeTab === "tab3" ? (
          <OwnersTab
            device_id={device_id}
            token={token}
            setErrorMessage={setErrorMessage}
            isAdmin={isAdmin}
          />
        ) : (
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
