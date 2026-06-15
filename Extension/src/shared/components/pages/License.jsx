import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  IconButton,
  Chip,
  Link,
  Tooltip,
  Paper, // ← thêm
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

import { t } from "@shared/utils/i18n";
import licensesData from "../../assets/licenses.json";

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
          bgcolor: "transparent",
        }}
      >
        <List sx={{ paddingTop: 0, pb: 0 }}>
          <ListItem
            sx={{
              px: 2,
              py: 1.5,
              display: "flex",
              alignItems: "center",
              minHeight: 56,
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

      <Box sx={{ overflowY: "auto", height: "calc(100% - 56px)" }}>
        <List sx={{ paddingTop: 0, pt: 0 }}>
          <Divider sx={{ mx: 2 }} />

          {Object.entries(groupedLicenses).map(
            ([publisher, packages], index) => (
              <Accordion
                key={publisher}
                disableGutters
                elevation={0}
                sx={{
                  bgcolor: "transparent",
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel-${index}-content`}
                  id={`panel-${index}-header`}
                  sx={{ px: 3 }}
                >
                  <ListItemText
                    primary={publisher}
                    secondary={`${packages.length} packages`}
                    primaryTypographyProps={{ fontWeight: 600 }}
                  />
                </AccordionSummary>

                <AccordionDetails sx={{ px: 2, pt: 0, pb: 2 }}>
                  {packages.map((pkg) => (
                    <ListItem key={pkg.key} disablePadding sx={{ mb: 1 }}>
                      <ListItemButton sx={{ py: 1.5, px: 2, borderRadius: 2 }}>
                        <ListItemText
                          primary={
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                                flexWrap: "wrap",
                              }}
                            >
                              <Typography fontWeight={500}>
                                {pkg.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                v{pkg.version}
                              </Typography>
                              <Chip
                                label={pkg.license}
                                size="small"
                                color="success"
                                variant="outlined"
                              />
                            </Box>
                          }
                          secondary={
                            pkg.repository && (
                              <Tooltip
                                title="Nhấp để mở repository trên GitHub"
                                arrow
                                placement="top"
                              >
                                <Link
                                  href={pkg.repository}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                    mt: 0.5,
                                    fontSize: "0.875rem",
                                    color: "primary.main",
                                    "&:hover": {
                                      color: "primary.dark",
                                      textDecoration: "underline",
                                    },
                                  }}
                                >
                                  Repository
                                  <OpenInNewIcon sx={{ fontSize: 16 }} />
                                </Link>
                              </Tooltip>
                            )
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </AccordionDetails>
              </Accordion>
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
