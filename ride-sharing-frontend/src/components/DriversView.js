import React from "react";
import { List, ListItem, ListItemText, Typography } from "@mui/material";

// DriversView component to render the list of drivers
const DriversView = ({ drivers }) => {
  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Existing Drivers
      </Typography>
      {/* Check if drivers are available */}
      {drivers.length === 0 ? (
        <Typography>No drivers available</Typography>
      ) : (
        <List>
          {drivers.map((driver) => (
            <ListItem key={driver.driver_id} divider>
              <ListItemText
                primary={`Name: ${driver.name}, Phone: ${driver.phone}`}
                secondary={`Driver ID: ${driver.driver_id}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};

export default DriversView;
