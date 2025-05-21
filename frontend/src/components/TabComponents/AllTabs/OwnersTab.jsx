import React, { useState, useEffect } from "react";
import moment from "moment";
import OwnersModal from "../../Modals/OwnersModal";
import "./../Tabs.css";

const OwnersTab = ({ device_id, token, isAdmin, setErrorMessage }) => {
  const [device, setDevice] = useState("");
  const [owners, setDeviceOwners] = useState([]);
  const [activeModal, setActiveModal] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [ownerID, setOwnerID] = useState("");

  const updateOwner = async (owner_transaction_id) => {
    setOwnerID(owner_transaction_id);
    setIsCreate(false);
    setActiveModal(true);
  };

  const deleteOwner = async (owner_transaction_id) => {
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const response = await fetch(
      `http://localhost:8000/owner_transactions/${owner_transaction_id}`,
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
    <div className="p-4">
      <OwnersModal
        active={activeModal}
        handleModal={handleModal}
        token={token}
        device_id={device_id}
        owner_id={ownerID}
        setErrorMessage={setErrorMessage}
        isCreate={isCreate}
      />

      <div className="flex justify-end mb-4">
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition"
          onClick={createOwner}
        >
          Create Owner
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-600 border">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b">
            <tr>
              <th scope="col" className="px-4 py-3">Owner</th>
              <th scope="col" className="px-4 py-3">Since</th>
              {isAdmin && <th scope="col" className="px-4 py-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {owners.map((owner) => (
              <tr
                key={owner.owner_transaction_id}
                className="border-b hover:bg-gray-50"
              >
                <td className="px-4 py-2">{owner.rz_username}</td>
                <td className="px-4 py-2">
                  {moment(owner.timestamp_owner_since).format("MMM Do YY")}
                </td>
                {isAdmin && (
                  <td className="px-4 py-2 text-right space-x-2">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                      onClick={() => updateOwner(owner.owner_transaction_id)}
                    >
                      Update
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      onClick={() => deleteOwner(owner.owner_transaction_id)}
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OwnersTab;
