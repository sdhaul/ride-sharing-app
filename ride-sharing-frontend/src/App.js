import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  Grid,
} from "@mui/material";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./App.css"; // Custom CSS for transitions

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [newDriver, setNewDriver] = useState({
    id: null,
    name: "",
    location: "",
    available: true,
    rating: 0,
  });
  const [darkMode, setDarkMode] = useState(false); // Dark mode state

  // Create refs for each driver
  const refs = useRef({});

  // Fetch all drivers
  const fetchAllDrivers = () => {
    axios
      .get("http://127.0.0.1:5000/drivers")
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

        // Initialize refs for each driver
        refs.current = formattedData.reduce((acc, driver) => {
          acc[driver.id] = React.createRef();
          return acc;
        }, {});
      })
      .catch(() => console.error("Error fetching drivers"));
  };

  // Add or update a driver
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newDriver.id) {
      axios.put(`http://127.0.0.1:5000/drivers/${newDriver.id}`, newDriver).then(() => {
        fetchAllDrivers();
        resetForm();
      });
    } else {
      axios.post("http://127.0.0.1:5000/drivers", newDriver).then(() => {
        fetchAllDrivers();
        resetForm();
      });
    }
  };

  // Reset form
  const resetForm = () => {
    setNewDriver({ id: null, name: "", location: "", available: true, rating: 0 });
  };

  // Fetch drivers on mount
  useEffect(() => {
    fetchAllDrivers();
  }, []);

  return (
    <Box
      className={darkMode ? "dark-mode" : "light-mode"}
      sx={{
        padding: "2rem",
        minHeight: "100vh",
        transition: "background-color 0.5s ease",
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h3">Drivers Management</Typography>
        <FormControlLabel
          control={
            <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
          }
          label="Dark Mode"
        />
      </Box>

      {/* Driver List */}
      <Grid container spacing={2} sx={{ marginTop: "2rem" }}>
        <TransitionGroup component={null}>
          {drivers.map((driver) => (
            <CSSTransition
              key={driver.id}
              timeout={1000}
              classNames="fade"
              nodeRef={refs.current[driver.id]}
            >
              <Grid item xs={12} sm={6} md={4}>
                <Card
                  ref={refs.current[driver.id]}
                  sx={{
                    backgroundColor: darkMode ? "#333333" : "#ffffff",
                    color: darkMode ? "#ffffff" : "#000000",
                  }}
                >
                  <CardContent>
                    <Typography variant="h6">{driver.name}</Typography>
                    <Typography>Location: {driver.location}</Typography>
                    <Typography>Rating: {driver.rating}</Typography>
                    <Typography>Available: {driver.available ? "Yes" : "No"}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => setNewDriver(driver)}>
                      Edit
                    </Button>
                    <Button size="small" color="error">
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </Grid>

      {/* Form */}
      <Box component="form" onSubmit={handleSubmit} sx={{ marginTop: "2rem" }}>
        <Typography variant="h5">{newDriver.id ? "Update Driver" : "Add Driver"}</Typography>
        <TextField
          label="Name"
          value={newDriver.name}
          onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Location"
          value={newDriver.location}
          onChange={(e) => setNewDriver({ ...newDriver, location: e.target.value })}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Rating"
          type="number"
          value={newDriver.rating}
          onChange={(e) =>
            setNewDriver({ ...newDriver, rating: parseFloat(e.target.value) })
          }
          fullWidth
          margin="normal"
          inputProps={{ step: "0.1", min: "0", max: "5" }}
        />
        <FormControlLabel
          control={
            <Switch
              checked={newDriver.available}
              onChange={(e) =>
                setNewDriver({ ...newDriver, available: e.target.checked })
              }
            />
          }
          label="Available"
        />
        <Button type="submit" variant="contained" sx={{ marginRight: "1rem" }}>
          {newDriver.id ? "Update" : "Add"}
        </Button>
        <Button variant="outlined" onClick={resetForm}>
          Reset
        </Button>
      </Box>
    </Box>
  );
};

export default Drivers;
