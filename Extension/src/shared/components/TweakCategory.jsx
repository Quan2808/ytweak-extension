import { categories } from "@features/index";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import { useState } from "react";

export default function TweakCategory({
  categoryId,
  enabledMap,
  onToggle,
  onBack,
}) {
  const category = categories.find((c) => c.id === categoryId);
  if (!category) return null;

  // Khởi tạo state cho các tweak có extra UI
  const [extraValues, setExtraValues] = useState(() =>
    Object.fromEntries(
      category.tweaks
        .filter((t) => t.extra)
        .map((t) => [t.id, t.extraDefaultValue ?? null]),
    ),
  );

  const subheader = (
    <ListItem sx={{ px: 1, py: 0.5 }}>
      <IconButton onClick={onBack} size="small" sx={{ mr: 1 }}>
        <ArrowBackIcon fontSize="small" />
      </IconButton>
      <Typography variant="subtitle2" color="text.secondary">
        {category.label}
      </Typography>
    </ListItem>
  );

  return (
    <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
      <nav>
        <List dense subheader={subheader} sx={{ paddingTop: 0 }}>
          {category.tweaks.map((tweak) => {
            const ExtraUI = tweak.extra;
            const isEnabled = !!enabledMap[tweak.id];

            return (
              <>
                <ListItem key={tweak.id}>
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
                  <ExtraUI
                    key={`${tweak.id}-extra`}
                    value={extraValues[tweak.id]}
                    onChange={(val) =>
                      setExtraValues((prev) => ({ ...prev, [tweak.id]: val }))
                    }
                  />
                )}
              </>
            );
          })}
        </List>
      </nav>
    </Box>
  );
}
