import { t } from "@shared/utils/i18n";

const TWEAK_ID = "";

export default {
  id: TWEAK_ID,
  get name() {
    return t("example_tweak_name");
  },
  get description() {
    return t("example_tweak_desc");
  },
  default: false,
  enable() {},
  disable() {},
};
