import React, { useState, useEffect } from "react";

import moment from "moment";
import OwnersModal from "../../Modals/OwnersModal";
const OwnersTab = ({ device_id, token, isAdmin, setErrorMessage }) => {
  const [device, setDevice] = useState("");
  const [owners, setDeviceOwners] = useState([]);
  const [activeModal, setActiveModal] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [ownerID, setOwnerID] = useState("");

  const updateOwner = async (owner_transactions_id) => {
    setOwnerID(owner_transactions_id);
    setIsCreate(false);
    setActiveModal(true);
  };

  const deleteOwner = async (owner_transactions_id) => {
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const response = await fetch(
      `http://localhost:8000/owner_transactions/${owner_transactions_id}`,
      requestOptions
    );
    if (!response.ok) {
      setErrorMessage("Couldn't delete the Owner");
    } else {
      getDeviceOwners();
    }
  };

  const getDeviceOwners = async () => {
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
      setDeviceOwners(data);
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
      getDeviceOwners();
    }
  }, [device_id, token]);

  const handleModal = () => {
    setActiveModal(!activeModal);
    getDeviceOwners();
  };

  const createOwner = () => {
    setIsCreate(true);
    setActiveModal(true);
  };

  return (
    <>
      <OwnersModal
        active={activeModal}
        handleModal={handleModal}
        token={token}
        device_id={device_id}
        owner_id={ownerID}
        setErrorMessage={setErrorMessage}
        isCreate={isCreate}
      />
      <button
        className="button is-fullwidth mb-5 is-primary"
        onClick={() => createOwner()}
      >
        Create Owner
      </button>
      <table className="table is-fullwidth">
        <thead>
          <tr>
            <th>Owner</th>
            <th>Since</th>
          </tr>
        </thead>
        <tbody>
          {owners.map((owner) => (
            <tr key={owner.owner_transaction_id}>
              <td>{owner.rz_username}</td>
              <td>{moment(owner.timestamp_owner_since).format("MMM Do YY")}</td>
              <>
                {isAdmin ? (
                  <>
                    <td>
                      <button
                        className="button mr-1 is-info is-light"
                        onClick={() => updateOwner(owner.owner_transaction_id)}
                      >
                        Update
                      </button>
                    </td>
                    <td>
                      <button
                        className="button mr-1 is-info is-light"
                        onClick={() => deleteOwner(owner.owner_transaction_id)}
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
export default OwnersTab;
