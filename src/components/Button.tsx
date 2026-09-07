import MuiButton from "@mui/material/Button";
import { styled } from "@mui/material/styles";

export const Button = styled(MuiButton)(({ theme }) => ({
  borderRadius: 14,
  textTransform: "none",
  fontWeight: 600,
  padding: "12px 24px",
  minHeight: 48,

  background: `linear-gradient(
      90deg,
      ${theme.palette.primary.main},
      ${theme.palette.info.main}
  )`,

  transition: "all .25s ease",

  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[8],
  },

  "&:active": {
    transform: "scale(.98)",
  },
}));
