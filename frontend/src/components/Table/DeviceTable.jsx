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

  const getUser = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const response = await fetch(
      `http://localhost:8000/api/users/me`,
      requestOptions
    );

    if (!response.ok) {
      setErrorMessage("Could not get the user");
    } else {
      const data = await response.json();
      setIsAdmin(data.is_admin);
      console.log(isAdmin);
    }
  };

  const getDevices = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const response = await fetch(
      "http://localhost:8000/devices/all",
      requestOptions
    );
    if (!response.ok) {
      setErrorMessage("Couldn't load the Devices");
    } else {
      const data = await response.json();
      setDevices(data);
      setLoaded(true);
    }
  };

  const deleteDevice = async (deviceId) => {
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const response = await fetch(
      `http://localhost:8000/devices/${deviceId}`,
      requestOptions
    );
    if (!response.ok) {
      setErrorMessage("Failed to delete device");
    }

    getDevices();
  };

  const openFullView = async (deviceId) => {
    setOwnerDeviceView(null);
    setFullView(true);
    setDeviceId(deviceId);
    setActiveModal(true);
  };

  const createDevice = async (deviceId) => {
    setOwnerDeviceView(null);
    setFullView(null);
    setDeviceId(null);
    setActiveModal(true);
  };

  const updateDevice = async (deviceId) => {
    setOwnerDeviceView(null);
    setFullView(null);
    setDeviceId(deviceId);
    setActiveModal(true);
  };
  useEffect(
    () => {
      getUser();
    } /*[]*/
  );

  useEffect(() => {
    getDevices();
  });

  const handleModal = () => {
    setActiveModal(!activeModal);
    getDevices();
    setDeviceId(null);
  };

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
      />
      <div className="container">
        {isAdmin ? (
          <button
            className="button is-fullwidth mb-3 is-primary"
            onClick={() => createDevice()}
          >
            Create Device
          </button>
        ) : (
          <></>
        )}
        <ErrorMessage message={errorMessage} />
        {loaded && devices ? (
          <table className="table is-fullwidth">
            <thead>
              <tr>
                <th>Title</th>
                <th>Device Type</th>
                <th>Device ID</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device) => (
                <tr key={device.device_id}>
                  <td>{device.title}</td>
                  <td>{device.device_type}</td>
                  <td>{device.device_id}</td>
                  <td>
                    <button
                      className="button mr-2 is-info is-light"
                      onClick={() => openFullView(device.device_id)}
                    >
                      View
                    </button>
                    {isAdmin ? (
                      <>
                        <button
                          className="button mr-2 is-info is-light"
                          onClick={() => updateDevice(device.device_id)}
                        >
                          Update
                        </button>
                        <button
                          className="button mr-2 is-info is-light"
                          onClick={() => deleteDevice(device.device_id)}
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <></>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Loading</p>
        )}
      </div>
    </>
  );
};

export default DeviceTable;

//bulma deinstallierne und styling ändern
