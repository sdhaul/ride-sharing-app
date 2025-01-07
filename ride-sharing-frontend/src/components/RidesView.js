import React from "react";
import { Typography } from "@mui/material";  // Add this import for Typography

const RidesView = ({ rides = [] }) => {
  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Existing Rides
      </Typography>
      {rides.length === 0 ? (
        <Typography>No rides available.</Typography>
      ) : (
        <ul>
          {rides.map((ride) => (
            <li key={ride.ride_id}>
              <p>Rider ID: {ride.rider_id}</p>
              <p>Driver ID: {ride.driver_id}</p>
              <p>Pickup: {ride.pickup}</p>
              <p>Destination: {ride.destination}</p>
              <p>Status: {ride.status}</p>
              <p>Fare: ${ride.fare}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RidesView;
