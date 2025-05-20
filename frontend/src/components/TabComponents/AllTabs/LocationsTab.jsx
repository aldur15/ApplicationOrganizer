import React, { useState, useEffect } from "react";
import LocationsModal from "../../Modals/LocationsModal";

import moment from "moment";
const LocationsTab = ({ device_id, token, isAdmin, setErrorMessage }) => {
  const [device, setDevice] = useState("");
  const [locations, setLocationTransactions] = useState([]);
  const [activeModal, setActiveModal] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [locationID, setLocationID] = useState("");

  const updateLocation = async (location_transactions_id) => {
    setLocationID(location_transactions_id);
    setIsCreate(false);
    setActiveModal(true);
  };

  const deleteLocation = async (location_transaction_id) => {
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const response = await fetch(
      `http://localhost:8000/location_transactions/${location_transaction_id}`,
      requestOptions
    );
    if (!response.ok) {
      setErrorMessage("Couldn't delete the Location");
    } else {
      getDeviceLocation();
    }
  };

  const getDeviceLocation = async () => {
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
      setLocationTransactions(data);
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
      getDeviceLocation();
    }
  }, [device_id, token]);

  const handleModal = () => {
    setActiveModal(!activeModal);
    getDeviceLocation();
  };

  const createLocation = () => {
    setIsCreate(true);
    setActiveModal(true);
  };

  return (
    <>
      <LocationsModal
        active={activeModal}
        handleModal={handleModal}
        token={token}
        device_id={device_id}
        location_id={locationID}
        setErrorMessage={setErrorMessage}
        isCreate={isCreate}
      />

      <button
        className="button is-fullwidth mb-5 is-primary"
        onClick={() => createLocation()}
      >
        Create Location
      </button>
      <table className="table is-fullwidth">
        <thead>
          <tr>
            <th>Room Code</th>
            <th>Locatend Since</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((location) => (
            <tr key={location.location_id}>
              <td>{location.room_code}</td>
              <td>
                {moment(location.timestamp_located_since).format("MMM Do YY")}
              </td>
              <>
                {isAdmin ? (
                  <>
                    <td>
                      <button
                        className="button mr-1 is-info is-light"
                        onClick={() =>
                          updateLocation(location.location_transaction_id)
                        }
                      >
                        Update
                      </button>
                    </td>
                    <td>
                      <button
                        className="button mr-1 is-info is-light"
                        onClick={() =>
                          deleteLocation(location.location_transaction_id)
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </>
                ) : (
                  <></>
                )}
              </>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
export default LocationsTab;
