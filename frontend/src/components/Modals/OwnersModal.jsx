import React, { useState, useEffect } from "react";
//need to make elements in table and modals when full scrollable

const OwnersModal = ({
  active,
  handleModal,
  token,
  device_id,
  owner_id,
  setErrorMessage,
  isCreate,
}) => {
  const [ownerName, setOwnerName] = useState("");
  const [deviceId, setDeviceID] = useState("");
  const [timestampOwnerSince, setTimestampOwnerSince] = useState("");

  useEffect(() => {
    const getOwner = async () => {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };
      const response = await fetch(
        `http://localhost:8000/owner_transactions/${owner_id}`,
        requestOptions
      );
      if (!response.ok) {
        setErrorMessage("Could not get Owner");
      } else {
        const data = await response.json();
        setOwnerName(data.rz_username);
        setDeviceID(data.device_id);
        setTimestampOwnerSince(data.timestamp_owner_since);
        //handleModal();
      }
    };
    if (owner_id) {
      getOwner();
    }
  }, [owner_id, token]);

  const createOwner = async (e) => {
    e.preventDefault();
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ rz_username: ownerName, device_id: device_id }),
    };
    const response = await fetch(
      "http://localhost:8000/owner_transactions",
      requestOptions
    );
    if (!response.ok) {
      setErrorMessage("Somethin went wrong creating a new Owner");
    } else {
      setOwnerName("");
      handleModal();
    }
  };

  const updateOwner = async (e) => {
    e.preventDefault();
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        rz_username: ownerName,
        device_id: device_id,
        timestamp_owner_since: timestampOwnerSince,
      }),
    };
    const response = await fetch(
      `http://localhost:8000/owner_transactions/${owner_id}`,
      requestOptions
    );
    if (!response.ok) {
      setErrorMessage("Could not update Owner");
    } else {
      setOwnerName("");
      setTimestampOwnerSince("");
      handleModal();
    }
  };

  return (
    <div className={`modal ${active && "is-active"}`}>
      <div className="modal-background" onClick={handleModal}></div>
      <div className="modal-card">
        <header className="modal-card-head has-background-primary-light">
          <h1 className="modal-card-title">
            {isCreate ? "Create Owner" : "Update Owner"}
          </h1>
        </header>
        <section className="modal-card-body">
          {isCreate ? (
            <form>
              <div className="field">
                <label className="label">Owner</label>
                <div className="control">
                  <input
                    type="text"
                    placeholder="Enter Owner"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="input"
                    required
                  />
                </div>
              </div>
            </form>
          ) : (
            <form>
              <div className="field">
                <label className="label">Owner</label>
                <div className="control">
                  <input
                    type="text"
                    placeholder="Enter Owner"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="input"
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Owner Since</label>
                <div className="control">
                  <input
                    type="text"
                    placeholder="Enter Date"
                    value={timestampOwnerSince}
                    onChange={(e) => setTimestampOwnerSince(e.target.value)}
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
            <button className="button is-primary" onClick={createOwner}>
              Create
            </button>
          ) : (
            <button className="button is-info" onClick={updateOwner}>
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

export default OwnersModal;
