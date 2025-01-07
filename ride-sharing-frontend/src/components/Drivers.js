import React, { useState, useEffect } from "react";
import { Container, TextField, Button, Paper, Typography, Snackbar, Alert } from "@mui/material";
import axios from "axios";
import DriversView from "./DriversView";  // Import the DriversView component

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [newDriver, setNewDriver] = useState({ name: "", phone: "" });
  const [error, setError] = useState("");  // State for error messages
  const [successMessage, setSuccessMessage] = useState("");  // State for success messages
  const [loading, setLoading] = useState(true);  // Loading state for fetching drivers

  // Fetch the list of drivers when the component mounts
  useEffect(() => {
    axios.get("http://127.0.0.1:5000/drivers")  // Adjust your API endpoint here
      .then((response) => {
        setDrivers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching drivers:", error);
        setError("Error fetching drivers. Please try again.");
        setLoading(false);
      });
  }, []);

  // Handle form submission to add a new driver
  const handleAddDriver = (e) => {
    e.preventDefault();

    // Sending the new driver data to the backend
    axios.post("http://127.0.0.1:5000/drivers", newDriver)  // Adjust API endpoint
      .then((response) => {
        setDrivers([...drivers, response.data]);  // Update state with the new driver
        setNewDriver({ name: "", phone: "" });  // Reset the form
        setSuccessMessage("Driver added successfully!");
      })
      .catch((error) => {
        console.error("Error adding driver:", error);
        setError("Error adding driver. Please try again.");
      });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Manage Drivers
      </Typography>

      {/* Success Message Snackbar */}
      {successMessage && (
        <Snackbar open autoHideDuration={6000} onClose={() => setSuccessMessage("")}>
          <Alert onClose={() => setSuccessMessage("")} severity="success">
            {successMessage}
          </Alert>
        </Snackbar>
      )}

      {/* Error Message Snackbar */}
      {error && (
        <Snackbar open autoHideDuration={6000} onClose={() => setError("")}>
          <Alert onClose={() => setError("")} severity="error">
            {error}
          </Alert>
        </Snackbar>
      )}

      {/* Add Driver Form */}
      <Paper sx={{ padding: 2, marginBottom: 3 }}>
        <form onSubmit={handleAddDriver}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newDriver.name}
            onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
            required
          />
          <TextField
            label="Phone"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newDriver.phone}
            onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Add Driver
          </Button>
        </form>
      </Paper>

      {/* List of Drivers */}
      {loading ? (
        <Typography>Loading drivers...</Typography>
      ) : (
        <DriversView drivers={drivers} />  // Pass drivers data to the DriversView component
      )}
    </Container>
  );
};

export default Drivers;
