import React, { useState, useEffect } from "react";
import roomCodesData from "./data/hoersaal_raumcode.json";
import "./Modal.css";
//need to make elements in table and modals when full scrollable

const LocationsModal = ({
  active,
  handleModal,
  token,
  device_id,
  location_id,
  setErrorMessage,
  isCreate,
}) => {
  const [roomCode, setRoomCode] = useState("");
  const [, setDeviceID] = useState("");
  const [timestampLocatedSince, setTimestampLocatedSince] = useState("");

  useEffect(() => {
    const getLocation = async () => {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };
      const response = await fetch(
        `http://localhost:8000/location_transactions/${location_id}`,
        requestOptions
      );
      if (!response.ok) {
        setErrorMessage("Could not get Location");
      } else {
        const data = await response.json();
        setRoomCode(data.room_code);
        setDeviceID(data.device_id);
        setTimestampLocatedSince(data.timestamp_located_since);
        //handleModal();
      }
    };
    if (location_id) {
      getLocation();
    }
  }, [location_id, token, setErrorMessage/*new*/]);

  const createLocation = async (e) => {
    e.preventDefault();
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ room_code: roomCode, device_id: device_id }),
    };
    const response = await fetch(
      "http://localhost:8000/location_transactions",
      requestOptions
    );
    if (!response.ok) {
      setErrorMessage("Somethin went wrong creating a new Location");
    } else {
      setRoomCode("");
      handleModal();
    }
  };

  const updateLocation = async (e) => {
    e.preventDefault();
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        room_code: roomCode,
        device_id: device_id,
        timestamp_located_since: timestampLocatedSince,
      }),
    };
    const response = await fetch(
      `http://localhost:8000/location_transactions/${location_id}`,
      requestOptions
    );
    if (!response.ok) {
      setErrorMessage("Could not update Owner");
    } else {
      setRoomCode("");
      setDeviceID("");
      setTimestampLocatedSince("");
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
            {isCreate ? "Create Room" : "Update Room"}
          </h1>
        </header>
        <section className="modal-card-body">
          {isCreate ? (
            <form>
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
            </form>
          ) : (
            <form>
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
                <label className="label">Located Since</label>
                <div className="control">
                  <input
                    type="text"
                    placeholder="Enter Date"
                    value={timestampLocatedSince}
                    onChange={(e) => setTimestampLocatedSince(e.target.value)}
                    className="input"
                    required
                  />
                </div>
              </div>
            </form>
          )}
        </section>
        <footer className="modal-card-foot has-background-primary-lght">
          {isCreate ? (
            <button className="button is-primary" onClick={createLocation}>
              Create
            </button>
          ) : (
            <button className="button is-info" onClick={updateLocation}>
              Update
            </button>
          )}
          <button className="button" onClick={handleModal}>
            Cancel
          </button>
        </footer>
      </div>
    </div>
  );
};

export default LocationsModal;
