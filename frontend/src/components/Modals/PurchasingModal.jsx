import React, { useState, useEffect } from "react";

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

  useEffect(() => {
    if (!purchasing_information_id) return;

    const getPurchase = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/purchasing_information/${purchasing_information_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Could not get Purchase");

        const data = await response.json();
        setPrice(data.price || "");
        setWarrantyEnd(data.timestamp_warranty_end || "");
        setPurchaseDate(data.timestamp_purchase || "");
        setCostCentre(data.cost_centre || "");
        setSeller(data.seller || "");
      } catch (err) {
        setErrorMessage(err.message);
      }
    };

    getPurchase();
  }, [purchasing_information_id, token, setErrorMessage]);

  const cleanForm = () => {
    setPrice("");
    setWarrantyEnd("");
    setPurchaseDate("");
    setCostCentre("");
    setSeller("");
  };

  const submitPurchase = async (e) => {
    e.preventDefault();

    const url = isCreate
      ? "http://localhost:8000/purchasing_information"
      : `http://localhost:8000/purchasing_information/${purchasing_information_id}`;

    const method = isCreate ? "POST" : "PUT";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          price,
          timestamp_warranty_end: warrantyEnd,
          timestamp_purchase: purchaseDate,
          cost_centre: costCentre,
          seller,
          device_id,
        }),
      });

      if (!response.ok)
        throw new Error(
          isCreate
            ? "Something went wrong creating a new Purchase"
            : "Could not update Purchase"
        );

      cleanForm();
      handleModal();
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${
        active ? "block" : "hidden"
      }`}
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[80vh] overflow-auto">
        <header className="bg-green-100 p-4 rounded-t-lg">
          <h1 className="text-xl font-semibold">
            {isCreate ? "Create Purchase" : "Update Purchase"}
          </h1>
        </header>

        <section className="p-4">
          <form onSubmit={submitPurchase} className="space-y-4">
            <div className="flex flex-col">
              <label htmlFor="price" className="mb-1 font-medium">
                Price
              </label>
              <input
                type="text"
                id="price"
                placeholder="Enter Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="border rounded px-3 py-2"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="warrantyEnd" className="mb-1 font-medium">
                Warranty End
              </label>
              <input
                type="text"
                id="warrantyEnd"
                placeholder="Enter Warranty End"
                value={warrantyEnd}
                onChange={(e) => setWarrantyEnd(e.target.value)}
                required
                className="border rounded px-3 py-2"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="purchaseDate" className="mb-1 font-medium">
                Purchase Date
              </label>
              <input
                type="text"
                id="purchaseDate"
                placeholder="Enter Date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                required
                className="border rounded px-3 py-2"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="costCentre" className="mb-1 font-medium">
                Cost Centre
              </label>
              <input
                type="text"
                id="costCentre"
                placeholder="Enter Cost Centre"
                value={costCentre}
                onChange={(e) => setCostCentre(e.target.value)}
                required
                className="border rounded px-3 py-2"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="seller" className="mb-1 font-medium">
                Seller
              </label>
              <input
                type="text"
                id="seller"
                placeholder="Enter Seller"
                value={seller}
                onChange={(e) => setSeller(e.target.value)}
                required
                className="border rounded px-3 py-2"
              />
            </div>
          </form>
        </section>

        <footer className="bg-green-100 p-4 rounded-b-lg flex justify-end space-x-3">
          <button
            onClick={submitPurchase}
            className={`px-4 py-2 rounded text-white ${
              isCreate ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isCreate ? "Create" : "Update"}
          </button>
          <button
            onClick={handleModal}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
        </footer>
      </div>
    </div>
  );
};

export default PurchasingModal;
