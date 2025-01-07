import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import "react-horizontal-scrolling-menu/dist/styles.css";
import Drivers from "./components/Drivers";
import Riders from "./components/Riders";
import Rides from "./components/Rides";
import Zones from "./components/Zones";
import NorthernLights from "./components/NorthernLights";
import HorizontalScroll from "./components/HorizontalScroll"; // Assuming it's in the components folder
import { Navigate } from "react-router-dom";
import ErrorBoundary from './components/ErrorBoundary';  // Import ErrorBoundary

const App = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 500) {
      setIsScrolled(true);  // Enable horizontal scrolling after scrolling down 500px
    } else {
      setIsScrolled(false);  // Disable horizontal scrolling when at top
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <ErrorBoundary>  {/* Wrap the entire app content with ErrorBoundary */}
      <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
        {/* NorthernLights background */}
        <NorthernLights />

        {/* Main App Content */}
        <Router>
          {/* AppBar for Navigation */}
          <AppBar position="static" style={{ zIndex: 10 }}>
            <Toolbar>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Rideshare Management
              </Typography>
              <Button color="inherit" component={Link} to="/rides">
                Rides
              </Button>
              <Button color="inherit" component={Link} to="/drivers">
                Drivers
              </Button>
              <Button color="inherit" component={Link} to="/riders">
                Riders
              </Button>
              <Button color="inherit" component={Link} to="/zones">
                Zones
              </Button>
            </Toolbar>
          </AppBar>

          {/* Horizontal Scroll for quick navigation, only visible after scrolling */}
          {isScrolled && (
            <HorizontalScroll>
              <Button color="primary" component={Link} to="/rides">
                View Rides
              </Button>
              <Button color="primary" component={Link} to="/drivers">
                View Drivers
              </Button>
              <Button color="primary" component={Link} to="/riders">
                View Riders
              </Button>
              <Button color="primary" component={Link} to="/zones">
                View Zones
              </Button>
            </HorizontalScroll>
          )}

          {/* Routes for each view */}
          <Routes>
            <Route path="/" element={<Navigate to="/rides" />} />  {/* Redirect from / to /rides */}
            <Route path="/drivers" element={<Drivers />} />
            <Route path="/riders" element={<Riders />} />
            <Route path="/rides" element={<Rides />} />
            <Route path="/zones" element={<Zones />} />
          </Routes>
        </Router>
      </div>
    </ErrorBoundary>  
  );
};

export default App;
