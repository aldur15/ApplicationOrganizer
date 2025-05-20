import React, { useEffect, useState } from "react";
import moment from "moment";
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
  const [formData, setFormData] = useState({
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
  });

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
    setFormData((fd) => ({ ...fd, [name]: value }));
  };

  const cleanForm = () => {
    setFormData({
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
    });
  };

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

  const extractRoomCodes = () => roomCodesData.map((item) => item.room_code);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${
        active ? "block" : "hidden"
      }`}
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-auto">
        <header className="bg-blue-100 p-4 rounded-t-lg">
          <h1 className="text-xl font-semibold">
            {fullView ? "Overview" : device_id ? "Update Device" : "Create Device"}
          </h1>
        </header>
        <section className="p-4">
          {fullView ? (
            <Tabs device_id={device_id} token={token} isAdmin={isAdmin} setErrorMessage={setErrorMessage} />
          ) : ownerView ? (
            <div>
              {/* Owner view content */}
              <p>Owner view not fully implemented</p>
            </div>
          ) : (
            <form onSubmit={(e) => submitDevice(e, device_id ? "PUT" : "POST")} className="space-y-4">
              {[
                { label: "Title", name: "title", type: "text", placeholder: "Enter Title" },
                { label: "Device Type", name: "deviceType", type: "text", placeholder: "Enter device type" },
                { label: "Description", name: "description", type: "text", placeholder: "Enter description" },
                { label: "Accessories", name: "accessories", type: "text", placeholder: "Enter accessories" },
                { label: "Serial Number", name: "serialNumber", type: "text", placeholder: "Enter serial number" },
                { label: "RZ Username Buyer", name: "usernameBuyer", type: "text", placeholder: "Enter rz username buyer" },
                { label: "Image URL", name: "imageURL", type: "text", placeholder: "Enter image URL" },
                { label: "Owner", name: "owner", type: "text", placeholder: "Enter owner" },
                { label: "Price", name: "price", type: "text", placeholder: "Enter price" },
                { label: "Timestamp Warranty End", name: "timestampWarrantyEnd", type: "text", placeholder: "Enter timestamp warranty end" },
                { label: "Timestamp Purchase", name: "timestampPurchase", type: "text", placeholder: "Enter timestamp purchase" },
                { label: "Cost Centre", name: "costCentre", type: "text", placeholder: "Enter cost centre" },
                { label: "Seller", name: "seller", type: "text", placeholder: "Enter seller" },
              ].map(({ label, name, type, placeholder }) => (
                <div key={name} className="flex flex-col">
                  <label className="mb-1 font-medium">{label}</label>
                  {name === "roomCode" ? (
                    <select
                      name={name}
                      value={formData[name]}
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
                  ) : (
                    <input
                      name={name}
                      type={type}
                      placeholder={placeholder}
                      value={formData[name]}
                      onChange={handleChange}
                      required
                      className="border rounded px-3 py-2"
                    />
                  )}
                </div>
              ))}

              {/* Separate roomCode select */}
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
            </form>
          )}
        </section>
        <footer className="bg-blue-100 p-4 rounded-b-lg flex justify-end space-x-3">
          {fullView ? (
            <button
              onClick={handleModal}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Close
            </button>
          ) : device_id ? (
            <>
              <button
                onClick={(e) => submitDevice(e, "PUT")}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Update
              </button>
              <button
                onClick={handleModal}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={(e) => submitDevice(e, "POST")}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Create
              </button>
              <button
                onClick={handleModal}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </>
          )}
        </footer>
      </div>
    </div>
  );
};

export default DeviceModal;
