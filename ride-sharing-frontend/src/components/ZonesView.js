import React, { useState, useEffect } from "react";

const ZonesView = () => {
  const [zones, setZones] = useState([]);  // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await fetch("/api/zones"); // Adjust the API endpoint if necessary
        if (!response.ok) {
          throw new Error("Failed to fetch zones data");
        }
        const data = await response.json();
        setZones(data);  // Update the state with fetched zones
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchZones();
  }, []);

  // Show loading state
  if (loading) {
    return <div>Loading zones...</div>;
  }

  // Show error message if there's an error
  if (error) {
    return <div>Error: {error}</div>;
  }

  // If zones is undefined or empty, show a fallback message
  if (!zones || zones.length === 0) {
    return <div>No zones available</div>;
  }

  return (
    <div>
      <h2>Zones</h2>
      {zones.map((zone) => (
        <div
          key={zone.id}
          style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}
        >
          <p><strong>Zone Name:</strong> {zone.name}</p>
          <p><strong>Description:</strong> {zone.description}</p>
          <p><strong>Location:</strong> {zone.location}</p>
        </div>
      ))}
    </div>
  );
};

export default ZonesView;
