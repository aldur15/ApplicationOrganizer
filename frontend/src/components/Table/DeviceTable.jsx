import React, { useEffect, useContext, useState } from "react";
import ErrorMessage from "../ErrorMessage";
import { UserContext } from "../../context/UserContext";
import DeviceModal from "../Modals/DeviceModal";
import "./DeviceTable.css";

const DeviceTable = () => {
  const [token] = useContext(UserContext);
  const [devices, setDevices] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [deviceId, setDeviceId] = useState(null);
  const [activeModal, setActiveModal] = useState(false);
  const [fullView, setFullView] = useState(false);
  const [, setOwnerDeviceView] = useState(false);
  const [isAdmin, setIsAdmin] = useState(null);
  const [isCreating, setIsCreating] = useState(false); // ✅ NEW

  const getUser = async () => {
    const response = await fetch(`http://localhost:8000/api/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    if (!response.ok) {
      setErrorMessage("Could not get the user");
    } else {
      const data = await response.json();
      setIsAdmin(data.is_admin);
    }
  };

  const getDevices = async () => {
    const response = await fetch("http://localhost:8000/devices/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    if (!response.ok) {
      setErrorMessage("Couldn't load the Devices");
    } else {
      const data = await response.json();
      setDevices(data);
      setLoaded(true);
    }
  };

  const deleteDevice = async (deviceId) => {
    const response = await fetch(`http://localhost:8000/devices/${deviceId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    if (!response.ok) {
      setErrorMessage("Failed to delete device");
    }

    getDevices();
  };

  const openFullView = (deviceId) => {
    setOwnerDeviceView(null);
    setFullView(true);
    setIsCreating(false); // ✅ Not creating
    setDeviceId(deviceId);
    setActiveModal(true);
  };

  const createDevice = () => {
    setOwnerDeviceView(null);
    setFullView(false); // ✅ Not full view
    setDeviceId(null); // ✅ No ID
    setIsCreating(true); // ✅ Create mode
    setActiveModal(true);
  };

  const updateDevice = (deviceId) => {
    setOwnerDeviceView(null);
    setFullView(false);
    setIsCreating(false);
    setDeviceId(deviceId);
    setActiveModal(true);
  };

  const handleModal = () => {
    setActiveModal(false);
    setDeviceId(null);
    setIsCreating(false);
    getDevices();
  };

  const onDeviceCreated = () => {
    handleModal(); // ✅ Close after creation
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    getDevices();
  }, []);

  return (
    <>
      <DeviceModal
        active={activeModal}
        handleModal={handleModal}
        token={token}
        device_id={deviceId}
        setErrorMessage={setErrorMessage}
        fullView={fullView}
        isAdmin={isAdmin}
        isCreating={isCreating} // ✅ Pass down
        onDeviceCreated={onDeviceCreated} // ✅ Pass down
      />

      <div className="device-container">
        {isAdmin && (
          <button className="create-button" onClick={createDevice}>
            Create Device
          </button>
        )}
        <ErrorMessage message={errorMessage} />
        {loaded && devices ? (
          <div className="device-grid">
            {devices.map((device) => (
              <div className="device-card" key={device.device_id}>
                <h3>{device.title}</h3>
                <p>Type: {device.device_type}</p>
                <p>ID: {device.device_id}</p>
                <div className="card-actions">
                  <button onClick={() => openFullView(device.device_id)}>
                    View
                  </button>
                  {isAdmin && (
                    <>
                      <button onClick={() => updateDevice(device.device_id)}>
                        Update
                      </button>
                      <button onClick={() => deleteDevice(device.device_id)}>
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
};

export default DeviceTable;
