import React, { useState, useEffect } from "react";
import { Container, TextField, Button, Paper, Typography, Snackbar, Alert } from "@mui/material";
import axios from "axios";
import RidersView from "./RidersView";  // Import the RidersView component

const Riders = () => {
  const [riders, setRiders] = useState([]);
  const [newRider, setNewRider] = useState({ name: "", phone: "" });
  const [error, setError] = useState("");  // State for error messages
  const [successMessage, setSuccessMessage] = useState("");  // State for success messages
  const [loading, setLoading] = useState(true);  // State to manage loading status

  // Fetch the list of riders when the component mounts
  useEffect(() => {
    axios.get("http://127.0.0.1:5000/riders")  // Adjust the API endpoint as necessary
      .then((response) => {
        setRiders(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching riders:", error);
        setError("Error fetching riders. Please try again.");
        setLoading(false);
      });
  }, []);

  // Handle form submission to add a new rider
  const handleAddRider = (e) => {
    e.preventDefault();

    // Sending the new rider data to the backend
    axios.post("http://127.0.0.1:5000/riders", newRider)  // Adjust the API endpoint as necessary
      .then((response) => {
        setRiders([...riders, response.data]);  // Update state with the new rider
        setNewRider({ name: "", phone: "" });  // Reset the form
        setSuccessMessage("Rider added successfully!");
      })
      .catch((error) => {
        console.error("Error adding rider:", error);
        setError("Error adding rider. Please try again.");
      });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Manage Riders</Typography>

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

      {/* Add Rider Form */}
      <Paper sx={{ padding: 2, marginBottom: 3 }}>
        <form onSubmit={handleAddRider}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newRider.name}
            onChange={(e) => setNewRider({ ...newRider, name: e.target.value })}
            required
          />
          <TextField
            label="Phone"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newRider.phone}
            onChange={(e) => setNewRider({ ...newRider, phone: e.target.value })}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Add Rider
          </Button>
        </form>
      </Paper>

      {/* List of Riders */}
      {loading ? (
        <Typography>Loading riders...</Typography>
      ) : (
        <RidersView riders={riders} />  // Pass the riders data to RidersView component
      )}
    </Container>
  );
};

export default Riders;
