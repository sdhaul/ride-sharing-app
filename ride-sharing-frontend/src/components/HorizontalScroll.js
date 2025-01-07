import React from "react";
import { ScrollMenu } from "react-horizontal-scrolling-menu";

const HorizontalScroll = () => {
  const items = [
    { id: "riders", component: <div>Riders</div> },
    { id: "zones", component: <div>Zones</div> },
    { id: "rides", component: <div>Rides</div> },
    { id: "drivers", component: <div>Drivers</div> },
  ];

  return (
    <ScrollMenu>
      {items.map(({ id, component }) => (
        <div key={id} style={{ margin: "0 20px", width: "80vw" }}>
          {component}
        </div>
      ))}
    </ScrollMenu>
  );
};

export default HorizontalScroll;
