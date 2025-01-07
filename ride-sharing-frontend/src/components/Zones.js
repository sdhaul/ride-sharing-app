import React, { useState, useEffect } from "react";
import { Container, TextField, Button, Paper, Typography, Snackbar, Alert } from "@mui/material";
import axios from "axios";
import ZonesView from "./ZonesView"; // Import the ZonesView component

const Zones = () => {
  const [zones, setZones] = useState([]);
  const [newZone, setNewZone] = useState({ name: "", coordinates: "" });
  const [loading, setLoading] = useState(true);  // Loading state for zones list
  const [error, setError] = useState("");  // For error messages
  const [successMessage, setSuccessMessage] = useState("");  // Success message for adding a zone

  // Fetch the list of zones from the backend when the component mounts
  useEffect(() => {
    axios.get("http://127.0.0.1:5000/zones")  // Adjust the API endpoint as needed
      .then((response) => {
        setZones(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching zones:", error);
        setError("Error fetching zones. Please try again.");
        setLoading(false);
      });
  }, []);

  // Handle adding a new zone
  const handleAddZone = (e) => {
    e.preventDefault();

    axios.post("http://127.0.0.1:5000/zones", newZone)  // Adjust the API endpoint as needed
      .then((response) => {
        setZones([...zones, response.data]);  // Update the zones list with the new zone
        setNewZone({ name: "", coordinates: "" });  // Reset form
        setSuccessMessage("Zone added successfully!");
      })
      .catch((error) => {
        console.error("Error adding zone:", error);
        setError("Error adding zone. Please try again.");
      });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Manage Zones</Typography>

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

      {/* Add Zone Form */}
      <Paper sx={{ padding: 2, marginBottom: 3 }}>
        <form onSubmit={handleAddZone}>
          <TextField
            label="Zone Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newZone.name}
            onChange={(e) => setNewZone({ ...newZone, name: e.target.value })}
            required
          />
          <TextField
            label="Coordinates"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newZone.coordinates}
            onChange={(e) => setNewZone({ ...newZone, coordinates: e.target.value })}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Add Zone
          </Button>
        </form>
      </Paper>

      {/* Display the list of zones */}
      {loading ? (
        <Typography>Loading zones...</Typography>
      ) : (
        <ZonesView zones={zones} />  // Pass the zones list to ZonesView component
      )}
    </Container>
  );
};

export default Zones;
