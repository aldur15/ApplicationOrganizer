
//import "./../../style.css";
import "./Modal.css";
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
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!device_id) return;
    setLoading(true);
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
      } finally {
        setLoading(false);
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
    setSubmitting(true);

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
    } finally {
      setSubmitting(false);
    }
  };

  const extractRoomCodes = () => roomCodesData.map(({ room_code }) => room_code);

  const formFields = [
    { name: "title", label: "Title", type: "text" },
    { name: "deviceType", label: "Device Type", type: "text" },
    { name: "description", label: "Description", type: "text" },
    { name: "accessories", label: "Accessories", type: "text" },
    { name: "serialNumber", label: "Serial Number", type: "text" },
    { name: "usernameBuyer", label: "Username Buyer", type: "text" },
    { name: "imageURL", label: "Image URL", type: "url" },
    { name: "owner", label: "Owner", type: "text" },
    { name: "price", label: "Price", type: "number" },
    { name: "timestampWarrantyEnd", label: "Warranty End Date", type: "date" },
    { name: "timestampPurchase", label: "Purchase Date", type: "date" },
    { name: "costCentre", label: "Cost Centre", type: "text" },
    { name: "seller", label: "Seller", type: "text" },
  ];

  if (!active) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 device-modal-backdrop"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 device-modal-container">
        <header className="border-b pb-4 mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            {fullView ? "Overview" : device_id ? "Update Device" : "Create Device"}
          </h1>
          <button
            onClick={handleModal}
            className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 device-modal-close"
            title="Close modal"
          >
            &times;
          </button>
        </header>

        <section>
          {fullView ? (
            <Tabs
              device_id={device_id}
              token={token}
              isAdmin={isAdmin}
              setErrorMessage={setErrorMessage}
            />
          ) : ownerView ? (
            <p className="text-gray-600">Owner view not fully implemented</p>
          ) : loading ? (
            <p className="text-center">Loading...</p>
          ) : (
            <form
              onSubmit={(e) => submitDevice(e, device_id ? "PUT" : "POST")}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {formFields.map(({ name, label, type }) => (
                <div key={name} className="flex flex-col">
                  <label htmlFor={name} className="mb-3 text-sm font-bold tracking-wide capitalize text-gray-800">
                    {label}
                  </label>
                  <input
                    id={name}
                    type={type}
                    name={name}
                    placeholder={`Enter ${label}`}
                    value={formData[name]}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
                  />
                </div>
              ))}

              <div className="flex flex-col">
                <label htmlFor="roomCode" className="mb-3 text-sm font-bold text-gray-800 tracking-wide">Room Code</label>
                <select
                  id="roomCode"
                  name="roomCode"
                  value={formData.roomCode}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
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

              <div className="col-span-full flex justify-end space-x-4 mt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`${
                    device_id ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"
                  } text-white font-semibold px-6 py-2 rounded-full transition ${
                    submitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {submitting ? "Submitting..." : device_id ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={handleModal}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </section>

        {fullView && (
          <footer className="mt-6 border-t pt-4 flex justify-end">
            <button
              onClick={handleModal}
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700"
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
