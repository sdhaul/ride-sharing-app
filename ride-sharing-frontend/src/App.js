import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Drivers = () => {
  const [drivers, setDrivers] = useState([]); // All drivers
  const [driver, setDriver] = useState(null); // Single driver details
  const [error, setError] = useState(null);
  const [newDriver, setNewDriver] = useState({
    id: null,
    name: '',
    location: '',
    available: true,
    rating: 0,
  }); // Form for adding/updating drivers

  // Fetch all drivers
  const fetchAllDrivers = () => {
    axios
      .get('http://127.0.0.1:5000/drivers')
      .then((response) => {
        const rawData = response.data || [];
        const formattedData = rawData.map((driver) => ({
          id: driver[0],
          name: driver[1],
          location: driver[2],
          available: driver[3],
          rating: driver[4],
        }));
        setDrivers(formattedData);
        setError(null);
      })
      .catch((err) => setError('Error fetching drivers'));
  };

  // Fetch a single driver
  const fetchDriverById = (id) => {
    axios
      .get(`http://127.0.0.1:5000/drivers/${id}`)
      .then((response) => setDriver(response.data))
      .catch((err) => setError(`Error fetching driver with ID ${id}`));
  };

  // Add a new driver
  const addDriver = () => {
    axios
      .post('http://127.0.0.1:5000/drivers', {
        name: newDriver.name,
        location: newDriver.location,
        available: newDriver.available,
        rating: newDriver.rating,
      })
      .then(() => {
        fetchAllDrivers();
        setNewDriver({ id: null, name: '', location: '', available: true, rating: 0 });
      })
      .catch((err) => setError('Error adding driver'));
  };

  // Load driver data for editing
  const editDriver = (driver) => {
    setNewDriver({ ...driver });
  };

  // Update an existing driver
  const updateDriver = () => {
    axios
      .put(`http://127.0.0.1:5000/drivers/${newDriver.id}`, {
        name: newDriver.name,
        location: newDriver.location,
        available: newDriver.available,
        rating: newDriver.rating,
      })
      .then(() => {
        fetchAllDrivers();
        setNewDriver({ id: null, name: '', location: '', available: true, rating: 0 });
      })
      .catch((err) => setError(`Error updating driver with ID ${newDriver.id}`));
  };

  // Delete a driver
  const deleteDriver = (id) => {
    axios
      .delete(`http://127.0.0.1:5000/drivers/${id}`)
      .then(() => fetchAllDrivers())
      .catch((err) => setError(`Error deleting driver with ID ${id}`));
  };

  // Fetch all drivers on component mount
  useEffect(() => {
    fetchAllDrivers();
  }, []);

  return (
    <div>
      <h1>Drivers</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display all drivers */}
      <ul>
        {drivers.length > 0 ? (
          drivers.map((driver) => (
            <li key={driver.id}>
              <strong>{driver.name}</strong> - Rating: {driver.rating} - 
              Available: {driver.available ? 'Yes' : 'No'}
              <button onClick={() => fetchDriverById(driver.id)}>View</button>
              <button onClick={() => editDriver(driver)}>Edit</button>
              <button onClick={() => deleteDriver(driver.id)}>Delete</button>
            </li>
          ))
        ) : (
          <p>No drivers available.</p>
        )}
      </ul>

      {/* Display single driver details */}
      {driver && (
        <div>
          <h2>Driver Details</h2>
          <p>ID: {driver.id}</p>
          <p>Name: {driver.name}</p>
          <p>Location: {driver.location}</p>
          <p>Available: {driver.available ? 'Yes' : 'No'}</p>
          <p>Rating: {driver.rating}</p>
        </div>
      )}

      {/* Form for adding/updating drivers */}
      <div>
        <h2>{newDriver.id ? 'Update Driver' : 'Add Driver'}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            newDriver.id ? updateDriver() : addDriver();
          }}
        >
          <input
            type="text"
            placeholder="Name"
            value={newDriver.name}
            onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={newDriver.location}
            onChange={(e) => setNewDriver({ ...newDriver, location: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Rating"
            value={newDriver.rating}
            onChange={(e) => setNewDriver({ ...newDriver, rating: parseFloat(e.target.value) })}
            required
            step="0.1"
            min="0"
            max="5"
          />
          <label>
            Available:
            <input
              type="checkbox"
              checked={newDriver.available}
              onChange={(e) => setNewDriver({ ...newDriver, available: e.target.checked })}
            />
          </label>
          <button type="submit">{newDriver.id ? 'Update' : 'Add'}</button>
        </form>
      </div>
    </div>
  );
};

export default Drivers;
