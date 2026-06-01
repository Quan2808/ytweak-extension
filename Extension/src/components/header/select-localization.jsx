import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Popper from "@mui/material/Popper";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import GTranslateIcon from "@mui/icons-material/GTranslate";
import { useI18n } from "../../utils/I18nContext";
import { Tooltip } from "@mui/material";
import { t } from "../../utils/i18n";

const languages = [
  { code: "en", label: "English" },
  { code: "vi", label: "Tiếng Việt" },
];

export default function LanguageSelector() {
  const { lang, changeLang } = useI18n();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => setOpen((prev) => !prev);

  const handleClose = (event) => {
    if (anchorRef.current?.contains(event.target)) return;
    setOpen(false);
  };

  const handleLanguageSelect = (code) => {
    changeLang(code);
    setOpen(false);
  };

  return (
    <>
      <Tooltip title={t("tooltip_language")} placement="left" arrow>
        <IconButton
          ref={anchorRef}
          size="medium"
          aria-controls={open ? "language-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-label="select language"
          aria-haspopup="true"
          onClick={handleToggle}
          color="inherit"
        >
          <GTranslateIcon />
        </IconButton>

        <Popper
          sx={{ zIndex: 1300 }}
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper elevation={4} sx={{ minWidth: 140 }}>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id="language-menu" autoFocusItem>
                    {languages.map((language) => (
                      <MenuItem
                        key={language.code}
                        selected={language.code === lang}
                        onClick={() => handleLanguageSelect(language.code)}
                      >
                        {language.label}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Tooltip>
    </>
  );
}
