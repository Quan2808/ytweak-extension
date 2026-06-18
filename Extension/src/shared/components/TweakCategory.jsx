import React, { useState } from "react";
import { Box, List, ListItem, ListItemText, Switch } from "@mui/material";
import PageHeader from "@shared/components/PageHeader";

/**
 * Props:
 *  - title      : string
 *  - tweaks     : Tweak[]
 *  - enabledMap : Record<string, boolean>
 *  - onToggle   : (tweakId: string) => void
 *  - onBack     : () => void
 *  - children   : ReactNode — custom UI phía TRÊN list
 *  - footer     : ReactNode — custom UI phía DƯỚI list
 */
export default function TweakCategory({
  title,
  tweaks = [],
  enabledMap,
  onToggle,
  onBack,
  children,
  footer,
}) {
  const [extraValues, setExtraValues] = useState(() =>
    Object.fromEntries(
      tweaks
        .filter((t) => t.extra)
        .map((t) => [t.id, t.extraDefaultValue ?? null]),
    ),
  );

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "background.paper",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <PageHeader title={title} onBack={onBack} />

      <Box sx={{ overflowY: "auto", height: "calc(100% - 57px)" }}>
        {children}

        <nav>
          <List sx={{ paddingTop: 0, paddingBottom: 0 }}>
            {tweaks.map((tweak) => {
              const ExtraUI = tweak.extra;
              const isEnabled = !!enabledMap[tweak.id];

              return (
                <Box key={tweak.id}>
                  <ListItem sx={{ px: 2, py: 1 }}>
                    <ListItemText
                      id={tweak.id}
                      primary={tweak.name}
                      {...(tweak.description != null
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

        {footer}
      </Box>
    </Box>
  );
}
