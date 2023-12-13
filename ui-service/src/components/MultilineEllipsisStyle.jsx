import { createStyles } from "@mantine/core";
export const useStyles = createStyles((theme, _params, getRef) => ({
  multilineEllipsis: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
  },
}));
