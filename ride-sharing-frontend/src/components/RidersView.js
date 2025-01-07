import React from "react";
import { List, ListItem, ListItemText, Typography } from "@mui/material";

// RidersView component to render the list of riders
const RidersView = ({ riders }) => {
  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Existing Riders
      </Typography>
      {/* Check if riders are available */}
      {riders.length === 0 ? (
        <Typography>No riders available</Typography>
      ) : (
        <List>
          {riders.map((rider) => (
            <ListItem key={rider.rider_id} divider>
              <ListItemText
                primary={`Name: ${rider.name}, Phone: ${rider.phone}`}
                secondary={`Rider ID: ${rider.rider_id}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};

export default RidersView;
