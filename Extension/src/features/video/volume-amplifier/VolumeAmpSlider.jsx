import { Box, ListItem, Slider, Typography } from "@mui/material";
import { setAmplifierValue } from "./index";

export default function VolumeAmpSlider({ value, onChange }) {
  const handleChange = (_, newValue) => {
    onChange(newValue);
    setAmplifierValue(newValue);
  };

  return (
    <ListItem sx={{ padding: "4px 24px 8px" }}>
      <Box sx={{ width: "100%" }}>
        <Typography variant="caption" color="text.secondary">
          {value / 10}x
        </Typography>
        <Slider
          value={value}
          onChange={handleChange}
          valueLabelDisplay="auto"
          valueLabelFormat={(v) => `${v / 10}x`}
          step={10}
          marks
          min={10}
          max={50}
          sx={{ width: "96%" }}
        />
      </Box>
    </ListItem>
  );
}
