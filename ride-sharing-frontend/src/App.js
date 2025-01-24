import React, { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid"; // Import UUID library
import {
  Box,
  Button,
  TextField,
  Typography,
  Switch,
  FormControlLabel,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 37.7749,
  lng: -122.4194,
};

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [newDriver, setNewDriver] = useState({
    name: "",
    latitude: null, // Store latitude separately
    longitude: null, // Store longitude separately
    availability: true, // Corrected field name
    rating: 5.0, // Default rating
  });

  const [markerPosition, setMarkerPosition] = useState(center);
  const [darkMode, setDarkMode] = useState(false);

  // Fetch all drivers
  const fetchAllDrivers = () => {
    axios
      .get("http://127.0.0.1:5000/drivers")
      .then((response) => {
        const rawData = response.data || [];
        const formattedData = rawData.map((driver) => ({
          id: driver[0],
          name: driver[1],
          latitude: driver[2], // Latitude from backend response
          longitude: driver[3], // Longitude from backend response
          availability: driver[4], // Corrected field name
          rating: driver[5],
        }));
        setDrivers(formattedData);
      })
      .catch(() => console.error("Error fetching drivers"));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (newDriver.latitude === null || newDriver.longitude === null) {
      alert("Please select a location on the map.");
      return;
    }

    if (!newDriver.name.trim()) {
      alert("Name is required.");
      return;
    }

    if (newDriver.rating < 0 || newDriver.rating > 5) {
      alert("Rating must be between 0 and 5.");
      return;
    }

    // Construct the payload with separate latitude and longitude
    const payload = {
      name: newDriver.name,
      latitude: newDriver.latitude,
      longitude: newDriver.longitude,
      availability: newDriver.availability,
      rating: newDriver.rating,
    };

    axios
      .post("http://127.0.0.1:5000/drivers", payload)
      .then(() => {
        fetchAllDrivers(); // Refresh drivers list
        resetForm();
      })
      .catch((error) => console.error("Error adding driver:", error));
  };

  // Reset form
  const resetForm = () => {
    setNewDriver({
      name: "",
      latitude: null, // Reset latitude
      longitude: null, // Reset longitude
      availability: true, // Corrected field name and reset default value
      rating: 5.0, // Reset default rating
    });
    setMarkerPosition(center);
  };

  // Handle map click to set latitude and longitude separately
  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMarkerPosition({ lat, lng });

    // Update newDriver with separate latitude and longitude
    setNewDriver({ ...newDriver, latitude: lat, longitude: lng });
  };

  useEffect(() => fetchAllDrivers(), []);

  return (
    <Box className={darkMode ? "dark-mode" : "light-mode"} sx={{ padding: "2rem", minHeight: "100vh" }}>
      {/* Header Section */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h3">Driver Management</Typography>
        <FormControlLabel control={<Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />} label="Dark Mode" />
      </Box>

      {/* Map Section */}
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10} onClick={handleMapClick}>
          {markerPosition && <Marker position={markerPosition} />}
        </GoogleMap>
      </LoadScript>

      {/* Form Section */}
      <Box component="form" onSubmit={handleSubmit} sx={{ marginTop: "2rem" }}>
        <TextField label="Name" value={newDriver.name} onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })} fullWidth margin="normal" required />
        <TextField label="Rating" type="number" value={newDriver.rating} onChange={(e) => setNewDriver({ ...newDriver, rating: parseFloat(e.target.value) })} fullWidth margin="normal" inputProps={{ step: "0.1", min: "0", max: "5" }} />
        <FormControlLabel control={<Switch checked={newDriver.availability} onChange={(e) => setNewDriver({ ...newDriver, availability: e.target.checked })} />} label="Availability" />
        <Typography>Selected Location:</Typography>
        <Typography>Latitude: {newDriver.latitude}</Typography>
        <Typography>Longitude: {newDriver.longitude}</Typography>
        <Button type="submit" variant="contained" sx={{ marginRight: "1rem" }}>Add Driver</Button>
        <Button variant="outlined" onClick={resetForm}>Reset</Button>
      </Box>

      {/* Drivers List Section */}
      <Typography variant="h5" sx={{ marginTop: "2rem" }}>Drivers List</Typography>
      <Grid container spacing={2}>
        {drivers.map((driver) => (
          <Grid item xs={12} sm={6} md={4} key={driver.id}>
            <Card className="driver-card">
              <CardContent>
                <Typography variant="h6">{driver.name}</Typography>
                <Typography>Latitude: {driver.latitude}</Typography>
                <Typography>Longitude: {driver.longitude}</Typography>
                <Typography>Rating: {driver.rating}</Typography>
                <Typography>Available? {driver.availability ? 'Yes' : 'No'}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Drivers;
