import { createSvgIcon } from "@mui/material/utils";
import { useThemeContext } from "@shared/contexts/ThemeContext";
import { ReturnYouTubeDislikePath } from "./paths/ReturnYouTubeDislikePath";

export const useFillColor = (dark, light) => {
  const { mode } = useThemeContext();
  return mode ? dark : light;
};

export const ReturnYouTubeDislikeIcon = createSvgIcon(
  <ReturnYouTubeDislikePath />,
  "ReturnYouTubeDislike",
);
