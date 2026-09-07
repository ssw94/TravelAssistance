import MuiBox from "@mui/material/Box";
import { styled } from "@mui/material/styles";

export const Box = styled(MuiBox)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(3),
  background: `
        radial-gradient(circle at top left,#DBEAFE 0%,transparent 25%),
        radial-gradient(circle at top right,#DCFCE7 0%,transparent 25%),
        radial-gradient(circle at bottom,#F5F3FF 0%,transparent 35%),
        ${theme.palette.background.default}
    `,
}));
