import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";

export const Card = styled(MuiCard)(({ theme }) => ({
  borderRadius: 24,
  background: theme.palette.background.paper,
  backdropFilter: "blur(18px)",
  border: `1px solid ${theme.palette.divider}`,
  transition: "all .3s",
  boxShadow: "0 15px 45px rgba(15,23,42,.08)",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 25px 60px rgba(15,23,42,.15)",
  },
}));
