import React, { useEffect, useState } from "react";

import moment from "moment";
import Tabs from "../TabComponents/Tabs";
import roomCodesData from "./data/hoersaal_raumcode.json";
import "./Modal.css";

//Nur Admin darf geräte Ändern
//Nutzer darf nur Standort/bestizer neu eingeben
//Import/Export noch hinzufügen
//ReadMe noch schreiben
//CI/CD Pipeline

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
  //const [activeDevice, setActiveDevice] = useState(null);
  const [title, setTitle] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [description, setDescription] = useState("");
  const [accessories, setAccessories] = useState("");
  const [usernameBuyer, setUsernameBuyer] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [owner, setOwner] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [price, setPrice] = useState("");
  const [timestampWarrantyEnd, setTimestampWarrantyEnd] = useState("");
  const [timestampPurchase, setTimestampPurchase] = useState("");
  const [costCentre, setCostCentre] = useState("");
  const [seller, setSeller] = useState("");
  const [deviceOwners] = useState(null);
  const [deviceOwner] = useState("");

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
        //setActiveDevice(data);
        setTitle(data.title);
        setDeviceType(data.device_type);
        setDescription(data.description);
        setAccessories(data.accessories);
        setUsernameBuyer(data.rz_username_buyer);
        setImageURL(data.image_url);
        setSerialNumber(data.serial_number);
      }
    };

    if (device_id) {
      getDevice();
    }
  }, [device_id, token, setErrorMessage /*new*/]);

  const updateDevice = async (e) => {
    e.preventDefault();
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        title: title,
        device_type: deviceType,
        description: description,
        accessories: accessories,
        serial_number: serialNumber,
        rz_username_buyer: usernameBuyer,
        image_url: imageURL,
        owner_rz_username: owner,
        room_code: roomCode,
        price: price,
        timestamp_warranty_end: timestampWarrantyEnd,
        timestamp_purchase: timestampPurchase,
        cost_centre: costCentre,
        seller: seller,
      }),
    };
    const response = await fetch(
      `http://localhost:8000/devices/${device_id}`,
      requestOptions
    );
    if (!response.ok) {
      setErrorMessage("Something went wrong updating the device information");
    } else {
      cleanForm();
      handleModal();
    }
  };

  const cleanForm = () => {
    setTitle("");
    setDeviceType("");
    setDescription("");
    setAccessories("");
    setSerialNumber("");
    setUsernameBuyer("");
    setImageURL("");
    setOwner("");
    setRoomCode("");
    setPrice("");
    setTimestampWarrantyEnd("");
    setTimestampPurchase("");
    setCostCentre("");
    setSeller("");
  };

  const createDevice = async (e) => {
    e.preventDefault();
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        title: title,
        device_type: deviceType,
        description: description,
        accessories: accessories,
        serial_number: serialNumber,
        rz_username_buyer: usernameBuyer,
        image_url: imageURL,
        owner_rz_username: owner,
        room_code: roomCode,
        price: price,
        timestamp_warranty_end: timestampWarrantyEnd,
        timestamp_purchase: timestampPurchase,
        cost_centre: costCentre,
        seller: seller,
      }),
    };
    const response = await fetch(
      "http://localhost:8000/devices",
      requestOptions
    );
    if (!response.ok) {
      setErrorMessage("Something went wrong creating Device");
    } else {
      setRoomCode("");
      handleModal();
    }
  };

  const extractRoomCodes = () => {
    let roomCodes = [];
    roomCodesData.forEach((item) => {
      roomCodes.push(item.room_code);
    });
    return roomCodes;
  };

  return (
    <div className={`modal ${active && "is-active"}`}>
      <div className="modal-background" onClick={handleModal}></div>
      <div className="modal-card">
        <header className="modal-card-head has-background-primary-light">
          <h1 className="modal-card-title">
            {fullView
              ? "Overview"
              : device_id
              ? "Update Device"
              : "Create Device"}
          </h1>
        </header>
        <section className="modal-card-body">
          {fullView ? (
            <Tabs
              device_id={device_id}
              token={token}
              isAdmin={isAdmin}
              setErrorMessage={setErrorMessage}
            ></Tabs>
          ) : ownerView ? (
            <div>
              <div>Device: {deviceOwner.title}</div>
              {deviceOwners.map((owner) => (
                <div key={owner.owner.transaction_id}>
                  <div>RZ User: {owner.rz_username}</div>
                  <div>
                    Owner Since:{" "}
                    {moment(owner.timestamp_owner_since).format("MMM Do YY")}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <form>
              <div className="field">
                <label className="label"></label>
                <div className="control">
                  <input
                    type="text"
                    placeholder="Enter Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input"
                    required
                  />
                </div>
              </div>
              <div className="field">
                <label className="label"></label>
                <div className="control">
                  <input
                    type="text"
                    placeholder="Enter device type"
                    value={deviceType}
                    onChange={(e) => setDeviceType(e.target.value)}
                    className="input"
                    required
                  />
                </div>
              </div>
              <div className="field">
                <label className="label"></label>
                <div className="control">
                  <input
                    type="text"
                    placeholder="Enter description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="input"
                    required
                  />
                </div>
              </div>
              <div className="field">
                <label className="label"></label>
                <div className="control">
                  <input
                    type="text"
                    placeholder="Enter accessories"
                    value={accessories}
                    onChange={(e) => setAccessories(e.target.value)}
                    className="input"
                    required
                  />
                </div>
              </div>
              <div className="field">
                <label className="label"></label>
                <div className="control">
                  <input
                    type="text"
                    placeholder="Enter serial number"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    className="input"
                    required
                  />
                </div>
              </div>
              <div className="field">
                <label className="label"></label>
                <div className="control">
                  <input
                    type="text"
                    placeholder="Enter rz username buyer"
                    value={usernameBuyer}
                    onChange={(e) => setUsernameBuyer(e.target.value)}
                    className="input"
                    required
                  />
                </div>
              </div>
              <div className="field">
                <label className="label"></label>
                <div className="control">
                  <input
                    type="text"
                    placeholder="Enter image URL"
                    value={imageURL}
                    onChange={(e) => setImageURL(e.target.value)}
                    className="input"
                    required
                  />
                </div>
              </div>
              <div className="field">
                <label className="label"></label>
                <div className="control">
                  <input
                    type="text"
                    placeholder="Enter owner"
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    className="input"
                    required
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Room Code</label>
                <div className="control">
                  <select
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                    className="select"
                    required
                  >
                    <option value="" disabled>
                      Select room code
                    </option>
                    {extractRoomCodes().map((code, index) => (
                      <option key={index} value={code}>
                        {code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="field">
                <label className="label"></label>
                <div className="control">
                  <input
                    type="text"
                    placeholder="Enter price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="input"
                    required
                  />
                </div>
              </div>
              <div className="field">
                <label className="label"></label>
                <div className="control">
                  <input
                    type="text"
                    placeholder="Enter timestamp warranty end"
                    value={timestampWarrantyEnd}
                    onChange={(e) => setTimestampWarrantyEnd(e.target.value)}
                    className="input"
                    required
                  />
                </div>
              </div>
              <div className="field">
                <label className="label"></label>
                <div className="control">
                  <input
                    type="text"
                    placeholder="Enter timestamp purchase"
                    value={timestampPurchase}
                    onChange={(e) => setTimestampPurchase(e.target.value)}
                    className="input"
                    required
                  />
                </div>
              </div>
              <div className="field">
                <label className="label"></label>
                <div className="control">
                  <input
                    type="text"
                    placeholder="Enter cost centre"
                    value={costCentre}
                    onChange={(e) => setCostCentre(e.target.value)}
                    className="input"
                    required
                  />
                </div>
              </div>
              <div className="field">
                <label className="label"></label>
                <div className="control">
                  <input
                    type="text"
                    placeholder="Enter seller"
                    value={seller}
                    onChange={(e) => setSeller(e.target.value)}
                    className="input"
                    required
                  />
                </div>
              </div>
            </form>
          )}
        </section>
        <footer className="modal-card-foot has-background-primary-light">
          {fullView ? (
            <>
              <button className="button" onClick={handleModal}>
                Close
              </button>
            </>
          ) : device_id ? (
            <>
              <button className="button is-info" onClick={updateDevice}>
                Update
              </button>
              <button className="button" onClick={handleModal}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <button className="button is-info" onClick={createDevice}>
                Create
              </button>
              <button className="button" onClick={handleModal}>
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
