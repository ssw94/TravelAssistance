import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <Box className="size-full">
      <Outlet/>
    </Box>
  );
};

export default RootLayout;
