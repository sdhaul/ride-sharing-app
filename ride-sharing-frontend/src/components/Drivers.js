import React, { useState, useEffect } from "react";
import axios from "axios";

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [newDriver, setNewDriver] = useState({
    name: "",
    latitude: "",
    longitude: "",
    availability: true,
    rating: 5.0,
  });

  // Fetch all drivers on component mount
  useEffect(() => {
    axios.get("http://127.0.0.1:5000/drivers")
      .then((response) => {
        setDrivers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching drivers:", error);
      });
  }, []);

  // Handle form submission to add a new driver
  const handleAddDriver = (e) => {
    e.preventDefault();
    axios.post("http://127.0.0.1:5000/drivers", newDriver)
      .then((response) => {
        alert("Driver added successfully!");
        setDrivers([...drivers, response.data]);
      })
      .catch((error) => {
        console.error("Error adding driver:", error);
      });
  };

  return (
    <div>
      <h1>Drivers</h1>
      <form onSubmit={handleAddDriver}>
        <input
          type="text"
          placeholder="Name"
          value={newDriver.name}
          onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Latitude"
          value={newDriver.latitude}
          onChange={(e) =>
            setNewDriver({ ...newDriver, latitude: parseFloat(e.target.value) })
          }
          required
        />
        <input
          type="number"
          placeholder="Longitude"
          value={newDriver.longitude}
          onChange={(e) =>
            setNewDriver({ ...newDriver, longitude: parseFloat(e.target.value) })
          }
          required
        />
        <button type="submit">Add Driver</button>
      </form>

      <ul>
        {drivers.map((driver) => (
          <li key={driver.driver_id}>
            {driver.name} - {driver.rating} stars - {driver.availability ? "Available" : "Unavailable"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Drivers;
