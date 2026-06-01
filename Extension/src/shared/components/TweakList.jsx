import { categories } from "@features/index";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import VideoSettingsIcon from "@mui/icons-material/VideoSettings";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { t } from "@shared/utils/i18n";

const ICON_MAP = {
  SettingsOutlined: <SettingsOutlinedIcon />,
  PaletteOutlined: <PaletteOutlinedIcon />,
  TuneOutlined: <TuneOutlinedIcon />,
  VideoSettings: <VideoSettingsIcon />,
  PlayArrowOutlined: <PlayArrowOutlinedIcon />,
};

export default function TweakList({ onNavigate }) {
  return (
    <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
      <nav>
        <List dense sx={{ paddingTop: 0 }}>
          {categories.map((cat) => (
            <ListItem key={cat.id} disablePadding>
              <ListItemButton onClick={() => onNavigate(cat.id)}>
                <ListItemIcon>
                  {ICON_MAP[cat.icon] ?? <TuneOutlinedIcon />}
                </ListItemIcon>
                <ListItemText
                  primary={cat.label}
                  secondary={t("category_tweakCount", cat.tweaks.length)}
                />
                <ArrowForwardOutlinedIcon sx={{ color: "text.disabled" }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        {/* <DiscreteSlider></DiscreteSlider> */}
      </nav>
    </Box>
  );
}
