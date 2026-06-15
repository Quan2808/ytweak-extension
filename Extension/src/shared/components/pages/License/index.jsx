import { Box, Divider, List, ListItem, Typography } from "@mui/material";
import { useMemo, useState } from "react";

import licensesData from "@shared/assets/licenses.json";
import { t } from "@shared/utils/i18n";

import Subheader from "@shared/components/PageHeader";
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

      let publisher = pkg.publisher;

      if (!publisher || publisher.toLowerCase() === "unknown") {
        const repoUrl = pkg.repository;
        if (repoUrl && typeof repoUrl === "string") {
          const repoMatch = repoUrl.match(
            /(?:github\.com|gitlab\.com)[:/]([^/]+)/i,
          );

          if (repoMatch && repoMatch[1]) {
            publisher = repoMatch[1];
          }
        }
      }

      if (!publisher) {
        publisher = "Unknown Publisher";
      }

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
      <Subheader title={t("license_title")} onBack={onBack} />

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
