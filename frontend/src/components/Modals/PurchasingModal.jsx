import React, { useState, useEffect } from "react";
//need to make elements in table and modals when full scrollable

const PurchasingModal = ({
  active,
  handleModal,
  token,
  device_id,
  purchasing_information_id,
  setErrorMessage,
  isCreate,
}) => {
  const [price, setPrice] = useState("");
  const [warrantyEnd, setWarrantyEnd] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [costCentre, setCostCentre] = useState("");
  const [seller, setSeller] = useState("");
  const [deviceId, setDeviceID] = useState("");

  useEffect(() => {
    const getPurchase = async () => {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };
      const response = await fetch(
        `http://localhost:8000/purchasing_information/${purchasing_information_id}`,
        requestOptions
      );
      if (!response.ok) {
        setErrorMessage("Could not get Purchase");
      } else {
        const data = await response.json();
        setPrice(data.price);
        setWarrantyEnd(data.timestamp_warranty_end);
        setPurchaseDate(data.timestamp_purchase);
        setCostCentre(data.cost_centre);
        setSeller(data.seller);
        setDeviceID(data.device_id);

        //handleModal();
      }
    };
    if (purchasing_information_id) {
      getPurchase();
    }
  }, [purchasing_information_id, token]);

  const cleanForm = () => {
    setPrice("");
    setWarrantyEnd("");
    setPurchaseDate("");
    setCostCentre("");
    setSeller("");
  };

  const createPurchase = async (e) => {
    e.preventDefault();
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        price: price,
        timestamp_warranty_end: warrantyEnd,
        timestamp_purchase: purchaseDate,
        cost_centre: costCentre,
        seller: seller,
        device_id: device_id,
      }),
    };
    const response = await fetch(
      "http://localhost:8000/purchasing_information",
      requestOptions
    );
    if (!response.ok) {
      setErrorMessage("Somethin went wrong creating a new Purchase");
    } else {
      cleanForm();
      handleModal();
    }
  };

  const updatePurchase = async (e) => {
    e.preventDefault();
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        price: price,
        timestamp_warranty_end: warrantyEnd,
        timestamp_purchase: purchaseDate,
        cost_centre: costCentre,
        seller: seller,
        device_id: device_id,
      }),
    };
    const response = await fetch(
      `http://localhost:8000/purchasing_information/${purchasing_information_id}`,
      requestOptions
    );
    if (!response.ok) {
      setErrorMessage("Could not update Purchase");
    } else {
      cleanForm();
      handleModal();
    }
  };

  return (
    <div className={`modal ${active && "is-active"}`}>
      <div className="modal-background" onClick={handleModal}></div>
      <div className="modal-card">
        <header className="modal-card-head has-background-primary-light">
          <h1 className="modal-card-title">
            {isCreate ? "Create Purchase" : "Update Purchase"}
          </h1>
        </header>
        <section className="modal-card-body">
          <form>
            <div className="field">
              <label className="label">Price</label>
              <div className="control">
                <input
                  type="text"
                  placeholder="Enter Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="input"
                  required
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Warranty End</label>
              <div className="control">
                <input
                  type="text"
                  placeholder="Enter Warranty End"
                  value={warrantyEnd}
                  onChange={(e) => setWarrantyEnd(e.target.value)}
                  className="input"
                  required
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Purchase Date</label>
              <div className="control">
                <input
                  type="text"
                  placeholder="Enter Date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="input"
                  required
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Cost Centre</label>
              <div className="control">
                <input
                  type="text"
                  placeholder="Enter Cost Centre"
                  value={costCentre}
                  onChange={(e) => setCostCentre(e.target.value)}
                  className="input"
                  required
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Seller</label>
              <div className="control">
                <input
                  type="text"
                  placeholder="Enter Seller"
                  value={seller}
                  onChange={(e) => setSeller(e.target.value)}
                  className="input"
                  required
                />
              </div>
            </div>
          </form>
        </section>
        <footer className="modal-card-foot has-background-primary-lght">
          {isCreate ? (
            <button className="button is-primary" onClick={createPurchase}>
              Create
            </button>
          ) : (
            <button className="button is-info" onClick={updatePurchase}>
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

export default PurchasingModal;
