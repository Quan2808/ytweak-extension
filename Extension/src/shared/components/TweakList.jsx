import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { t } from "@shared/utils/i18n";

import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import InfoOutlineRoundedIcon from "@mui/icons-material/InfoOutlineRounded";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import VideoSettingsRoundedIcon from "@mui/icons-material/VideoSettingsRounded";

import { ReturnYouTubeDislikeIcon } from "@shared/icons";

import { categories } from "@features/index";

const ICON_MAP = {
  Settings: <SettingsRoundedIcon />,
  Palette: <PaletteOutlinedIcon />,
  Tune: <TuneOutlinedIcon />,
  VideoSettings: <VideoSettingsRoundedIcon />,
  PlayArrow: <PlayArrowOutlinedIcon />,
  MoreHoriz: <MoreHorizOutlinedIcon />,
  RYD: <ReturnYouTubeDislikeIcon />,
  Introduce: <InfoOutlineRoundedIcon />,
};

export default function TweakList({ onNavigate }) {
  return (
    <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
      <nav>
        <List sx={{ paddingTop: 0 }}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => onNavigate("introduce_page")}
              sx={{ px: 2, py: 1.5 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {ICON_MAP.Introduce}
              </ListItemIcon>
              <ListItemText primary={t("introduce_title")} />
              <ArrowForwardOutlinedIcon
                sx={{ color: "text.disabled", fontSize: 20 }}
              />
            </ListItemButton>
          </ListItem>
          {categories.map((cat) => (
            <ListItem key={cat.id} disablePadding>
              <ListItemButton
                onClick={() => onNavigate(cat.id)}
                sx={{ px: 2, py: 1.5 }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {ICON_MAP[cat.icon] ?? <TuneOutlinedIcon />}
                </ListItemIcon>
                <ListItemText primary={cat.label} />
                <ArrowForwardOutlinedIcon
                  sx={{ color: "text.disabled", fontSize: 20 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </nav>
    </Box>
  );
}
