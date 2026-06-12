import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useState } from "react";

import { categories } from "@features/index";

export default function TweakCategory({
  categoryId,
  enabledMap,
  onToggle,
  onBack,
}) {
  const category = categories.find((c) => c.id === categoryId);

  const [extraValues, setExtraValues] = useState(() =>
    Object.fromEntries(
      (category?.tweaks ?? [])
        .filter((t) => t.extra)
        .map((t) => [t.id, t.extraDefaultValue ?? null]),
    ),
  );

  if (!category) return null;

  const subheader = (
    <ListItem
      sx={{
        px: 2,
        py: 1.5,
        display: "flex",
        alignItems: "center",
        minHeight: 56,
      }}
    >
      <Box sx={{ minWidth: 40, display: "flex", alignItems: "center" }}>
        <IconButton onClick={onBack} size="small" sx={{ ml: -0.75 }}>
          <ArrowBackIcon fontSize="small" />
        </IconButton>
      </Box>
      <Typography variant="subtitle1" component="div" sx={{ fontWeight: 500 }}>
        {category.label}
      </Typography>
    </ListItem>
  );

  return (
    <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
      <nav>
        {/* Để ý phần List: Tweak UI của các item con bên dưới cũng nên ép px: 2 cho đều */}
        <List subheader={subheader} sx={{ paddingTop: 0, paddingBottom: 0 }}>
          {category.tweaks.map((tweak) => {
            const ExtraUI = tweak.extra;
            const isEnabled = !!enabledMap[tweak.id];

            return (
              <Box key={tweak.id}>
                {" "}
                {/* Dùng Box bọc thay vì <> trống để tránh lỗi key của React Fragment */}
                <ListItem sx={{ px: 2, py: 1 }}>
                  <ListItemText
                    id={tweak.id}
                    primary={tweak.name}
                    {...(tweak.description !== null
                      ? { secondary: tweak.description }
                      : {})}
                  />
                  <Switch
                    edge="end"
                    checked={isEnabled}
                    onChange={() => onToggle(tweak.id)}
                    slotProps={{ input: { "aria-labelledby": tweak.id } }}
                  />
                </ListItem>
                {ExtraUI && isEnabled && (
                  <Box sx={{ px: 2, pb: 1 }}>
                    <ExtraUI
                      value={extraValues[tweak.id]}
                      onChange={(val) =>
                        setExtraValues((prev) => ({ ...prev, [tweak.id]: val }))
                      }
                    />
                  </Box>
                )}
              </Box>
            );
          })}
        </List>
      </nav>
    </Box>
  );
}
