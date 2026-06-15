import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  IconButton,
  Paper,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function Subheader({ title, onBack }) {
  return (
    <Paper
      elevation={0}
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        borderRadius: 0,
        bgcolor: "background.paper",
      }}
    >
      <List sx={{ paddingTop: 0, pb: 0 }}>
        <ListItem
          sx={{
            px: 2,
            py: 1.5,
            display: "flex",
            alignItems: "center",
            minHeight: 57,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box sx={{ minWidth: 40, display: "flex", alignItems: "center" }}>
            <IconButton onClick={onBack} size="small" sx={{ ml: -0.75 }}>
              <ArrowBackIcon fontSize="small" />
            </IconButton>
          </Box>
          <Typography
            variant="subtitle1"
            component="div"
            sx={{ fontWeight: 500 }}
          >
            {title}
          </Typography>
        </ListItem>
      </List>
    </Paper>
  );
}
