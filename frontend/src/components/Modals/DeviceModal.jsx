import React, { useEffect, useState } from "react";
import Tabs from "../TabComponents/Tabs";
import roomCodesData from "./data/hoersaal_raumcode.json";

const DeviceModal = ({
  active,
  handleModal,
  token,
  device_id,
  setErrorMessage,
  fullView,
  ownerView,
  isAdmin,
}) => {
  const initialFormState = {
    title: "",
    deviceType: "",
    description: "",
    accessories: "",
    usernameBuyer: "",
    imageURL: "",
    serialNumber: "",
    owner: "",
    roomCode: "",
    price: "",
    timestampWarrantyEnd: "",
    timestampPurchase: "",
    costCentre: "",
    seller: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (!device_id) return;

    const getDevice = async () => {
      try {
        const res = await fetch(`http://localhost:8000/devices/${device_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Could not get the device");

        const data = await res.json();

        setFormData({
          title: data.title || "",
          deviceType: data.device_type || "",
          description: data.description || "",
          accessories: data.accessories || "",
          usernameBuyer: data.rz_username_buyer || "",
          imageURL: data.image_url || "",
          serialNumber: data.serial_number || "",
          owner: data.owner_rz_username || "",
          roomCode: data.room_code || "",
          price: data.price || "",
          timestampWarrantyEnd: data.timestamp_warranty_end || "",
          timestampPurchase: data.timestamp_purchase || "",
          costCentre: data.cost_centre || "",
          seller: data.seller || "",
        });
      } catch (err) {
        setErrorMessage(err.message);
      }
    };

    getDevice();
  }, [device_id, token, setErrorMessage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const cleanForm = () => setFormData(initialFormState);

  const submitDevice = async (e, method) => {
    e.preventDefault();

    const url = device_id
      ? `http://localhost:8000/devices/${device_id}`
      : "http://localhost:8000/devices";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          device_type: formData.deviceType,
          description: formData.description,
          accessories: formData.accessories,
          serial_number: formData.serialNumber,
          rz_username_buyer: formData.usernameBuyer,
          image_url: formData.imageURL,
          owner_rz_username: formData.owner,
          room_code: formData.roomCode,
          price: formData.price,
          timestamp_warranty_end: formData.timestampWarrantyEnd,
          timestamp_purchase: formData.timestampPurchase,
          cost_centre: formData.costCentre,
          seller: formData.seller,
        }),
      });

      if (!res.ok) throw new Error("Something went wrong");

      cleanForm();
      handleModal();
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const extractRoomCodes = () => roomCodesData.map(({ room_code }) => room_code);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-auto">
        <header className="bg-blue-100 p-4 rounded-t-lg flex justify-between items-center">
          <h1 className="text-xl font-semibold">
            {fullView
              ? "Overview"
              : device_id
              ? "Update Device"
              : "Create Device"}
          </h1>
          <div>
            <button
              onClick={handleModal}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
              title="Close modal"
            >
              X
            </button>
          </div>
        </header>

        <section className="p-4">
          {fullView ? (
            <Tabs
              device_id={device_id}
              token={token}
              isAdmin={isAdmin}
              setErrorMessage={setErrorMessage}
            />
          ) : ownerView ? (
            <div>
              <p>Owner view not fully implemented</p>
            </div>
          ) : (
            <form
              onSubmit={(e) => submitDevice(e, device_id ? "PUT" : "POST")}
              className="space-y-4"
            >
              {/* Replace below with your actual form fields */}
              {[
                { label: "Title", name: "title" },
                { label: "Device Type", name: "deviceType" },
                { label: "Description", name: "description" },
                { label: "Accessories", name: "accessories" },
                { label: "Serial Number", name: "serialNumber" },
                { label: "RZ Username Buyer", name: "usernameBuyer" },
                { label: "Image URL", name: "imageURL" },
                { label: "Owner", name: "owner" },
                { label: "Price", name: "price" },
                { label: "Timestamp Warranty End", name: "timestampWarrantyEnd" },
                { label: "Timestamp Purchase", name: "timestampPurchase" },
                { label: "Cost Centre", name: "costCentre" },
                { label: "Seller", name: "seller" },
              ].map(({ label, name }) => (
                <div key={name} className="flex flex-col">
                  <label className="mb-1 font-medium">{label}</label>
                  <input
                    type="text"
                    name={name}
                    placeholder={`Enter ${label.toLowerCase()}`}
                    value={formData[name]}
                    onChange={handleChange}
                    required
                    className="border rounded px-3 py-2"
                  />
                </div>
              ))}

              <div className="flex flex-col">
                <label className="mb-1 font-medium">Room Code</label>
                <select
                  name="roomCode"
                  value={formData.roomCode}
                  onChange={handleChange}
                  required
                  className="border rounded px-3 py-2"
                >
                  <option value="" disabled>
                    Select room code
                  </option>
                  {extractRoomCodes().map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="submit"
                  className={`${
                    device_id
                      ? "bg-blue-500 hover:bg-blue-600"
                      : "bg-green-500 hover:bg-green-600"
                  } text-white px-4 py-2 rounded`}
                >
                  {device_id ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={handleModal}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </section>

        {fullView && (
          <footer className="bg-blue-100 p-4 rounded-b-lg flex justify-end">
            <button
              onClick={handleModal}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Close
            </button>
          </footer>
        )}
      </div>
    </div>
  );
};

export default DeviceModal;
