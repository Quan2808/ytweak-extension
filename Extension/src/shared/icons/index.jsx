import { createSvgIcon } from "@mui/material/utils";
import { useThemeContext } from "@shared/contexts/ThemeContext";

const useFillColor = (dark, light) => {
  const { mode } = useThemeContext();
  return mode ? dark : light;
};

const ReturnYouTubeDislikePath = () => {
  const thumbFill = useFillColor("#000", "#fff");

  return (
    <>
      <path
        d="M14.9 3H6c-.9 0-1.6.5-1.9 1.2l-3 7c-.1.3-.1.5-.1.7v2c0 1.1.9 2 2 2h6.3l-.9 4.5c-.1.5 0 1 .4 1.4l1.1 1.1 6.5-6.6c.4-.4.6-.9.6-1.4V5c-.1-1.1-1-2-2.1-2zm7.4 12.8h-2.9c-.4 0-.7-.3-.7-.7V3.9c0-.4.3-.7.7-.7h2.9c.4 0 .7.3.7.7V15c0 .4-.3.8-.7.8z"
        fill="currentColor"
      />
      <path d="m8 12.5 5.1-2.9L8 6.7v5.8z" fill={thumbFill} />
    </>
  );
};

export const ReturnYouTubeDislikeIcon = createSvgIcon(
  <ReturnYouTubeDislikePath />,
  "ReturnYouTubeDislike",
);
