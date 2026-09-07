import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

export const Heading = styled(Typography)(({ theme }) => ({
  fontWeight: 700,

  letterSpacing: "-0.03em",

  color: theme.palette.text.primary,
}));
