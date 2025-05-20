import React, { useState, useEffect } from "react";

import moment from "moment";
import PurchasingModal from "../../Modals/PurchasingModal";

const PurchasingTab = ({ device_id, token, isAdmin, setErrorMessage }) => {
  const [device, setDevice] = useState("");
  const [devicePurchases, setDevicePurchases] = useState([]);
  const [activeModal, setActiveModal] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [purchaseID, setPurchaseID] = useState("");

  const updatePurchase = async (purchase_information_id) => {
    setPurchaseID(purchase_information_id);
    setIsCreate(false);
    setActiveModal(true);
  };

  const deletePurchase = async (purchase_information_id) => {
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const response = await fetch(
      `http://localhost:8000/purchasing_information/${purchase_information_id}`,
      requestOptions
    );
    if (!response.ok) {
      setErrorMessage("Couldn't delete the Purchase");
    } else {
      getDevicePurchasings();
    }
  };

  const getDevicePurchasings = async () => {
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
      setErrorMessage("Couldn't load the Device Purchases");
    } else {
      const data = await response.json();
      setDevicePurchases(data);
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
      getDevicePurchasings();
    }
  }, [device_id, token]);

  const handleModal = () => {
    setActiveModal(!activeModal);
    getDevicePurchasings();
  };

  const createPurchasings = () => {
    setIsCreate(true);
    setActiveModal(true);
  };

  return (
    <>
      <PurchasingModal
        active={activeModal}
        handleModal={handleModal}
        token={token}
        device_id={device_id}
        purchasing_information_id={purchaseID}
        setErrorMessage={setErrorMessage}
        isCreate={isCreate}
      />
      <button
        className="button is-fullwidth mb-5 is-primary"
        onClick={() => createPurchasings()}
      >
        Create Purchase
      </button>
      <table className="table is-fullwidth">
        <thead>
          <tr>
            <th>Purchase</th>
            <th>Warranty End</th>
            <th>Purchase Date</th>
            <th>Cost Centre</th>
            <th>Seller</th>
          </tr>
        </thead>
        <tbody>
          {devicePurchases.map((purchase) => (
            <tr key={purchase.purchasing_information_id}>
              <td>{purchase.price}</td>
              <td>
                {moment(purchase.timestamp_warranty_end).format("MMM Do YY")}
              </td>
              <td>{moment(purchase.timestamp_purchase).format("MMM Do YY")}</td>
              <td>{purchase.cost_centre}</td>
              <td>{purchase.seller}</td>
              <>
                {isAdmin ? (
                  <>
                    <td>
                      <button
                        className="button mr-1 is-info is-light"
                        onClick={() =>
                          updatePurchase(purchase.purchasing_information_id)
                        }
                      >
                        Update
                      </button>
                    </td>
                    <td>
                      <button
                        className="button mr-1 is-info is-light"
                        onClick={() =>
                          deletePurchase(purchase.purchasing_information_id)
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
export default PurchasingTab;
