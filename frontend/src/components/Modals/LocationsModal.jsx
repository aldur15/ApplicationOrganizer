import React, { useEffect, useState } from "react";

const LocationsModal = ({ active, handleModal, token, location_id, setErrorMessage }) => {
  const [locationName, setLocationName] = useState("");

  useEffect(() => {
    if (!location_id) return;

    const fetchLocation = async () => {
      try {
        const res = await fetch(`http://localhost:8000/locations/${location_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Could not get the location");

        const data = await res.json();
        setLocationName(data.name || "");
      } catch (err) {
        setErrorMessage(err.message);
      }
    };

    fetchLocation();
  }, [location_id, token, setErrorMessage]);

  const handleChange = (e) => setLocationName(e.target.value);

  const cleanForm = () => setLocationName("");

  const submitLocation = async (e, method) => {
    e.preventDefault();

    const url = location_id
      ? `http://localhost:8000/locations/${location_id}`
      : "http://localhost:8000/locations";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: locationName }),
      });

      if (!res.ok) throw new Error("Something went wrong");

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
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[80vh] overflow-auto">
        <header className="bg-green-100 p-4 rounded-t-lg">
          <h1 className="text-xl font-semibold">
            {location_id ? "Update Location" : "Create Location"}
          </h1>
        </header>
        <section className="p-4">
          <form onSubmit={(e) => submitLocation(e, location_id ? "PUT" : "POST")} className="space-y-4">
            <div className="flex flex-col">
              <label htmlFor="locationName" className="mb-1 font-medium">
                Location Name
              </label>
              <input
                type="text"
                id="locationName"
                name="locationName"
                value={locationName}
                onChange={handleChange}
                placeholder="Enter location name"
                required
                className="border rounded px-3 py-2"
              />
            </div>
          </form>
        </section>
        <footer className="bg-green-100 p-4 rounded-b-lg flex justify-end space-x-3">
          {location_id ? (
            <>
              <button
                onClick={(e) => submitLocation(e, "PUT")}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Update
              </button>
              <button
                onClick={handleModal}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={(e) => submitLocation(e, "POST")}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Create
              </button>
              <button
                onClick={handleModal}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </>
          )}
        </footer>
      </div>
    </div>
  );
};

export default LocationsModal;
