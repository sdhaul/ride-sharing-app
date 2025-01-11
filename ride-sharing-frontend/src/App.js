import React, { useEffect } from 'react';
import axios from 'axios';

const Drivers = () => {
  // Fetch drivers from the backend
  useEffect(() => {
    axios.get('http://127.0.0.1:5000/drivers')
      .then(response => {
        console.log('Fetched drivers:', response.data); // Log fetched data
      })
      .catch(err => {
        console.error('Error fetching drivers:', err); // Log error if any
      });
  }, []);

  return (
    <div>
      <h1>Drivers</h1>
      <p>Check the browser console for fetched driver data.</p>
    </div>
  );
};

export default Drivers;
