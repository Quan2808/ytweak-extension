import React from "react";
import {
  Box,
  Typography,
  ListItem,
  ListItemText,
  ListItemButton,
  Chip,
  Link,
  Tooltip,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

export default function LicenseAccordion({ publisher, packages, index }) {
  return (
    <Accordion
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
                    <Typography fontWeight={500}>{pkg.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
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
  );
}
