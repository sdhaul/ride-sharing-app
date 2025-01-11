import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Drivers = () => {
  const [drivers, setDrivers] = useState([]); // Initialize as an empty array
  const [error, setError] = useState(null);

  // Fetch drivers from the backend
  useEffect(() => {
    axios.get('http://127.0.0.1:5000/drivers')
      .then(response => {
        const rawData = response.data || []; // Fallback to an empty array
        console.log('Fetched drivers:', rawData); // Debugging log

        // Transform array of arrays into array of objects
        const formattedData = rawData.map(driver => ({
          id: driver[0],       // Unique ID
          name: driver[1],     // Driver's name
          location: driver[2], // Location (e.g., POINT string)
          available: driver[3],// Availability status
          rating: driver[4],   // Driver's rating
        }));

        setDrivers(formattedData);
      })
      .catch(err => {
        console.error('Error fetching drivers:', err);
        setError('Error fetching drivers');
      });
  }, []);

  return (
    <div>
      <h1>Drivers</h1>
      {error && <p>{error}</p>}
      <ul>
        {/* Render driver list */}
        {drivers.length > 0 ? (
          drivers.map(driver => (
            <li key={driver.id}>
              <strong>{driver.name}</strong> - Rating: {driver.rating} - 
              Available: {driver.available ? 'Yes' : 'No'}
            </li>
          ))
        ) : (
          <p>No drivers available.</p>
        )}
      </ul>
    </div>
  );
};

export default Drivers;
