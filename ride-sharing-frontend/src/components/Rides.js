import React, { useState, useEffect } from "react";
import { Container, TextField, Button, Paper, Typography, Snackbar, Alert } from "@mui/material";
import axios from "axios";
import RidesView from "./RidesView"; // Import the RidesView component

const Rides = () => {
  const [rides, setRides] = useState([]);
  const [newRide, setNewRide] = useState({
    driver_id: "",
    rider_id: "",
    status: "requested",
    fare: "",
    pickup: "",
    destination: "",
  });
  const [loading, setLoading] = useState(true);  // State to manage loading
  const [error, setError] = useState("");  // State to manage error messages
  const [successMessage, setSuccessMessage] = useState("");  // For success message

  // Fetch the list of rides from the backend when the component mounts
  useEffect(() => {
    axios.get("http://127.0.0.1:5000/rides") // Adjust endpoint as necessary
      .then((response) => {
        setRides(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching rides:", error);
        setError("Error fetching rides. Please try again.");
        setLoading(false);
      });
  }, []);

  // Handle adding a new ride via a form submission
  const handleAddRide = (e) => {
    e.preventDefault();

    axios.post("http://127.0.0.1:5000/rides", newRide) // Adjust endpoint as necessary
      .then((response) => {
        setRides([...rides, response.data]);  // Add the new ride to the list
        setNewRide({ driver_id: "", rider_id: "", status: "requested", fare: "", pickup: "", destination: "" });  // Reset form
        setSuccessMessage("Ride added successfully!");
      })
      .catch((error) => {
        console.error("Error adding ride:", error);
        setError("Error adding ride. Please try again.");
      });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Manage Rides</Typography>

      {/* Success message snackbar */}
      {successMessage && (
        <Snackbar open autoHideDuration={6000} onClose={() => setSuccessMessage("")}>
          <Alert onClose={() => setSuccessMessage("")} severity="success">
            {successMessage}
          </Alert>
        </Snackbar>
      )}

      {/* Error message snackbar */}
      {error && (
        <Snackbar open autoHideDuration={6000} onClose={() => setError("")}>
          <Alert onClose={() => setError("")} severity="error">
            {error}
          </Alert>
        </Snackbar>
      )}

      {/* Add Ride Form */}
      <Paper sx={{ padding: 2, marginBottom: 3 }}>
        <form onSubmit={handleAddRide}>
          <TextField
            label="Driver ID"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newRide.driver_id}
            onChange={(e) => setNewRide({ ...newRide, driver_id: e.target.value })}
            required
          />
          <TextField
            label="Rider ID"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newRide.rider_id}
            onChange={(e) => setNewRide({ ...newRide, rider_id: e.target.value })}
            required
          />
          <TextField
            label="Status"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newRide.status}
            onChange={(e) => setNewRide({ ...newRide, status: e.target.value })}
          />
          <TextField
            label="Fare"
            type="number"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newRide.fare}
            onChange={(e) => setNewRide({ ...newRide, fare: parseFloat(e.target.value) })}
          />
          <TextField
            label="Pickup Location"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newRide.pickup}
            onChange={(e) => setNewRide({ ...newRide, pickup: e.target.value })}
            required
          />
          <TextField
            label="Destination"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newRide.destination}
            onChange={(e) => setNewRide({ ...newRide, destination: e.target.value })}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Add Ride
          </Button>
        </form>
      </Paper>

      {/* Displaying the list of rides */}
      {loading ? (
        <Typography>Loading rides...</Typography>
      ) : (
        <RidesView rides={rides} />  // Pass the rides list to the RidesView component
      )}
    </Container>
  );
};

export default Rides;
