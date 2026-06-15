import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  Divider,
  IconButton,
  Paper,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { t } from "@shared/utils/i18n";
import licensesData from "@shared/assets/licenses.json";

import LicenseAccordion from "./LicenseAccordion";

export default function License({ onBack }) {
  const [searchTerm, setSearchTerm] = useState("");

  const groupedLicenses = useMemo(() => {
    const filtered = Object.entries(licensesData).filter(([key]) =>
      key.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const groups = {};
    filtered.forEach(([key, pkg]) => {
      const match = key.match(/(.+)@(.+)$/);
      const name = match ? match[1] : key;
      const version = match ? match[2] : "unknown";
      const publisher = pkg.publisher || "Unknown";

      if (!groups[publisher]) groups[publisher] = [];
      groups[publisher].push({
        key,
        name,
        version,
        license: pkg.licenses,
        repository: pkg.repository,
      });
    });

    return Object.keys(groups)
      .sort()
      .reduce((acc, key) => {
        acc[key] = groups[key];
        return acc;
      }, {});
  }, [searchTerm]);

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "background.paper",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          borderRadius: 0,
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
            <Box sx={{ minWidth: 40 }}>
              <IconButton onClick={onBack} size="small" sx={{ ml: -0.75 }}>
                <ArrowBackIcon fontSize="small" />
              </IconButton>
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              {t("license_title")}
            </Typography>
          </ListItem>
        </List>
      </Paper>

      <Box sx={{ overflowY: "auto", height: "calc(100% - 57px)" }}>
        <List sx={{ paddingTop: 0 }}>
          {Object.entries(groupedLicenses).map(
            ([publisher, packages], index) => (
              <LicenseAccordion
                key={publisher}
                publisher={publisher}
                packages={packages}
                index={index}
              />
            ),
          )}

          <Divider sx={{ mx: 2, my: 3 }} />

          <ListItem sx={{ px: 3, py: 2 }}>
            <Typography variant="caption" color="text.secondary">
              All open source licenses are respected. Full license texts are
              available in the respective repositories.
            </Typography>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
}
