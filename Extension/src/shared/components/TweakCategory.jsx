import React, { useState } from "react";
import { Box, List, ListItem, ListItemText, Switch } from "@mui/material";
import { categories } from "@features/index";
import PageHeader from "@shared/components/PageHeader";

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

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "background.paper",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <PageHeader title={category.label} onBack={onBack} />

      <Box sx={{ overflowY: "auto", height: "calc(100% - 57px)" }}>
        <nav>
          <List sx={{ paddingTop: 0, paddingBottom: 0 }}>
            {category.tweaks.map((tweak) => {
              const ExtraUI = tweak.extra;
              const isEnabled = !!enabledMap[tweak.id];

              return (
                <Box key={tweak.id}>
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
                          setExtraValues((prev) => ({
                            ...prev,
                            [tweak.id]: val,
                          }))
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
    </Box>
  );
}
