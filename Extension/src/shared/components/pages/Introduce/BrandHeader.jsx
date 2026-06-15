import React from "react";
import { Box, Typography } from "@mui/material";
import { t } from "@shared/utils/i18n";

export default function BrandHeader() {
  return (
    <Box
      sx={{
        px: 2,
        pt: 3,
        pb: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
      }}
    >
      <Box
        component="img"
        src="assets/icons/logo-transparent.png"
        loading="lazy"
        sx={{
          height: 120,
          width: "auto",
          objectFit: "contain",
          mb: 0.5,
        }}
      />
      <Typography
        variant="h6"
        sx={{
          fontFamily: "'TWeak Logo', sans-serif !important",
          fontWeight: 700,
          fontSize: "1.75rem",
          letterSpacing: "-1.4px",
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        {t("appName")}
      </Typography>
    </Box>
  );
}
