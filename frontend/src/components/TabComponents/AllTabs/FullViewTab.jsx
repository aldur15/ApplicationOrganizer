import React, { useState, useEffect } from "react";

import moment from "moment";
const FullViewTab = ({ device_id, token, setErrorMessage }) => {
  //const [location,setLocationTransactions] = useState(null)
  const [device, setDevice] = useState("");
  const [location, setLastLocationTransaction] = useState("");
  const [owner, setLastOwner] = useState("");
  const [purchasing, setLastPurchasingInformation] = useState("");

  const getLocationOwner = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const response = await fetch(
      `http://localhost:8000/devices/location_transactions/${device_id}`,
      requestOptions
    );
    if (!response.ok) {
      setErrorMessage("Couldn't load the Device Locations");
    } else {
      const data = await response.json();
      //setLocationTransactions(data);
      setLastLocationTransaction(
        data[Object.keys(data)[Object.keys(data).length - 1]]
      );
    }
  };

  const getDeviceOwner = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const response = await fetch(
      `http://localhost:8000/devices/owner_transactions/${device_id}`,
      requestOptions
    );
    if (!response.ok) {
      setErrorMessage("Couldn't load the Device Owners");
    } else {
      const data = await response.json();
      //setDeviceOwners(data);
      setLastOwner(data[Object.keys(data)[Object.keys(data).length - 1]]);
    }
  };

  const getDevicePurchasing = async () => {
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
      setErrorMessage("Couldn't load the Device Purchasings");
    } else {
      const data = await response.json();
      //setPurchasingInformations(data);
      setLastPurchasingInformation(
        data[Object.keys(data)[Object.keys(data).length - 1]]
      );
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
      getLocationOwner();
      getDeviceOwner();
      getDevicePurchasing();
    }
  }, [device_id, token]);

  return (
    <div>
      <div className="field">
        <label className="label"></label>
        <div className="control">Title: {device.title}</div>
      </div>
      <div className="field">
        <label className="label"></label>
        <div className="control">Device Type: {device.device_type}</div>
      </div>
      <div className="field">
        <label className="label"></label>
        <div className="control">Description: {device.description}</div>
      </div>
      <div className="field">
        <label className="label"></label>
        <div className="control">Accessories: {device.accessories}</div>
      </div>
      <div className="field">
        <label className="label"></label>
        <div className="control">Serial Number: {device.serial_number}</div>
      </div>
      <div className="field">
        <label className="label"></label>
        <div className="control">
          Username Buyer: {device.rz_username_buyer}
        </div>
      </div>
      <div className="field">
        <label className="label"></label>
        <div className="control">Image URL: {device.image_url}</div>
      </div>
      <div className="field">
        <label className="label"></label>
        <div className="control">Username Owner: {owner.rz_username}</div>
      </div>
      <div className="field">
        <label className="label"></label>
        <div className="control">
          Owner Since: {moment(owner.owner_transaction_id).format("MMM Do YY")}
        </div>
      </div>
      <div className="field">
        <label className="label"></label>
        <div className="control">Located At: {location.room_code}</div>
      </div>
      <div className="field">
        <label className="label"></label>
        <div className="control">
          Located Since:
          {moment(location.timestamp_located_since).format("MMM Do YY")}
        </div>
      </div>
      <div className="field">
        <label className="label"></label>
        <div className="control">Price in €: {purchasing.price}</div>
      </div>
      <div className="field">
        <label className="label"></label>
        <div className="control">
          Warranty Ends At:{" "}
          {moment(purchasing.timestamp_warranty_end).format("MMM Do YY")}
        </div>
      </div>
      <div className="field">
        <label className="label"></label>
        <div className="control">
          Purchased At:{" "}
          {moment(purchasing.timestamp_purchase).format("MMM Do YY")}
        </div>
      </div>
      <div className="field">
        <label className="label"></label>
        <div className="control">Cost Center: {purchasing.cost_centre}</div>
      </div>
      <div className="field">
        <label className="label"></label>
        <div className="control">Seller: {purchasing.seller}</div>
      </div>
    </div>
  );
};
export default FullViewTab;
