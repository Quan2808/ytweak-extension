import React from "react";
import { ListItem, ListItemText } from "@mui/material";

export default function IntroItem({ item }) {
  return (
    <ListItem sx={{ px: 2, py: 0.85 }}>
      {item.icon}
      <ListItemText
        id={item.id}
        primary={item.name}
        {...(item.description ? { secondary: item.description } : {})}
      />
    </ListItem>
  );
}
