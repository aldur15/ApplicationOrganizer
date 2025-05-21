import React, { useState, useEffect } from "react";
import moment from "moment";
import PurchasingModal from "../../Modals/PurchasingModal";
import "./../Tabs.css";

const PurchasingTab = ({ device_id, token, isAdmin, setErrorMessage }) => {
  const [device, setDevice] = useState("");
  const [devicePurchases, setDevicePurchases] = useState([]);
  const [activeModal, setActiveModal] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [purchaseID, setPurchaseID] = useState("");

  const updatePurchase = async (purchase_information_id) => {
    setPurchaseID(purchase_information_id);
    setIsCreate(false);
    setActiveModal(true);
  };

  const deletePurchase = async (purchase_information_id) => {
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const response = await fetch(
      `http://localhost:8000/purchasing_information/${purchase_information_id}`,
      requestOptions
    );
    if (!response.ok) {
      setErrorMessage("Couldn't delete the Purchase");
    } else {
      getDevicePurchasings();
    }
  };

  const getDevicePurchasings = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const response = await fetch(
      `http://localhost:8000/devices/purchasing_information/${device_id}`,
      requestOptions
    );
    if (!response.ok) {
      setErrorMessage("Couldn't load the Device Purchases");
    } else {
      const data = await response.json();
      setDevicePurchases(data);
    }
  };

  useEffect(() => {
    const getDevice = async () => {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };
      const response = await fetch(
        `http://localhost:8000/devices/${device_id}`,
        requestOptions
      );

      if (!response.ok) {
        setErrorMessage("Could not get the device");
      } else {
        const data = await response.json();
        setDevice(data);
      }
    };

    if (device_id) {
      getDevice();
      getDevicePurchasings();
    }
  }, [device_id, token]);

  const handleModal = () => {
    setActiveModal(!activeModal);
    getDevicePurchasings();
  };

  const createPurchasings = () => {
    setIsCreate(true);
    setActiveModal(true);
  };

  return (
    <div className="p-4">
      <PurchasingModal
        active={activeModal}
        handleModal={handleModal}
        token={token}
        device_id={device_id}
        purchasing_information_id={purchaseID}
        setErrorMessage={setErrorMessage}
        isCreate={isCreate}
      />

      <div className="flex justify-end mb-4">
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition"
          onClick={createPurchasings}
        >
          Create Purchase
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-600 border">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b">
            <tr>
              <th scope="col" className="px-4 py-3">Purchase</th>
              <th scope="col" className="px-4 py-3">Warranty End</th>
              <th scope="col" className="px-4 py-3">Purchase Date</th>
              <th scope="col" className="px-4 py-3">Cost Centre</th>
              <th scope="col" className="px-4 py-3">Seller</th>
              {isAdmin && <th scope="col" className="px-4 py-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {devicePurchases.map((purchase) => (
              <tr
                key={purchase.purchasing_information_id}
                className="border-b hover:bg-gray-50"
              >
                <td className="px-4 py-2">{purchase.price}</td>
                <td className="px-4 py-2">
                  {moment(purchase.timestamp_warranty_end).format("MMM Do YY")}
                </td>
                <td className="px-4 py-2">
                  {moment(purchase.timestamp_purchase).format("MMM Do YY")}
                </td>
                <td className="px-4 py-2">{purchase.cost_centre}</td>
                <td className="px-4 py-2">{purchase.seller}</td>
                {isAdmin && (
                  <td className="px-4 py-2 text-right space-x-2">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                      onClick={() => updatePurchase(purchase.purchasing_information_id)}
                    >
                      Update
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      onClick={() => deletePurchase(purchase.purchasing_information_id)}
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchasingTab;
