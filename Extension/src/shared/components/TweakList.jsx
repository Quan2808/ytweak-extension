import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import InfoOutlineRoundedIcon from "@mui/icons-material/InfoOutlineRounded";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import VideoSettingsRoundedIcon from "@mui/icons-material/VideoSettingsRounded";
import VideoLibraryOutlinedIcon from "@mui/icons-material/VideoLibraryOutlined";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import { categories } from "@features/index";
import { ReturnYouTubeDislikeIcon } from "@shared/icons";
import { t } from "@shared/utils/i18n";

const ICON_MAP = {
  Settings: <SettingsRoundedIcon />,
  Palette: <PaletteOutlinedIcon />,
  Tune: <TuneOutlinedIcon />,
  VideoSettings: <VideoSettingsRoundedIcon />,
  PlayArrow: <PlayArrowOutlinedIcon />,
  MoreHoriz: <MoreHorizOutlinedIcon />,
  RYD: <ReturnYouTubeDislikeIcon />,
  Introduce: <InfoOutlineRoundedIcon />,
  Feed: <VideoLibraryOutlinedIcon />,
};

export default function TweakList({ onNavigate }) {
  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "background.paper",
        height: "100%",
        overflowY: "auto",
      }}
    >
      <nav>
        <List sx={{ paddingTop: 0, paddingBottom: 0 }}>
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

          {categories.map((cat) => {
            const isDisabled =
              cat.component === null || cat.tweaks.length === 0;

            return (
              <ListItem key={cat.id} disablePadding>
                <ListItemButton
                  disabled={isDisabled}
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
            );
          })}
        </List>
      </nav>
    </Box>
  );
}
